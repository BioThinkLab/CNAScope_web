import * as d3 from 'd3'
import parseNewick from "@/components/features/visualization/utils/newick"

const setRadius = (d, y0, k) => {
    d.radius = (y0 += d.data.length) * k
    if (d.children) d.children.forEach(d => setRadius(d, y0, k))
}

const maxLength = (d) => {
    return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0)
}

export const parseNewickTree = (newickTreeString, innerRadius) => {
    const root = d3.hierarchy(parseNewick(newickTreeString), d => d.children)
        .sum(d => d.children ? 0 : 1)
        .sort((a, b) => (a.value - b.value) || d3.ascending(a.data.length, b.data.length))

    d3.cluster()
        .size([360, innerRadius])
        .separation((a, b) => 1)
        (root)

    setRadius(root, root.data.length = 0, innerRadius / maxLength(root))

    // setDistanceToRoot(root)

    return root
}

function linkStep(startAngle, startRadius, endAngle, endRadius) {
    const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
    const s0 = Math.sin(startAngle);
    const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
    const s1 = Math.sin(endAngle);
    return "M" + startRadius * c0 + "," + startRadius * s0
        + (endAngle === startAngle ? "" : "A" + startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) + " " + startRadius * c1 + "," + startRadius * s1)
        + "L" + endRadius * c1 + "," + endRadius * s1;
}

export function linkConstant(d) {
    return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
}

export function nodePolarPosition(x, y) {
    return `rotate(${x - 90}) translate(${y},0)`
}

export function mouseovered(active) {
    return function (event, d) {
        d3.select(this).classed("label--active", active);
        do d3.select(d.linkNode).classed("link--active", active).raise();
        while (d = d.parent);
    }
}
