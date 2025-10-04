import * as d3 from 'd3'

import {venn, lossFunction, normalizeSolution, scaleSolution} from "./layout";
import {intersectionArea, distance, getCenter} from "./circleintersection";
import {nelderMead} from "fmin";

/*global console:true*/

export function VennDiagram() {
    let width = 600,
        height = 350,
        padding = 15,
        duration = 1000,
        orientation = Math.PI / 2,
        normalize = true,
        wrap = true,
        styled = true,
        fontSize = null,
        orientationOrder = null,

        // mimic the behaviour of d3.scale.category10 from the previous
        // version of d3
        colourMap = {},

        // so this is the same as d3.schemeCategory10, which is only defined in d3 4.0
        // since we can support older versions of d3 as long as we don't force this,
        // I'm hackily redefining below. TODO: remove this and change to d3.schemeCategory10
        colourScheme = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        colourIndex = 0,
        colours = (key) => {
            if (key in colourMap) {
                return colourMap[key];
            }
            const ret = colourMap[key] = colourScheme[colourIndex];
            colourIndex += 1;
            if (colourIndex >= colourScheme.length) {
                colourIndex = 0;
            }
            return ret;
        },
        layoutFunction = venn,
        loss = lossFunction;

    function chart(selection) {
        let data = selection.datum();

        // handle 0-sized sets by removing from input
        const toremove = {};
        data.forEach((datum) => {
            if (datum.size === 0 && datum.sets.length === 1) {
                toremove[datum.sets[0]] = 1;
            }
        });
        data = data.filter((datum) => !datum.sets.some((set) => set in toremove));

        let circles = {};
        let textCentres = {};

        if (data.length > 0) {
            let solution = layoutFunction(data, { lossFunction: loss });

            if (normalize) {
                solution = normalizeSolution(solution, orientation, orientationOrder);
            }

            circles = scaleSolution(solution, width, height, padding);
            textCentres = computeTextCentres(circles, data);
        }

        // Figure out the current label for each set. These can change
        // and D3 won't necessarily update (fixes https://github.com/benfred/venn.js/issues/103)
        const labels = {};
        data.forEach((datum) => {
            if (datum.label) {
                labels[datum.sets] = datum.label;
            }
        });

        const label = (d) => {
            if (d.sets in labels) {
                return labels[d.sets];
            }
            return d.sets.length === 1 ? `${d.sets[0]}` : '';
        };

        // create svg if not already existing
        selection.selectAll("svg").data([circles]).enter().append("svg");

        const svg = selection.select("svg")
            .attr("width", width)
            .attr("height", height);

        // to properly transition intersection areas, we need the
        // previous circles locations. load from elements
        const previous = {};
        let hasPrevious = false;
        svg.selectAll(".venn-area path").each(function (d) {
            const path = d3.select(this).attr("d");
            if ((d.sets.length === 1) && path) {
                hasPrevious = true;
                previous[d.sets[0]] = circleFromPath(path);
            }
        });

        // interpolate intersection area paths between previous and
        // current paths
        const pathTween = (d) => (t) => {
            const c = d.sets.map((set) => {
                let start = previous[set], end = circles[set];
                if (!start) {
                    start = { x: width / 2, y: height / 2, radius: 1 };
                }
                if (!end) {
                    end = { x: width / 2, y: height / 2, radius: 1 };
                }
                return {
                    x: start.x * (1 - t) + end.x * t,
                    y: start.y * (1 - t) + end.y * t,
                    radius: start.radius * (1 - t) + end.radius * t
                };
            });
            return intersectionAreaPath(c);
        };

        // update data, joining on the set ids
        const nodes = svg.selectAll(".venn-area")
            .data(data, (d) => d.sets);

        // create new nodes
        const enter = nodes.enter()
            .append('g')
            .attr("class", (d) => `venn-area venn-${d.sets.length === 1 ? "circle" : "intersection"}`)
            .attr("data-venn-sets", (d) => d.sets.join("_"));

        const enterPath = enter.append("path"),
            enterText = enter.append("text")
                .attr("class", "label")
                .text((d) => label(d))
                .attr("text-anchor", "middle")
                .attr("dy", ".35em")
                .attr("x", width / 2)
                .attr("y", height / 2);

        // apply minimal style if wanted
        if (styled) {
            enterPath.style("fill-opacity", "0")
                .filter((d) => d.sets.length === 1)
                .style("fill", (d) => colours(d.sets))
                .style("fill-opacity", ".25");

            enterText
                .style("fill", (d) => (d.sets.length === 1 ? colours(d.sets) : "#444"));
        }

        // update existing, using pathTween if necessary
        let update = selection;
        if (hasPrevious) {
            update = selection.transition("venn").duration(duration);
            update.selectAll("path")
                .attrTween("d", pathTween);
        } else {
            update.selectAll("path")
                .attr("d", (d) => intersectionAreaPath(d.sets.map((set) => circles[set])));
        }

        const updateText = update.selectAll("text")
            .filter((d) => d.sets in textCentres)
            .text((d) => label(d))
            .attr("x", (d) => Math.floor(textCentres[d.sets].x))
            .attr("y", (d) => Math.floor(textCentres[d.sets].y));

        if (wrap) {
            if (hasPrevious) {
                // d3 4.0 uses 'on' for events on transitions,
                // but d3 3.0 used 'each' instead. switch appropriately
                updateText.on("end", () => wrapText(circles, label));
            } else {
                updateText.each(() => wrapText(circles, label));
            }
        }

        // remove old
        const exit = nodes.exit().transition('venn').duration(duration).remove();
        exit.selectAll("path")
            .attrTween("d", pathTween);

        const exitText = exit.selectAll("text")
            .attr("x", width / 2)
            .attr("y", height / 2);

        // if we've been passed a fontSize explicitly, use it to
        // transition
        if (fontSize !== null) {
            enterText.style("font-size", "0px");
            updateText.style("font-size", fontSize);
            exitText.style("font-size", "0px");
        }

        return {
            circles,
            textCentres,
            nodes,
            enter,
            update,
            exit
        };
    }

    chart.wrap = (_) => {
        if (!arguments.length) return wrap;
        wrap = _;
        return chart;
    };

    chart.width = (_) => {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = (_) => {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.padding = (_) => {
        if (!arguments.length) return padding;
        padding = _;
        return chart;
    };

    chart.colours = (_) => {
        if (!arguments.length) return colours;
        colours = _;
        return chart;
    };

    chart.fontSize = (_) => {
        if (!arguments.length) return fontSize;
        fontSize = _;
        return chart;
    };

    chart.duration = (_) => {
        if (!arguments.length) return duration;
        duration = _;
        return chart;
    };

    chart.layoutFunction = (_) => {
        if (!arguments.length) return layoutFunction;
        layoutFunction = _;
        return chart;
    };

    chart.normalize = (_) => {
        if (!arguments.length) return normalize;
        normalize = _;
        return chart;
    };

    chart.styled = (_) => {
        if (!arguments.length) return styled;
        styled = _;
        return chart;
    };

    chart.orientation = (_) => {
        if (!arguments.length) return orientation;
        orientation = _;
        return chart;
    };

    chart.orientationOrder = (_) => {
        if (!arguments.length) return orientationOrder;
        orientationOrder = _;
        return chart;
    };

    chart.lossFunction = (_) => {
        if (!arguments.length) return loss;
        loss = _;
        return chart;
    };

    return chart;
}
// sometimes text doesn't fit inside the circle, if thats the case lets wrap
// the text here such that it fits
// todo: looks like this might be merged into d3 (
// https://github.com/mbostock/d3/issues/1642),
// also worth checking out is
// http://engineering.findthebest.com/wrapping-axis-labels-in-d3-js/
// this seems to be one of those things that should be easy but isn't
export function wrapText(circles, labeller) {
    return function () {
        const text = d3.select(this);
        const data = text.datum();
        const width = circles[data.sets[0]].radius || 50;
        const label = labeller(data) || '';

        const words = label.split(/\s+/).reverse();
        const maxLines = 3;
        const minChars = (label.length + words.length) / maxLines;
        let word = words.pop();
        let line = [word];
        let joined;
        let lineNumber = 0;
        const lineHeight = 1.1; // ems
        let tspan = text.text(null).append("tspan").text(word);

        while (words.length > 0) {
            word = words.pop();
            line.push(word);
            joined = line.join(" ");
            tspan.text(joined);
            if (joined.length > minChars && tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").text(word);
                lineNumber++;
            }
        }

        const initial = 0.35 - (lineNumber * lineHeight) / 2;
        const x = text.attr("x");
        const y = text.attr("y");

        text.selectAll("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", (d, i) => `${initial + i * lineHeight}em`);
    };
}

function circleMargin(current, interior, exterior) {
    let margin = interior[0].radius - distance(interior[0], current);
    for (let i = 1; i < interior.length; ++i) {
        const m = interior[i].radius - distance(interior[i], current);
        if (m <= margin) {
            margin = m;
        }
    }

    for (let i = 0; i < exterior.length; ++i) {
        const m = distance(exterior[i], current) - exterior[i].radius;
        if (m <= margin) {
            margin = m;
        }
    }
    return margin;
}

// Compute the center of some circles by maximizing the margin of
// the center point relative to the circles (interior) after subtracting
// nearby circles (exterior)
export function computeTextCentre(interior, exterior) {
    // Get an initial estimate by sampling around the interior circles
    // and taking the point with the biggest margin
    const points = [];
    for (let i = 0; i < interior.length; ++i) {
        const c = interior[i];
        points.push({ x: c.x, y: c.y });
        points.push({ x: c.x + c.radius / 2, y: c.y });
        points.push({ x: c.x - c.radius / 2, y: c.y });
        points.push({ x: c.x, y: c.y + c.radius / 2 });
        points.push({ x: c.x, y: c.y - c.radius / 2 });
    }
    let initial = points[0];
    let margin = circleMargin(points[0], interior, exterior);
    points.forEach((point) => {
        const m = circleMargin(point, interior, exterior);
        if (m >= margin) {
            initial = point;
            margin = m;
        }
    });

    // Maximize the margin numerically
    const solution = nelderMead(
        (p) => -1 * circleMargin({ x: p[0], y: p[1] }, interior, exterior),
        [initial.x, initial.y],
        { maxIterations: 500, minErrorDelta: 1e-10 }
    ).x;

    let ret = { x: solution[0], y: solution[1] };

    // Check solution, fallback as needed (happens if fully overlapped
    // etc)
    let valid = true;
    for (let i = 0; i < interior.length; ++i) {
        if (distance(ret, interior[i]) > interior[i].radius) {
            valid = false;
            break;
        }
    }

    for (let i = 0; i < exterior.length; ++i) {
        if (distance(ret, exterior[i]) < exterior[i].radius) {
            valid = false;
            break;
        }
    }

    if (!valid) {
        if (interior.length === 1) {
            ret = { x: interior[0].x, y: interior[0].y };
        } else {
            const areaStats = {};
            intersectionArea(interior, areaStats);

            if (areaStats.arcs.length === 0) {
                ret = { x: 0, y: -1000, disjoint: true };
            } else if (areaStats.arcs.length === 1) {
                ret = { x: areaStats.arcs[0].circle.x, y: areaStats.arcs[0].circle.y };
            } else if (exterior.length) {
                // Try again without other circles
                ret = computeTextCentre(interior, []);
            } else {
                // Take average of all the points in the intersection polygon.
                // This should basically never happen and has some issues:
                // https://github.com/benfred/venn.js/issues/48#issuecomment-146069777
                ret = getCenter(areaStats.arcs.map((a) => a.p1));
            }
        }
    }

    return ret;
}

// Given a dictionary of {setid : circle}, returns a dictionary of setid to list of circles that completely overlap it
export function getOverlappingCircles(circles) {
    const ret = {};
    const circleids = Object.keys(circles);
    circleids.forEach((circleid) => {
        ret[circleid] = [];
    });

    circleids.forEach((circleidA, i) => {
        const a = circles[circleidA];
        circleids.slice(i + 1).forEach((circleidB) => {
            const b = circles[circleidB];
            const d = distance(a, b);

            if (d + b.radius <= a.radius + 1e-10) {
                ret[circleidB].push(circleidA);
            } else if (d + a.radius <= b.radius + 1e-10) {
                ret[circleidA].push(circleidB);
            }
        });
    });
    return ret;
}

// Compute the center of some circles by maximizing the margin of the center point relative to the circles (interior) after subtracting nearby circles (exterior)
export function computeTextCentres(circles, areas) {
    const ret = {};
    const overlapped = getOverlappingCircles(circles);

    areas.forEach((area) => {
        const areaids = {};
        const exclude = {};

        area.sets.forEach((set) => {
            areaids[set] = true;
            const overlaps = overlapped[set] || [];
            overlaps.forEach((overlap) => {
                exclude[overlap] = true;
            });
        });

        const interior = [];
        const exterior = [];
        Object.keys(circles).forEach((setid) => {
            if (areaids[setid]) {
                interior.push(circles[setid]);
            } else if (!exclude[setid]) {
                exterior.push(circles[setid]);
            }
        });

        const centre = computeTextCentre(interior, exterior);
        ret[area.sets] = centre;
        if (centre.disjoint && area.size > 0) {
            console.warn(`WARNING: area ${area.sets} not represented on screen`);
        }
    });

    return ret;
}

// Sorts all areas in the venn diagram, so that a particular area is on top (relativeTo) and all other areas are sorted by size
export function sortAreas(div, relativeTo) {
    const overlaps = getOverlappingCircles(div.selectAll("svg").datum());
    const exclude = {};

    relativeTo.sets.forEach((check) => {
        Object.keys(overlaps).forEach((setid) => {
            const overlap = overlaps[setid];
            if (overlap.includes(check)) {
                exclude[setid] = true;
            }
        });
    });

    const shouldExclude = (sets) => sets.every((set) => exclude[set]);

    div.selectAll("g").sort((a, b) => {
        if (a.sets.length !== b.sets.length) {
            return a.sets.length - b.sets.length;
        }

        if (a === relativeTo) {
            return shouldExclude(b.sets) ? -1 : 1;
        }
        if (b === relativeTo) {
            return shouldExclude(a.sets) ? 1 : -1;
        }

        return b.size - a.size;
    });
}

// Generates an SVG path for a circle given the center (x, y) and radius (r)
export function circlePath(x, y, r) {
    return `
        M ${x} ${y}
        m ${-r} 0
        a ${r} ${r} 0 1 0 ${r * 2} 0
        a ${r} ${r} 0 1 0 ${-r * 2} 0
    `;
}

// Inverse of the circlePath function, returns a circle object from an SVG path
export function circleFromPath(path) {
    const tokens = path.split(' ');
    return {
        x: parseFloat(tokens[1]),
        y: parseFloat(tokens[2]),
        radius: -parseFloat(tokens[4]),
    };
}

// Returns an SVG path for the intersection area of a bunch of circles
export function intersectionAreaPath(circles) {
    const stats = {};
    intersectionArea(circles, stats);
    const arcs = stats.arcs;

    if (arcs.length === 0) {
        return "M 0 0";
    } else if (arcs.length === 1) {
        const circle = arcs[0].circle;
        return circlePath(circle.x, circle.y, circle.radius);
    } else {
        let ret = [`M ${arcs[0].p2.x} ${arcs[0].p2.y}`];
        arcs.forEach((arc) => {
            const { circle, p1 } = arc;
            const wide = arc.width > circle.radius;
            ret.push(`A ${circle.radius} ${circle.radius} 0 ${wide ? 1 : 0} 1 ${p1.x} ${p1.y}`);
        });
        return ret.join(" ");
    }
}
