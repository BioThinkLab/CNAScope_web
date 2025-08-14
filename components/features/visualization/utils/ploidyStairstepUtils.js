import * as d3 from 'd3'
import {
    hg19ChromosomeStartPositions, hg19ChromosomeTicks,
    hg19ChromosomeXDomain,
    hg38ChromosomeStartPositions, hg38ChromosomeTicks,
    hg38ChromosomeXDomain,
} from "@/components/features/visualization/utils/chromosomeUtils"

export const parseCNAMatrixToNodePairs = (matrix, columns, version) => {
    const chromosomeStartPositions = version === 'hg19' ? hg19ChromosomeStartPositions : hg38ChromosomeStartPositions

    let { nodePairs, prevValue, prevEnd } = init(matrix, columns)

    for (let i = 0; i < columns.length; i++) {
        const currentValue = matrix[columns[i]]

        const match = columns[i].match(/chr([XY\d]+):(\d+)-(\d+)/)
        const chr = `chr${match[1]}`
        const start = parseInt(match[2]) + chromosomeStartPositions[chr]
        const end = parseInt(match[3]) + chromosomeStartPositions[chr]

        if (prevValue !== currentValue) {
            nodePairs.push([start, currentValue])

            prevValue = currentValue
        }
        prevEnd = end

        if (i === columns.length - 1) {
            nodePairs.push([end, currentValue])
        }
    }

    return nodePairs
}

export const initFigure = (width, height, config, baselineCNA, version) => {
    const chromosomeXDomain = version === 'hg19' ? hg19ChromosomeXDomain : hg38ChromosomeXDomain
    const chromosomeTicks = version === 'hg19' ? hg19ChromosomeTicks : hg38ChromosomeTicks

    // Calculate global inner width and height.
    const innerWidth = width - config.chart.marginLeft - config.chart.marginRight
    const innerHeight = height - config.chart.marginTop - config.chart.marginBottom

    // Calculate Line Chart settings.
    const yPadding = 45 + config.chart.marginTop
    const lineChartWidth = innerWidth
    const lineChartHeight = innerHeight - yPadding
    const xRange = [config.chart.marginLeft, config.chart.marginLeft + lineChartWidth]
    const yRange = [config.chart.marginTop + yPadding + lineChartHeight, config.chart.marginTop + yPadding]

    const x = d3.scaleLinear()
        .domain(chromosomeXDomain)
        .range([xRange[0], xRange[1]])

    const CNARange = baselineCNA === 0 ? [-3, 3] : [0, 10]

    const y = d3.scaleLinear()
        .domain([CNARange[0], CNARange[1]])
        .range([yRange[0], yRange[1]])

    // Layout and style function
    const line = (data, x) => {
        return d3.line()
            .curve(d3.curveStepAfter)
            .x(d => x(d[0]))
            .y(d => y(d[1]))
            (data)
    }

    const xAxis = (g, x) => {
        const ticks = Object.keys(chromosomeTicks)
        g.call(d3.axisBottom(x).tickValues(ticks).tickFormat(d => chromosomeTicks[d]))
            .call(
                g => g.selectAll('.tick line')
                    .attr('y2', (d, i) => i % 2 === 0 ? '6' : '15')
            ).call(
            g => g.selectAll('.tick text')
                .attr('y', (d, i) => i % 2 === 0 ? '9' : '18')
        )
    }

    return {
        xRange,
        yRange,
        x,
        y,
        xAxis,
        line
    }
}

const init = (groupedCNV, columns) => {
    const match = columns[0].match(/chr[\w]+:(\d+)-(\d+)/)
    const first = groupedCNV[columns[0]]

    const prevValue = first
    const prevEnd = parseInt(match[2])
    const nodePairs = [[parseInt(match[1]), first]]

    return {
        nodePairs,
        prevValue,
        prevEnd
    }
}
