import * as d3 from "d3"
import { Heap } from "heap-js"
import { parseNewickTree } from "@/components/features/visualization/utils/TreeUtils"

const SCROLLBAR_HEIGHT = 16

export const initFigureConfig = (height, cluster, config) => {
    const svgHeight = height - SCROLLBAR_HEIGHT
    const innerHeight = svgHeight - config.chart.margin * 2
    const yTitleHeight = config.title.marginTop + config.title.marginBottom + Math.ceil(config.title.fontSize * 1.31)
    const figureSize = innerHeight - yTitleHeight - config.chart.axisWidth

    const rowLegendNum = Math.floor(figureSize / (config.legend.height + config.legend.itemVerticalGap))
    const rowNum = Math.ceil(cluster / rowLegendNum)

    const innerWidth = figureSize + config.chart.axisWidth + (rowNum - 1) * config.legend.itemHorizontalGap + rowNum * config.legend.width + config.legend.marginLeft
    const svgWidth = innerWidth + config.chart.margin * 2

    const xOffsetScatterPlot = config.chart.axisWidth
    const yOffsetScatterPlot = yTitleHeight
    const yOffsetXAxis = yTitleHeight + figureSize

    const xOffsetLegend = config.chart.axisWidth + figureSize + config.legend.marginLeft
    const yOffsetLegend = rowNum === 1 ? (
        yTitleHeight + (figureSize - config.legend.height * cluster - config.legend.itemVerticalGap * (cluster - 1)) / 2
    ) : (
        yTitleHeight + (figureSize - config.legend.height * rowLegendNum - config.legend.itemVerticalGap * (rowLegendNum - 1)) / 2
    )

    const xRange = [0, figureSize]
    const yRange = [figureSize, 0]

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    return {
        svgWidth,
        svgHeight,
        innerWidth,
        figureSize,
        rowLegendNum,
        xOffsetScatterPlot,
        yOffsetScatterPlot,
        yOffsetXAxis,
        xOffsetLegend,
        yOffsetLegend,
        xRange,
        yRange,
        colorScale
    }
}

export const initAxisDomain = (embeddingMethod, extents) => {
    const axisDomain = [
        Math.min(extents[`${embeddingMethod}1`].min, extents[`${embeddingMethod}2`].min),
        Math.max(extents[`${embeddingMethod}1`].max, extents[`${embeddingMethod}2`].max),
    ]

    return [Math.floor(axisDomain[0] / 5) * 5, Math.ceil(axisDomain[1] / 5) * 5]
}

export const initAxis = (axisDomain, xRange, yRange) => {
    const x = d3.scaleLinear()
        .domain(axisDomain)
        .range(xRange)

    const y = d3.scaleLinear()
        .domain(axisDomain)
        .range(yRange)

    return {
        x,
        y
    }
}

export const clusterPruning = (newick, cluster) => {
    const root = parseNewickTree(newick)

    if (root.leaves().length < cluster) return null

    const leaves = new Heap((a, b) => a.data.distanceToRoot - b.data.distanceToRoot)
    leaves.push(root)

    while (leaves.length !== cluster) {
        const leaf = leaves.pop()

        leaves.push(...leaf.children)

        if (leaves.peek().children === undefined) break
    }

    const prunedLeaves = leaves.toArray().sort((a, b) => b.x - a.x)

    return prunedLeaves.map((leaf, index) =>
        [
            index + 1,
            leaf.leaves().map(item => item.data.name)
        ]
    )
}
