import * as d3 from "d3"

const SCROLLBAR_HEIGHT = 16

export const initFigureConfig = (height, config) => {
    const svgHeight = height - SCROLLBAR_HEIGHT
    const innerHeight = svgHeight - config.chart.margin * 2
    const yTitleHeight = config.title.marginTop + config.title.marginBottom + Math.ceil(config.title.fontSize * 1.31)
    const figureSize = innerHeight - yTitleHeight - config.chart.axisWidth

    const innerWidth = figureSize + config.chart.axisWidth
    const svgWidth = innerWidth + config.chart.margin * 2

    const xOffsetScatterPlot = config.chart.axisWidth
    const yOffsetScatterPlot = yTitleHeight
    const yOffsetXAxis = yTitleHeight + figureSize

    const xRange = [0, figureSize]
    const yRange = [figureSize, 0]

    return {
        svgWidth,
        svgHeight,
        innerWidth,
        figureSize,
        xOffsetScatterPlot,
        yOffsetScatterPlot,
        yOffsetXAxis,
        xRange,
        yRange
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

