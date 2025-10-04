import {nelderMead, bisect, conjugateGradient, zeros, zerosM, norm2, scale} from 'fmin';
import {intersectionArea, circleOverlap, circleCircleIntersection, distance} from './circleintersection';

/** Given a list of set objects and their corresponding overlaps,
 * updates the (x, y, radius) attribute on each set such that their positions
 * roughly correspond to the desired overlaps */
export function venn(areas, parameters = {}) {
    const { maxIterations = 500, initialLayout = bestInitialLayout, lossFunction = lossFunction } = parameters;

    // Add missing pairwise areas as having 0 size
    areas = addMissingAreas(areas);

    // Initial layout is done greedily
    let circles = initialLayout(areas, parameters);

    // Transform x/y coordinates to a vector to optimize
    const initial = [];
    const setids = [];
    Object.keys(circles).forEach((setid) => {
        initial.push(circles[setid].x);
        initial.push(circles[setid].y);
        setids.push(setid);
    });

    // Optimize initial layout from our loss function
    let totalFunctionCalls = 0;
    const solution = nelderMead(
        (values) => {
            totalFunctionCalls += 1;
            const current = {};
            for (let i = 0; i < setids.length; ++i) {
                const setid = setids[i];
                current[setid] = {
                    x: values[2 * i],
                    y: values[2 * i + 1],
                    radius: circles[setid].radius,
                };
            }
            return lossFunction(current, areas);
        },
        initial,
        parameters
    );

    // Transform solution vector back to x/y points
    const positions = solution.x;
    setids.forEach((setid, i) => {
        circles[setid].x = positions[2 * i];
        circles[setid].y = positions[2 * i + 1];
    });

    return circles;
}

const SMALL = 1e-10;

/** Returns the distance necessary for two circles of radius r1 + r2 to
 * have the overlap area 'overlap' */
export function distanceFromIntersectArea(r1, r2, overlap) {
    // Handle complete overlapped circles
    if (Math.min(r1, r2) * Math.min(r1, r2) * Math.PI <= overlap + SMALL) {
        return Math.abs(r1 - r2);
    }

    return bisect((distance) => circleOverlap(r1, r2, distance) - overlap, 0, r1 + r2);
}

/** Missing pair-wise intersection area data can cause problems:
 * treating as an unknown means that sets will be laid out overlapping,
 * which isn't what people expect. To reflect that we want disjoint sets
 * here, set the overlap to 0 for all missing pairwise set intersections */
function addMissingAreas(areas) {
    areas = [...areas];  // Clone the areas array to avoid mutating the input

    const ids = [];
    const pairs = new Set();
    areas.forEach((area) => {
        if (area.sets.length === 1) {
            ids.push(area.sets[0]);
        } else if (area.sets.length === 2) {
            const [a, b] = area.sets;
            pairs.add(`${a},${b}`);
            pairs.add(`${b},${a}`);
        }
    });

    ids.sort();

    for (let i = 0; i < ids.length; ++i) {
        for (let j = i + 1; j < ids.length; ++j) {
            const a = ids[i];
            const b = ids[j];
            if (!pairs.has(`${a},${b}`)) {
                areas.push({ sets: [a, b], size: 0 });
            }
        }
    }

    return areas;
}

/** Returns two matrices, one of the euclidean distances between the sets
 * and the other indicating if there are subset or disjoint set relationships */
export function getDistanceMatrices(areas, sets, setids) {
    const distances = zerosM(sets.length, sets.length);
    const constraints = zerosM(sets.length, sets.length);

    areas.filter((x) => x.sets.length === 2).forEach((current) => {
        const left = setids[current.sets[0]];
        const right = setids[current.sets[1]];
        const r1 = Math.sqrt(sets[left].size / Math.PI);
        const r2 = Math.sqrt(sets[right].size / Math.PI);
        const distance = distanceFromIntersectArea(r1, r2, current.size);

        distances[left][right] = distances[right][left] = distance;

        // Update constraints to indicate if it's a subset or disjoint relationship
        let c = 0;
        if (current.size + 1e-10 >= Math.min(sets[left].size, sets[right].size)) {
            c = 1;
        } else if (current.size <= 1e-10) {
            c = -1;
        }
        constraints[left][right] = constraints[right][left] = c;
    });

    return { distances, constraints };
}

/** Computes the gradient and loss simultaneously for our constrained MDS optimizer */
function constrainedMDSGradient(x, fxprime, distances, constraints) {
    let loss = 0;
    fxprime.fill(0);

    for (let i = 0; i < distances.length; ++i) {
        const xi = x[2 * i];
        const yi = x[2 * i + 1];
        for (let j = i + 1; j < distances.length; ++j) {
            const xj = x[2 * j];
            const yj = x[2 * j + 1];
            const dij = distances[i][j];
            const constraint = constraints[i][j];

            const squaredDistance = (xj - xi) ** 2 + (yj - yi) ** 2;
            const distance = Math.sqrt(squaredDistance);
            const delta = squaredDistance - dij ** 2;

            // Skip if constraint is satisfied
            if ((constraint > 0 && distance <= dij) || (constraint < 0 && distance >= dij)) {
                continue;
            }

            loss += 2 * delta ** 2;

            fxprime[2 * i] += 4 * delta * (xi - xj);
            fxprime[2 * i + 1] += 4 * delta * (yi - yj);

            fxprime[2 * j] += 4 * delta * (xj - xi);
            fxprime[2 * j + 1] += 4 * delta * (yj - yi);
        }
    }
    return loss;
}

/** Takes the best working variant of either constrained MDS or greedy */
export function bestInitialLayout(areas, params) {
    let initial = greedyLayout(areas, params);
    const loss = params.lossFunction || lossFunction;

    // Greedy layout is sufficient for all 2/3 circle cases. Try constrained MDS for higher-order problems
    if (areas.length >= 8) {
        const constrained = constrainedMDSLayout(areas, params);
        const constrainedLoss = loss(constrained, areas);
        const greedyLoss = loss(initial, areas);

        if (constrainedLoss + 1e-8 < greedyLoss) {
            initial = constrained;
        }
    }

    return initial;
}

/** Use the constrained MDS variant to generate an initial layout */
export function constrainedMDSLayout(areas, params = {}) {
    const { restarts = 10 } = params;

    // Bidirectionally map sets to a rowid (so we can create a matrix)
    const sets = [];
    const setids = {};
    areas.forEach((area) => {
        if (area.sets.length === 1) {
            setids[area.sets[0]] = sets.length;
            sets.push(area);
        }
    });

    const matrices = getDistanceMatrices(areas, sets, setids);
    let { distances, constraints } = matrices;

    // Keep distances bounded, things get messed up otherwise.
    const norm = norm2(distances.map(norm2)) / distances.length;
    distances = distances.map((row) => row.map((value) => value / norm));

    const obj = (x, fxprime) => constrainedMDSGradient(x, fxprime, distances, constraints);

    let best, current;
    for (let i = 0; i < restarts; ++i) {
        const initial = zeros(distances.length * 2).map(Math.random);

        current = conjugateGradient(obj, initial, params);
        if (!best || current.fx < best.fx) {
            best = current;
        }
    }

    const positions = best.x;

    // Translate rows back to (x, y, radius) coordinates
    const circles = {};
    sets.forEach((set, i) => {
        circles[set.sets[0]] = {
            x: positions[2 * i] * norm,
            y: positions[2 * i + 1] * norm,
            radius: Math.sqrt(set.size / Math.PI),
        };
    });

    // Optionally save the history
    if (params.history) {
        params.history.forEach((entry) => {
            scale(entry.x, norm);
        });
    }

    return circles;
}

/** Lays out a Venn diagram greedily, going from most overlapped sets to
 * least overlapped, attempting to position each new set such that the
 * overlapping areas to already positioned sets are basically right */
export function greedyLayout(areas, params) {
    const loss = params?.lossFunction || lossFunction;
    const circles = {};
    const setOverlaps = {};

    // Define a circle for each set
    areas.forEach((area) => {
        if (area.sets.length === 1) {
            const set = area.sets[0];
            circles[set] = {
                x: 1e10,
                y: 1e10,
                rowid: Object.keys(circles).length,
                size: area.size,
                radius: Math.sqrt(area.size / Math.PI),
            };
            setOverlaps[set] = [];
        }
    });

    areas = areas.filter((a) => a.sets.length === 2);

    // Map each set to a list of all the other sets that overlap it
    areas.forEach((current) => {
        let weight = current.hasOwnProperty('weight') ? current.weight : 1.0;
        const [left, right] = current.sets;

        // Completely overlapped circles shouldn't be positioned early here
        if (current.size + SMALL >= Math.min(circles[left].size, circles[right].size)) {
            weight = 0;
        }

        setOverlaps[left].push({ set: right, size: current.size, weight });
        setOverlaps[right].push({ set: left, size: current.size, weight });
    });

    // Get list of most overlapped sets
    const mostOverlapped = Object.keys(setOverlaps).map((set) => {
        const size = setOverlaps[set].reduce((acc, overlap) => acc + overlap.size * overlap.weight, 0);
        return { set, size };
    });

    // Sort by size descending
    mostOverlapped.sort((a, b) => b.size - a.size);

    // Keep track of what sets have been laid out
    const positioned = {};
    const isPositioned = (element) => positioned[element.set];

    // Adds a point to the output
    const positionSet = (point, index) => {
        circles[index].x = point.x;
        circles[index].y = point.y;
        positioned[index] = true;
    };

    // Add most overlapped set at (0,0)
    positionSet({ x: 0, y: 0 }, mostOverlapped[0].set);

    // Process remaining sets
    for (let i = 1; i < mostOverlapped.length; ++i) {
        const setIndex = mostOverlapped[i].set;
        const overlap = setOverlaps[setIndex].filter(isPositioned);
        const set = circles[setIndex];

        overlap.sort((a, b) => b.size - a.size);

        if (overlap.length === 0) {
            throw new Error("ERROR: missing pairwise overlap information");
        }

        const points = [];
        overlap.forEach((overlapItem, j) => {
            const p1 = circles[overlapItem.set];
            const d1 = distanceFromIntersectArea(set.radius, p1.radius, overlapItem.size);

            // Sample positions at 90 degrees for maximum aesthetics
            points.push({ x: p1.x + d1, y: p1.y });
            points.push({ x: p1.x - d1, y: p1.y });
            points.push({ y: p1.y + d1, x: p1.x });
            points.push({ y: p1.y - d1, x: p1.x });

            // If we have at least 2 overlaps, try analytical positions
            for (let k = j + 1; k < overlap.length; ++k) {
                const p2 = circles[overlap[k].set];
                const d2 = distanceFromIntersectArea(set.radius, p2.radius, overlap[k].size);

                const extraPoints = circleCircleIntersection(
                    { x: p1.x, y: p1.y, radius: d1 },
                    { x: p2.x, y: p2.y, radius: d2 }
                );

                extraPoints.forEach((point) => points.push(point));
            }
        });

        // We have some candidate positions for the set, examine loss
        let bestLoss = 1e50;
        let bestPoint = points[0];

        points.forEach((point) => {
            circles[setIndex].x = point.x;
            circles[setIndex].y = point.y;
            const localLoss = loss(circles, areas);
            if (localLoss < bestLoss) {
                bestLoss = localLoss;
                bestPoint = point;
            }
        });

        positionSet(bestPoint, setIndex);
    }

    return circles;
}

/** Given a bunch of sets, and the desired overlaps between these sets - computes
 * the distance from the actual overlaps to the desired overlaps. Note that
 * this method ignores overlaps of more than 2 circles */
export function lossFunction(sets, overlaps) {
    let output = 0;

    const getCircles = (indices) => indices.map((i) => sets[i]);

    overlaps.forEach((area) => {
        if (area.sets.length === 1) {
            return;
        }

        let overlap;
        if (area.sets.length === 2) {
            const left = sets[area.sets[0]];
            const right = sets[area.sets[1]];
            overlap = circleOverlap(left.radius, right.radius, distance(left, right));
        } else {
            overlap = intersectionArea(getCircles(area.sets));
        }

        const weight = area.hasOwnProperty('weight') ? area.weight : 1.0;
        output += weight * (overlap - area.size) ** 2;
    });

    return output;
}

/** Orientates a bunch of circles to point in orientation */
function orientateCircles(circles, orientation, orientationOrder) {
    if (orientationOrder === null) {
        circles.sort((a, b) => b.radius - a.radius);
    } else {
        circles.sort(orientationOrder);
    }

    // Shift circles so largest circle is at (0, 0)
    if (circles.length > 0) {
        const largestX = circles[0].x;
        const largestY = circles[0].y;

        circles.forEach((circle) => {
            circle.x -= largestX;
            circle.y -= largestY;
        });
    }

    if (circles.length === 2) {
        // If the second circle is a subset of the first, arrange it off to one side.
        const dist = distance(circles[0], circles[1]);
        if (dist < Math.abs(circles[1].radius - circles[0].radius)) {
            circles[1].x = circles[0].x + circles[0].radius - circles[1].radius - 1e-10;
            circles[1].y = circles[0].y;
        }
    }

    // Rotate circles so that second largest is at an angle of 'orientation' from largest
    if (circles.length > 1) {
        const rotation = Math.atan2(circles[1].x, circles[1].y) - orientation;
        const c = Math.cos(rotation);
        const s = Math.sin(rotation);

        circles.forEach((circle) => {
            const { x, y } = circle;
            circle.x = c * x - s * y;
            circle.y = s * x + c * y;
        });
    }

    // Mirror solution if third solution is above the plane specified by the first two circles
    if (circles.length > 2) {
        let angle = Math.atan2(circles[2].x, circles[2].y) - orientation;
        angle = (angle + 2 * Math.PI) % (2 * Math.PI); // Normalize the angle

        if (angle > Math.PI) {
            const slope = circles[1].y / (1e-10 + circles[1].x);
            circles.forEach((circle) => {
                const d = (circle.x + slope * circle.y) / (1 + slope ** 2);
                circle.x = 2 * d - circle.x;
                circle.y = 2 * d * slope - circle.y;
            });
        }
    }
}

/** Clusters circles into disjoint sets using union-find */
export function disjointCluster(circles) {
    // Union-find clustering to get disjoint sets
    circles.forEach((circle) => { circle.parent = circle; });

    // Path compression step in union-find
    const find = (circle) => {
        if (circle.parent !== circle) {
            circle.parent = find(circle.parent);
        }
        return circle.parent;
    };

    const union = (x, y) => {
        const xRoot = find(x);
        const yRoot = find(y);
        xRoot.parent = yRoot;
    };

    // Get the union of all overlapping sets
    for (let i = 0; i < circles.length; ++i) {
        for (let j = i + 1; j < circles.length; ++j) {
            const maxDistance = circles[i].radius + circles[j].radius;
            if (distance(circles[i], circles[j]) + 1e-10 < maxDistance) {
                union(circles[j], circles[i]);
            }
        }
    }

    // Find all the disjoint clusters and group them together
    const disjointClusters = {};
    circles.forEach((circle) => {
        const setid = find(circle).parent.setid;
        if (!disjointClusters[setid]) {
            disjointClusters[setid] = [];
        }
        disjointClusters[setid].push(circle);
    });

    // Cleanup bookkeeping
    circles.forEach((circle) => { delete circle.parent; });

    // Return in a more usable form
    return Object.values(disjointClusters);
}

/** Returns the bounding box of a set of circles */
function getBoundingBox(circles) {
    const minMax = (d) => {
        const hi = Math.max(...circles.map((c) => c[d] + c.radius));
        const lo = Math.min(...circles.map((c) => c[d] - c.radius));
        return { max: hi, min: lo };
    };

    return { xRange: minMax('x'), yRange: minMax('y') };
}

/** Normalizes the solution and orients the circles */
export function normalizeSolution(solution, orientation = Math.PI / 2, orientationOrder = null) {
    // Work with a list instead of a dictionary and take a copy so we don't mutate input
    let circles = [];
    Object.keys(solution).forEach((setid) => {
        const previous = solution[setid];
        circles.push({
            x: previous.x,
            y: previous.y,
            radius: previous.radius,
            setid,
        });
    });

    // Get all the disjoint clusters
    const clusters = disjointCluster(circles);

    // Orientate all disjoint sets and get sizes
    clusters.forEach((cluster) => {
        orientateCircles(cluster, orientation, orientationOrder);
        const bounds = getBoundingBox(cluster);
        cluster.size = (bounds.xRange.max - bounds.xRange.min) * (bounds.yRange.max - bounds.yRange.min);
        cluster.bounds = bounds;
    });

    clusters.sort((a, b) => b.size - a.size);

    // Orientate the largest at (0,0), and get the bounds
    circles = clusters[0];
    let returnBounds = circles.bounds;

    const spacing = (returnBounds.xRange.max - returnBounds.xRange.min) / 50;

    function addCluster(cluster, right, bottom) {
        if (!cluster) return;

        const bounds = cluster.bounds;
        let xOffset, yOffset, centreing;

        if (right) {
            xOffset = returnBounds.xRange.max - bounds.xRange.min + spacing;
        } else {
            xOffset = returnBounds.xRange.max - bounds.xRange.max;
            centreing = (bounds.xRange.max - bounds.xRange.min) / 2 - (returnBounds.xRange.max - returnBounds.xRange.min) / 2;
            if (centreing < 0) xOffset += centreing;
        }

        if (bottom) {
            yOffset = returnBounds.yRange.max - bounds.yRange.min + spacing;
        } else {
            yOffset = returnBounds.yRange.max - bounds.yRange.max;
            centreing = (bounds.yRange.max - bounds.yRange.min) / 2 - (returnBounds.yRange.max - returnBounds.yRange.min) / 2;
            if (centreing < 0) yOffset += centreing;
        }

        cluster.forEach((circle) => {
            circle.x += xOffset;
            circle.y += yOffset;
            circles.push(circle);
        });
    }

    let index = 1;
    while (index < clusters.length) {
        addCluster(clusters[index], true, false);
        addCluster(clusters[index + 1], false, true);
        addCluster(clusters[index + 2], true, true);
        index += 3;

        returnBounds = getBoundingBox(circles);
    }

    // Convert back to solution form
    const ret = {};
    circles.forEach((circle) => {
        ret[circle.setid] = circle;
    });

    return ret;
}

/** Scales a solution from venn.venn or venn.greedyLayout such that it fits in
 * a rectangle of width/height - with padding around the borders. also
 * centers the diagram in the available space at the same time */
export function scaleSolution(solution, width, height, padding) {
    const circles = [];
    const setids = [];

    Object.keys(solution).forEach((setid) => {
        setids.push(setid);
        circles.push(solution[setid]);
    });

    width -= 2 * padding;
    height -= 2 * padding;

    const bounds = getBoundingBox(circles);
    const { xRange, yRange } = bounds;

    if (xRange.max === xRange.min || yRange.max === yRange.min) {
        console.log("not scaling solution: zero size detected");
        return solution;
    }

    const xScaling = width / (xRange.max - xRange.min);
    const yScaling = height / (yRange.max - yRange.min);
    const scaling = Math.min(yScaling, xScaling);

    // While we're at it, center the diagram too
    const xOffset = (width - (xRange.max - xRange.min) * scaling) / 2;
    const yOffset = (height - (yRange.max - yRange.min) * scaling) / 2;

    const scaled = {};
    circles.forEach((circle, i) => {
        scaled[setids[i]] = {
            radius: scaling * circle.radius,
            x: padding + xOffset + (circle.x - xRange.min) * scaling,
            y: padding + yOffset + (circle.y - yRange.min) * scaling,
        };
    });

    return scaled;
}
