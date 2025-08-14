import * as d3 from "d3"
import {
    hg19NoSexChromosomeDomain,
    hg38NoSexChromosomeDomain
} from "@/components/features/visualization/utils/chromosomeUtils"

export const initFigureConfig = (
    width,
    height,
    pageSize,
    config
) => {
    const innerWidth = width - config.chart.marginX * 2
    const innerHeight = height - config.chart.marginY * 2
    const titleHeight = config.title.marginTop + config.title.marginBottom + Math.ceil(config.title.fontSize * 1.31)

    const figureHeight = innerHeight - titleHeight
    const yOffsetFigure = titleHeight
    const figureWidth = innerWidth - config.label.width * 2 - 2 * config.ploidyStairstep.marginX
    const xOffsetFigure = config.label.width + config.ploidyStairstep.marginX

    const yAxisLength = (figureWidth - (pageSize - 1) * config.ploidyStairstep.chartGap) / pageSize
    const xAxisRange = [0, figureHeight]

    const yOffsetLabel = titleHeight
    const xOffsetAmpLabel = 0
    const xOffsetDelLabel = config.label.width + figureWidth + config.ploidyStairstep.marginX * 2

    const xOffsetMetaMatrix = xOffsetFigure
    const yOffsetMetaMatrix = figureHeight  + titleHeight

    return {
        figureHeight,
        figureWidth,
        yOffsetFigure,
        xOffsetFigure,
        yAxisLength,
        xAxisRange,
        yOffsetLabel,
        xOffsetAmpLabel,
        xOffsetDelLabel,
        xOffsetMetaMatrix,
        yOffsetMetaMatrix
    }
}

export const createRecurrentEventsAxis = (yAxisLength, xAxisRange, pageSize, chartGap, baselineCNA, version) => {
    const noSexChromosomeXDomain = version === 'hg19' ? hg19NoSexChromosomeDomain : hg38NoSexChromosomeDomain
    const yDomain = baselineCNA === 2 ? [0, 10] : [-1, 1]

    const xAxis = d3.scaleLinear()
        .domain(noSexChromosomeXDomain)
        .range(xAxisRange)

    const calculateYRange = (i, gap, length) => {
        return i === 0 ? (
            [0, length]
        ) : (
            [i * (gap + length), i * (gap + length) + length]
        )
    }

    const yAxisList = Array.from({ length: pageSize }, (_, i) => (
        d3.scaleLinear()
            .domain(yDomain)
            .range(calculateYRange(i, chartGap, yAxisLength))
    ))

    return {
        xAxis,
        yAxisList
    }
}

