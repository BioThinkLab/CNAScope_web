import * as d3 from 'd3'
import _ from "lodash"
import {
    createChromosomeSorter,
    hg19ChromosomeLength,
    hg19ChromosomeRanges,
    hg19ChromosomeStartPositions,
    hg19ChromosomeXDomain,
    hg19NoSexChromosomeDomain,
    hg38ChromosomeLength,
    hg38ChromosomeRanges,
    hg38ChromosomeStartPositions,
    hg38ChromosomeXDomain,
    hg38NoSexChromosomeDomain
} from "@/components/features/visualization/utils/chromosomeUtils"

export const preprocessDataNew = (ampRegions, delRegions, scoresGISTIC, version) => {
    // Amp regions preprocess.
    const significantAmpRegions = preprocessRegions(ampRegions)
    const ampScoresGISTIC = scoresGISTIC.filter(record => record.type === 'Amp')
    const spiltAmpRegionsMap = spiltRegions(significantAmpRegions, ampScoresGISTIC, version)

    // Del regions preprocess.
    const significantDelRegions = preprocessRegions(delRegions)
    const delScoresGISTIC = scoresGISTIC.filter(record => record.type === 'Del')
    const spiltDelRegionsMap = spiltRegions(significantDelRegions, delScoresGISTIC, version)

    return {
        significantAmpRegions,
        spiltAmpRegionsMap,
        significantDelRegions,
        spiltDelRegionsMap
    }
}

export const preprocessRegions = (regions) => {
    const processedRegions = []
    for (const region of regions) {
        const boundary = parseRegionBoundary(region.boundaries)
        processedRegions.push({
            cytoband: region.cytoband,
            start: boundary.range[0],
            end: boundary.range[1],
            genes: region.genes,
            chromosome: boundary.chromosome
        })
    }

    return _.orderBy(
        processedRegions.sort((a, b) => a.start - b.start),
        [
            item => parseInt(item.chromosome.replace('chr', ''), 10),
            'start'
        ],
        ['asc', 'asc']
    )
}

const parseRegionBoundary = (boundary) => {
    const match = boundary.match(/chr([XY\d]+):(\d+)-(\d+)/)
    const chr = `chr${match[1]}`
    const start = parseInt(match[2])
    const end = parseInt(match[3])

    return {
        chromosome: chr,
        range: [start, end]
    }
}

export const spiltRegions = (significantRegions, regions, version) => {
    const chromosomeStartPositions = version === 'hg19' ? hg19ChromosomeStartPositions : hg38ChromosomeStartPositions

    const chromosomeList =
        Object.keys(
            chromosomeStartPositions
        ).filter(
            key => !['chrX', 'chrY'].includes(key)
        ).sort(
            createChromosomeSorter()
        )

    const chromosomeRegionsMap = chromosomeList.reduce((acc, chr) => {
        acc[chr] = []
        return acc
    }, {})

    for (const region of regions) {
        chromosomeRegionsMap[region.chromosome].push(region)
    }

    const result = {}
    for (const chromosome of chromosomeList) {
        const chromosomeRegions = chromosomeRegionsMap[chromosome]
        const chromosomeSignificantRegions = significantRegions.filter(
            region => region.chromosome === chromosome
        )

        const splitResult = splitSingleChromosomeRegionsByOverlap(chromosomeRegions, chromosomeSignificantRegions)
        result[chromosome] = {
            normalRegions: splitResult.nonOverlappingRegions,
            significantRegions: splitResult.overlappingRegions
        }
    }

    return result
}

const splitSingleChromosomeRegionsByOverlap = (regions, significantRegions) => {
    const overlappingRegions = []
    const nonOverlappingRegions = []

    for (const region of regions) {
        let fragments = [region]

        for (const sig of significantRegions) {
            const newFragments = []

            for (const frag of fragments) {
                // No overlap
                if (frag.end < sig.start || frag.start > sig.end) {
                    newFragments.push(frag)
                } else {
                    // Overlapping part
                    const overlapStart = Math.max(frag.start, sig.start)
                    const overlapEnd = Math.min(frag.end, sig.end)
                    overlappingRegions.push(
                        {
                            ...frag,
                            start: overlapStart,
                            end: overlapEnd,
                        }
                    )

                    // Left non-overlapping part — right aligned to overlapStart
                    if (frag.start < overlapStart) {
                        newFragments.push(
                            {
                                ...frag,
                                end: overlapStart
                            }
                        )
                    }

                    // Right non-overlapping part — left aligned to overlapEnd
                    if (frag.end > overlapEnd) {
                        newFragments.push(
                            {
                                ...frag,
                                start: overlapEnd
                            }
                        )
                    }
                }
            }

            fragments = newFragments
        }

        nonOverlappingRegions.push(...fragments)
    }

    return { overlappingRegions, nonOverlappingRegions }
}

export const transformRegionsToNodes = (regionsMap, valueType, chromosome) => {
    if (chromosome === 'all') {
        const normalNodes = []
        const significantNodes = []

        for (const chromosome of Object.keys(regionsMap).sort(createChromosomeSorter())) {
            normalNodes.push(
                ...extractSingleChromosomeNodes(
                    regionsMap[chromosome].normalRegions,
                    chromosome,
                    valueType,
                    true
                )
            )
            significantNodes.push(
                ...extractSingleChromosomeNodes(
                    regionsMap[chromosome].significantRegions,
                    chromosome,
                    valueType,
                    true
                )
            )
        }

        return {
            normalNodes: normalNodes,
            significantNodes: significantNodes
        }
    } else {
        return {
            normalNodes: extractSingleChromosomeNodes(
                regionsMap[chromosome].normalRegions,
                chromosome,
                valueType,
                false
            ),
            significantNodes: extractSingleChromosomeNodes(
                regionsMap[chromosome].significantRegions,
                chromosome,
                valueType,
                false
            )
        }
    }
}

const extractSingleChromosomeNodes = (regions, chromosome, valueType, isGlobalCoordinate, version) => {
    const chromosomeLength = version === 'hg19' ? hg19ChromosomeLength : hg38ChromosomeLength

    if (regions.length === 0) {
        return [
            {
                x: calculateGenomeCoordinate(1, chromosome, isGlobalCoordinate, version),
                y: 0
            },
            {
                x: calculateGenomeCoordinate(chromosomeLength[chromosome], chromosome, isGlobalCoordinate, version),
                y: 0
            }
        ]
    }

    const nodes = [
        {
            x: calculateGenomeCoordinate(1, chromosome, isGlobalCoordinate, version),
            y: 0
        },
        {
            x: calculateGenomeCoordinate(regions[0].start, chromosome, isGlobalCoordinate, version),
            y: regions[0][valueType]
        }
    ]
    let prevValue = regions[0][valueType]
    let prevEnd = calculateGenomeCoordinate(regions[0].end, chromosome, isGlobalCoordinate, version)
    for (const region of regions.slice(1)) {
        const start = calculateGenomeCoordinate(region.start, chromosome, isGlobalCoordinate, version)
        const end = calculateGenomeCoordinate(region.end, chromosome, isGlobalCoordinate, version)
        const value = region[valueType]

        if (prevEnd + 1 === start) {
            if (prevValue !== value) {
                nodes.push({
                    x: start,
                    y: value
                })
            }
        } else {
            nodes.push({
                x: prevEnd,
                y: 0
            })
            nodes.push({
                x: start,
                y: value
            })
        }

        prevEnd = end
        prevValue = value
    }

    if (prevEnd !== calculateGenomeCoordinate(chromosomeLength[chromosome], chromosome, isGlobalCoordinate, version)) {
        nodes.push({
            x: prevEnd,
            y: 0
        })
        nodes.push({
            x: calculateGenomeCoordinate(chromosomeLength[chromosome], chromosome, isGlobalCoordinate, version),
            y: 0
        })
    } else {
        nodes.push({
            x: calculateGenomeCoordinate(chromosomeLength[chromosome], chromosome, isGlobalCoordinate, version),
            y: 0
        })
    }

    return nodes
}

const calculateGenomeCoordinate = (position, chromosome, isGlobalCoordinate, version) => {
    const chromosomeStartPositions = version ? hg19ChromosomeStartPositions : hg38ChromosomeStartPositions

    if (isGlobalCoordinate) {
        return position + chromosomeStartPositions[chromosome]
    } else {
        return position
    }
}

export const calculateYAxisMax = (scoresGISTIC, chromosome, valueType) => {
    const filteredScoresGISTIC =
        chromosome === 'all' ? (
            scoresGISTIC
        ) : (
            scoresGISTIC.filter(record => record.chromosome === chromosome)
        )

    return Math.ceil(
        filteredScoresGISTIC.reduce(
            (max, r) => {
                const val = r[valueType]

                return val > max ? val : max
            },
            -Infinity
        )
    )
}

export const initFigureConfig = (
    width,
    height,
    config
) => {
    const innerWidth = width - config.chart.marginX * 2
    const innerHeight = height - config.chart.marginY * 2
    const titleHeight = config.title.marginTop + config.title.marginBottom + Math.ceil(config.title.fontSize * 1.31)
    const legendHeight = config.legend.marginTop + config.legend.marginBottom + config.legend.height

    const figureHeight = innerHeight - titleHeight - legendHeight - 2 * config.label.height
    const yOffsetFigure = titleHeight + config.label.height
    const figureWidth = innerWidth
    const xOffsetFigure = 0

    const xOffsetLegend = (innerWidth - (config.legend.width * 2 + config.legend.itemGap)) / 2
    const yOffsetLegend = innerHeight - config.legend.marginBottom - config.legend.height

    const yAxisLength = (figureHeight - config.chromosomeAxis.height) / 2
    const ampYAxisRange = [yAxisLength, 0]
    const delYAxisRange = [yAxisLength + config.chromosomeAxis.height, figureHeight]
    const xAxisRange = [0, figureWidth]

    const yOffsetAmpLabel = titleHeight
    const yOffsetDelLabel = titleHeight + config.label.height + figureHeight

    return {
        figureHeight,
        figureWidth,
        yOffsetFigure,
        xOffsetFigure,
        xOffsetLegend,
        yOffsetLegend,
        ampYAxisRange,
        delYAxisRange,
        xAxisRange,
        yOffsetAmpLabel,
        yOffsetDelLabel
    }
}

export const createRecurrentRegionTools = (ampYAxisRange, delYAxisRange, xAxisRange, yAxisMax, chromosome, version) => {
    const noSexChromosomeXDomain = version === 'hg19' ? hg19NoSexChromosomeDomain : hg38NoSexChromosomeDomain
    const chromosomeLength = version === 'hg19' ? hg19ChromosomeLength : hg38ChromosomeLength

    let ampYAxis
    let delYAxis

    ampYAxis = d3.scaleLinear()
            .domain([0, yAxisMax])
            .range(ampYAxisRange)

    delYAxis = d3.scaleLinear()
            .domain([0, yAxisMax])
            .range(delYAxisRange)

    const xDomain =
        chromosome === 'all' ? (
            noSexChromosomeXDomain
        ) : (
            [0, chromosomeLength[chromosome]]
        )

    const xAxis = d3.scaleLinear()
        .domain(xDomain)
        .range(xAxisRange)

    const area = (data, x, y) => {
        return d3.area()
            .curve(d3.curveStepAfter)
            .x(d => x(d.x))
            .y0(y(0))
            .y1(d => y(d.y))
            (data)
    }

    const labelLine = (nodes, x) => {
        return d3.line()
            .curve(d3.curveLinear)
            .x(d => x(d.x))
            .y(d => d.y)
            (nodes)
    }

    const labelLineNodesCreator = (labelPosition, anchorPosition, labelHeight, labelFontSize, isAmp) => {
        const textLength = labelFontSize * 8 * 0.55

        return isAmp ? ([
            {
                x: anchorPosition,
                y: labelHeight
            },
            {
                x: anchorPosition,
                y: (labelHeight + textLength) / 2
            },
            {
                x: labelPosition,
                y: textLength
            }
        ]) : ([
            {
                x: anchorPosition,
                y: 0
            },
            {
                x: anchorPosition,
                y: (labelHeight - textLength) / 2
            },
            {
                x: labelPosition,
                y: labelHeight - textLength
            }
        ])
    }

    return {
        ampYAxis,
        delYAxis,
        xAxis,
        area,
        labelLine,
        labelLineNodesCreator
    }
}

export const calculateChromosomeXAxisPositions = (chromosome, version) => {
    const chromosomeRanges = version === 'hg19' ? hg19ChromosomeRanges : hg38ChromosomeRanges
    const chromosomeLength = version === 'hg19' ? hg19ChromosomeLength : hg38ChromosomeLength

    if (chromosome === 'all') {
        return chromosomeRanges
    } else {
        return {
            [chromosome]: [1, chromosomeLength[chromosome]]
        }
    }
}

export const calculateChromosomeSignificantRegions = (significantRegions, chromosome, version) => {
    const chromosomeStartPositions = version === 'hg19' ? hg19ChromosomeStartPositions : hg38ChromosomeStartPositions

    if (chromosome === 'all') {
        return significantRegions.map(
            region => ({
                ...region,
                start: region.start + chromosomeStartPositions[region.chromosome],
                end: region.end + chromosomeStartPositions[region.chromosome],
                anchorPosition: (region.start + region.end) / 2 + chromosomeStartPositions[region.chromosome],
                labelPosition: (region.start + region.end) / 2 + chromosomeStartPositions[region.chromosome]
            })
        )
    } else {
        return significantRegions.filter(
            region => region.chromosome === chromosome
        ).map(
            region => ({
                ...region,
                anchorPosition: (region.start + region.end) / 2,
                labelPosition: (region.start + region.end) / 2
            })
        )
    }
}
