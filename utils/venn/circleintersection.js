const SMALL = 1e-10;

/** Returns the intersection area of a bunch of circles (where each circle
 is an object having an x,y and radius property) */
export function intersectionArea(circles, stats) {
    // Get all the intersection points of the circles
    const intersectionPoints = getIntersectionPoints(circles);

    // Filter out points that aren't included in all the circles
    const innerPoints = intersectionPoints.filter(p => containedInCircles(p, circles));

    let arcArea = 0, polygonArea = 0, arcs = [];

    // If we have intersection points that are within all the circles,
    // then figure out the area contained by them
    if (innerPoints.length > 1) {
        // Sort the points by angle from the center of the polygon
        const center = getCenter(innerPoints);
        innerPoints.forEach(p => {
            p.angle = Math.atan2(p.x - center.x, p.y - center.y);
        });
        innerPoints.sort((a, b) => b.angle - a.angle);

        // Iterate over all points, get arc between the points
        // and update the areas
        let p2 = innerPoints[innerPoints.length - 1];
        innerPoints.forEach((p1, i) => {
            // Update polygon area easily
            polygonArea += (p2.x + p1.x) * (p1.y - p2.y);

            // Update the arc area
            const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
            let arc = null;

            p1.parentIndex.forEach(j => {
                if (p2.parentIndex.includes(p1.parentIndex[j])) {
                    const circle = circles[p1.parentIndex[j]];
                    let a1 = Math.atan2(p1.x - circle.x, p1.y - circle.y);
                    let a2 = Math.atan2(p2.x - circle.x, p2.y - circle.y);

                    let angleDiff = a2 - a1;
                    if (angleDiff < 0) angleDiff += 2 * Math.PI;

                    const a = a2 - angleDiff / 2;
                    let width = distance(midPoint, {
                        x: circle.x + circle.radius * Math.sin(a),
                        y: circle.y + circle.radius * Math.cos(a)
                    });

                    // Clamp the width to the largest it can actually be (to prevent overflow due to floating point errors)
                    if (width > circle.radius * 2) {
                        width = circle.radius * 2;
                    }

                    // Pick the circle whose arc has the smallest width
                    if (!arc || arc.width > width) {
                        arc = { circle, width, p1, p2 };
                    }
                }
            });

            if (arc) {
                arcs.push(arc);
                arcArea += circleArea(arc.circle.radius, arc.width);
                p2 = p1;
            }
        });
    } else {
        // No intersection points, either disjoint or completely overlapped
        let smallest = circles[0];
        circles.forEach(circle => {
            if (circle.radius < smallest.radius) smallest = circle;
        });

        // Ensure the smallest circle is completely contained in all the other circles
        let disjoint = false;
        circles.forEach(circle => {
            if (distance(circle, smallest) > Math.abs(smallest.radius - circle.radius)) {
                disjoint = true;
            }
        });

        if (disjoint) {
            arcArea = polygonArea = 0;
        } else {
            arcArea = Math.PI * smallest.radius * smallest.radius;
            arcs.push({
                circle: smallest,
                p1: { x: smallest.x, y: smallest.y + smallest.radius },
                p2: { x: smallest.x - SMALL, y: smallest.y + smallest.radius },
                width: smallest.radius * 2
            });
        }
    }

    polygonArea /= 2;

    if (stats) {
        stats.area = arcArea + polygonArea;
        stats.arcArea = arcArea;
        stats.polygonArea = polygonArea;
        stats.arcs = arcs;
        stats.innerPoints = innerPoints;
        stats.intersectionPoints = intersectionPoints;
    }

    return arcArea + polygonArea;
}

/** Returns whether a point is contained by all of a list of circles */
export function containedInCircles(point, circles) {
    return circles.every(circle => distance(point, circle) <= circle.radius + SMALL);
}

/** Gets all intersection points between a bunch of circles */
function getIntersectionPoints(circles) {
    const ret = [];
    circles.forEach((circle, i) => {
        circles.slice(i + 1).forEach((otherCircle, j) => {
            const intersect = circleCircleIntersection(circle, otherCircle);
            intersect.forEach(p => {
                p.parentIndex = [i, i + j + 1];
                ret.push(p);
            });
        });
    });
    return ret;
}

/** Circular segment area calculation. See http://mathworld.wolfram.com/CircularSegment.html */
export function circleArea(r, width) {
    return r * r * Math.acos(1 - width / r) - (r - width) * Math.sqrt(width * (2 * r - width));
}

/** Euclidean distance between two points */
export function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

/** Returns the overlap area of two circles of radius r1 and r2 - that
 have their centers separated by distance d. Simpler, faster
 circle intersection for only two circles */
export function circleOverlap(r1, r2, d) {
    // No overlap
    if (d >= r1 + r2) {
        return 0;
    }

    // Completely overlapped
    if (d <= Math.abs(r1 - r2)) {
        return Math.PI * Math.min(r1, r2) ** 2;
    }

    const w1 = r1 - (d ** 2 - r2 ** 2 + r1 ** 2) / (2 * d);
    const w2 = r2 - (d ** 2 - r1 ** 2 + r2 ** 2) / (2 * d);
    return circleArea(r1, w1) + circleArea(r2, w2);
}

/** Given two circles (containing a x/y/radius attributes),
 returns the intersecting points if possible.
 Note: doesn't handle cases where there are infinitely many
 intersection points (circles are equivalent), or only one intersection point */
export function circleCircleIntersection(p1, p2) {
    const d = distance(p1, p2);
    const r1 = p1.radius;
    const r2 = p2.radius;

    // If too far away, or self-contained, can't be done
    if (d >= r1 + r2 || d <= Math.abs(r1 - r2)) {
        return [];
    }

    const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
    const h = Math.sqrt(r1 ** 2 - a ** 2);
    const x0 = p1.x + a * (p2.x - p1.x) / d;
    const y0 = p1.y + a * (p2.y - p1.y) / d;
    const rx = -(p2.y - p1.y) * (h / d);
    const ry = -(p2.x - p1.x) * (h / d);

    return [
        { x: x0 + rx, y: y0 - ry },
        { x: x0 - rx, y: y0 + ry }
    ];
}

/** Returns the center of a bunch of points */
export function getCenter(points) {
    const center = { x: 0, y: 0 };
    points.forEach(p => {
        center.x += p.x;
        center.y += p.y;
    });
    center.x /= points.length;
    center.y /= points.length;
    return center;
}
