import * as d3 from "d3"
import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import { useEffect, useMemo, useRef } from "react"
import {
    calculateChromosomeSignificantRegions,
    calculateChromosomeXAxisPositions,
    calculateYAxisMax, createRecurrentRegionTools, initFigureConfig,
    preprocessDataNew,
    transformRegionsToNodes
} from "@/components/features/visualization/utils/focalCNAUtils"
import { useContainerSize } from "@/components/common/container/ResponsiveVisualizationContainer"
import {
    createChromosomeSorter,
    hg19ChromosomeTicks,
    hg38ChromosomeTicks
} from "@/components/features/visualization/utils/chromosomeUtils"
import {
    RecurrentRegionsTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/FocalCNAPlotTooltipTemplate"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"

const parseScoresGISTIC = (scoresGISTIC) => {
    return scoresGISTIC
        .filter(scoreGISTIC => {
            const chr = scoreGISTIC["Chromosome"].trim()
            return chr !== "23" && chr !== "24"
        })
        .map(scoreGISTIC => ({
            type: scoreGISTIC["Type"],
            chromosome: "chr" + scoreGISTIC["Chromosome"].trim(),
            start: +scoreGISTIC["Start"],
            end: +scoreGISTIC["End"],
            "q-value": +scoreGISTIC["-log10(q-value)"],
            "G-score": +scoreGISTIC["G-score"],
            "average amplitude": +scoreGISTIC["average amplitude"],
            frequency: +scoreGISTIC["frequency"]
        }))
}

const FocalCNAPlotPanel = ({
    chromosome,
    focalInfo,
    config,
    reference,
    isShowLeft,
    handleIsShowLeftChange
}) => {
    const { width, height } = useContainerSize()
    const svgWidth = isShowLeft ? width - 320 : width - 20
    const svgHeight = height - 20

    const svgRef = useRef(null)
    const toolTipRef = useRef(null)
    const toolTipLineRef = useRef(null)
    const ampYAxisRef = useRef(null)
    const delYAxisRef = useRef(null)
    const chromosomeXAxis = useRef(null)
    const ampNoRecurrentPathRef = useRef(null)
    const ampRecurrentPathRef = useRef(null)
    const delNoRecurrentPathRef = useRef(null)
    const delRecurrentPathRef = useRef(null)
    const ampLabelRef = useRef(null)
    const delLabelRef = useRef(null)
    const legendRef = useRef(null)

    const scores = parseScoresGISTIC(focalInfo['scores'])

    const {
        significantAmpRegions,
        spiltAmpRegionsMap,
        significantDelRegions,
        spiltDelRegionsMap
    } = useMemo(
        () => preprocessDataNew(focalInfo.amp, focalInfo.del, scores, reference),
        [focalInfo.amp, focalInfo.del, reference, scores]
    )

    const ampNodes = useMemo(
        () => transformRegionsToNodes(spiltAmpRegionsMap, 'G-score', chromosome),
        [chromosome, spiltAmpRegionsMap]
    )

    const delNodes = useMemo(
        () => transformRegionsToNodes(spiltDelRegionsMap, 'G-score', chromosome),
        [chromosome, spiltDelRegionsMap]
    )

    const yAxisMax = useMemo(
        () => calculateYAxisMax(scores, chromosome, 'G-score'),
        [chromosome, scores]
    )

    const {
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
    } = useMemo(
        () => initFigureConfig(
            svgWidth,
            svgHeight,
            config
        ),
        [config, svgHeight, svgWidth]
    )

    const {
        ampYAxis,
        delYAxis,
        xAxis,
        area,
        labelLine,
        labelLineNodesCreator
    } = useMemo(
        () => createRecurrentRegionTools(ampYAxisRange, delYAxisRange, xAxisRange, yAxisMax, chromosome, reference),
        [ampYAxisRange, chromosome, delYAxisRange, reference, xAxisRange, yAxisMax]
    )

    const chromosomePositions = useMemo(
        () => calculateChromosomeXAxisPositions(chromosome, reference),
        [chromosome, reference]
    )

    const chromosomeSignificantAmpRegions = useMemo(
        () => calculateChromosomeSignificantRegions(significantAmpRegions, chromosome, reference),
        [chromosome, reference, significantAmpRegions]
    )

    const chromosomeSignificantDelRegions = useMemo(
        () => calculateChromosomeSignificantRegions(significantDelRegions, chromosome, reference),
        [chromosome, reference, significantDelRegions]
    )

    const xz = useRef(xAxis)
    xz.current = xAxis

    useEffect(() => {
        const gy = d3.select(ampYAxisRef.current)

        gy.call(d3.axisLeft(ampYAxis))
    }, [ampYAxis])

    useEffect(() => {
        const gy = d3.select(delYAxisRef.current)

        gy.call(d3.axisLeft(delYAxis))
    }, [delYAxis])

    useEffect(() => {
        const gChromosomeXAxis = d3.select(chromosomeXAxis.current)

        gChromosomeXAxis.selectAll('rect')
            .data(
                Object.keys(
                    chromosomePositions
                ).filter(
                    key => !['chrX', 'chrY'].includes(key)
                ).sort(
                    createChromosomeSorter()
                )
            )
            .join('rect')
            .attr('x', d => xAxis(chromosomePositions[d][0]))
            .attr('width', d => xAxis(chromosomePositions[d][1]) - xAxis(chromosomePositions[d][0]))
            .attr('height', config.chromosomeAxis.height)
            .attr('fill', (d, i) => i % 2 === 0 ? 'black' : 'white')
            .attr('stroke', 'black')

        gChromosomeXAxis.selectAll('text')
            .data(
                Object.keys(
                    chromosomePositions
                ).filter(
                    key => !['chrX', 'chrY'].includes(key)
                ).sort(
                    createChromosomeSorter()
                )
            )
            .join('text')
            .attr('x', d => (xAxis(chromosomePositions[d][0]) + xAxis(chromosomePositions[d][1])) / 2)
            .attr('y', config.chromosomeAxis.height / 2)
            .attr('dy', '.31em')
            .attr('fill', (d, i) => i % 2 === 0 ? 'white' : 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .text(d => d.replace(/^chr/, ""))

    }, [chromosomePositions, config.chromosomeAxis.height, xAxis])

    useEffect(() => {
        const gPath = d3.select(ampNoRecurrentPathRef.current)

        gPath.selectAll('path')
            .data(['amp'])
            .join('path')
            .attr("fill", "gray")
            .attr('d', area(ampNodes.normalNodes, xAxis, ampYAxis))
            .attr('clip-path', 'url(#recurrent-regions-clip)')
    }, [ampNodes.normalNodes, ampYAxis, area, xAxis])

    useEffect(() => {
        const gPath = d3.select(ampRecurrentPathRef.current)

        gPath.selectAll('path')
            .data(['ampRecurrent'])
            .join('path')
            .attr("fill", "red")
            .attr('d', area(ampNodes.significantNodes, xAxis, ampYAxis))
            .attr('clip-path', 'url(#recurrent-regions-clip)')
    }, [ampNodes.significantNodes, ampYAxis, area, xAxis])

    useEffect(() => {
        const gPath = d3.select(delNoRecurrentPathRef.current)

        gPath.selectAll('path')
            .data(['del'])
            .join('path')
            .attr("fill", "gray")
            .attr('d', area(delNodes.normalNodes, xAxis, delYAxis))
            .attr('clip-path', 'url(#recurrent-regions-clip)')
    }, [area, delNodes.normalNodes, delYAxis, xAxis])

    useEffect(() => {
        const gPath = d3.select(delRecurrentPathRef.current)

        gPath.selectAll('path')
            .data(['delRecurrent'])
            .join('path')
            .attr("fill", "blue")
            .attr('d', area(delNodes.significantNodes, xAxis, delYAxis))
            .attr('clip-path', 'url(#recurrent-regions-clip)')
    }, [delYAxis, area, xAxis, delNodes.significantNodes])

    useEffect(() => {
            const zoomed = (event) => {
                xz.current = event.transform.rescaleX(xAxis)
                d3.select(ampNoRecurrentPathRef.current)
                    .select('path')
                    .attr('d', area(ampNodes.normalNodes, xz.current, ampYAxis))

                d3.select(ampRecurrentPathRef.current)
                    .select('path')
                    .attr('d', area(ampNodes.significantNodes, xz.current, ampYAxis))

                d3.select(delNoRecurrentPathRef.current)
                    .select('path')
                    .attr('d', area(delNodes.normalNodes, xz.current, delYAxis))

                d3.select(delRecurrentPathRef.current)
                    .select('path')
                    .attr('d', area(delNodes.significantNodes, xz.current, delYAxis))

                d3.select(chromosomeXAxis.current)
                    .selectAll('rect')
                    .attr('x', d => xz.current(chromosomePositions[d][0]))
                    .attr('width', d => xz.current(chromosomePositions[d][1]) - xz.current(chromosomePositions[d][0]))

                d3.select(chromosomeXAxis.current)
                    .selectAll('text')
                    .attr('x', d => (xz.current(chromosomePositions[d][0]) + xz.current(chromosomePositions[d][1])) / 2)
            }

            const zoom = d3.zoom()
                .scaleExtent([1, 32])
                .extent([[xOffsetFigure, yOffsetFigure], [xOffsetFigure + figureWidth, yOffsetFigure + figureHeight]])
                .translateExtent([[xOffsetFigure, -Infinity], [xOffsetFigure + figureWidth, Infinity]])
                .on("zoom", zoomed)

            const svg = d3.select(svgRef.current)


            svg.call(zoom)
        },
        [
            ampNodes.normalNodes, ampNodes.significantNodes, ampYAxis, area, chromosomePositions, delNodes.normalNodes,
            delNodes.significantNodes, delYAxis, figureHeight, figureWidth, xAxis, xOffsetFigure, yOffsetFigure
        ]
    )

    return (
        <Box sx={{ position: 'relative', height: '920px' }}>
            <Box sx={{ position: 'absolute', top: '14px', left: '4px' }}>
                <SplitterControlButton
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    title='Setting Options'
                />
            </Box>
            <svg
                width={svgWidth}
                height={svgHeight}
                ref={svgRef}
            >
                <defs>
                    <clipPath id="recurrent-regions-clip">
                        <rect x={xOffsetFigure} y={yOffsetFigure} width={figureWidth} height={figureHeight}/>
                    </clipPath>
                    <clipPath id="chromosome-axis-clip">
                        <rect
                            x={0}
                            y={0}
                            height={svgHeight}
                            width={figureWidth}
                        />
                    </clipPath>
                </defs>
                <g transform={`translate(${config.chart.marginX}, ${config.chart.marginY})`}>
                    <g className='title'>
                        <text
                            fontSize={config.title.fontSize}
                            transform={`translate(${figureWidth / 2}, ${config.title.marginTop})`}
                            dy='1em'
                            fontWeight={500}
                            textAnchor='middle'
                        >
                            Focal CNA & Gene
                        </text>
                    </g>
                    <g className='figure' transform={`translate(${xOffsetFigure}, ${yOffsetFigure})`}>
                        <g ref={ampYAxisRef}></g>
                        <g ref={delYAxisRef}></g>
                        <g ref={chromosomeXAxis} transform={`translate(0, ${ampYAxisRange[0]})`}
                           clipPath='url(#chromosome-axis-clip)'></g>
                        <g ref={ampNoRecurrentPathRef}></g>
                        <g ref={ampRecurrentPathRef}></g>
                        <g ref={delNoRecurrentPathRef}></g>
                        <g ref={delRecurrentPathRef}></g>
                        <rect
                            width={figureWidth}
                            height={Math.abs(ampYAxisRange[0] - ampYAxisRange[1])}
                            fill='transparent'
                            onPointerMove={(event) => pointerMoved(
                                event,
                                xz,
                                ampNodes,
                                significantAmpRegions,
                                chromosome,
                                'G-score',
                                toolTipRef,
                                'Amp',
                                toolTipLineRef,
                                ampYAxisRange,
                                reference
                            )}
                            onPointerLeave={() => pointerLeft(toolTipRef, toolTipLineRef)}
                        ></rect>
                        <rect
                            y={Math.abs(ampYAxisRange[0] - ampYAxisRange[1]) + config.chromosomeAxis.height}
                            width={figureWidth}
                            height={Math.abs(delYAxisRange[0] - delYAxisRange[1])}
                            fill='transparent'
                            onPointerMove={(event) => pointerMoved(
                                event,
                                xz,
                                delNodes,
                                significantDelRegions,
                                chromosome,
                                'G-score',
                                toolTipRef,
                                'Del',
                                toolTipLineRef,
                                delYAxisRange,
                                reference
                            )}
                            onPointerLeave={() => pointerLeft(toolTipRef, toolTipLineRef)}
                        ></rect>
                        <g ref={toolTipLineRef}></g>
                    </g>
                </g>
            </svg>
            {createPortal(<CustomTooltip ref={toolTipRef}/>, document.body)}
        </Box>
    )
}

const pointerMoved = (
    event,
    xz,
    nodes,
    significantRegions,
    chromosome,
    valueType,
    toolTipRef,
    type,
    tooltipLineRef,
    yRange,
    version
) => {
    const chromosomeTicks = version === 'hg19' ? hg19ChromosomeTicks : hg38ChromosomeTicks

    const nodeBisect = d3.bisector(d => d.x).right
    const chrInfoBisect = d3.bisector(d => parseInt(d)).left
    const xPosition = parseInt(xz.current.invert(d3.pointer(event)[0]))

    let currentChr
    let currentXPosition

    if (chromosome === 'all') {
        const chrEnds = Object.keys(chromosomeTicks)
        const chrIndex = chrInfoBisect(chrEnds, xPosition)
        currentChr = chromosomeTicks[chrEnds[chrIndex]]
        currentXPosition = chrIndex === 0 ? xPosition : xPosition - parseInt(chrEnds[chrIndex - 1])
    } else {
        currentChr = chromosome
        currentXPosition = xPosition
    }

    let value

    if (significantRegions.find(region => region.chromosome === currentChr && region.start <= currentXPosition && region.end >= currentXPosition) === undefined) {
        const nodeIndex = nodeBisect(nodes.normalNodes, xPosition) - 1
        value = nodes.normalNodes[nodeIndex].y
    } else {
        const nodeIndex = nodeBisect(nodes.significantNodes, xPosition) - 1
        value = nodes.significantNodes[nodeIndex].y
    }

    d3.select(tooltipLineRef.current)
        .selectAll('line')
        .data([1])
        .join('line')
        .attr('x1', xz.current(xPosition))
        .attr('x2', xz.current(xPosition))
        .attr('y1', yRange[0])
        .attr('y2', yRange[1])
        .attr('stroke-dasharray', '5, 5')
        .attr('stroke', 'black')
        .attr("stroke-opacity", 0.3)
        .style("pointer-events", "none")

    toolTipRef.current.showTooltip(
        event,
        RecurrentRegionsTooltipTemplate({
            chromosome: currentChr,
            xPosition: currentXPosition,
            valueType: valueType,
            value: value,
            type: type
        })
    )
}

const pointerLeft = (tooltipRef, tooltipLineRef) => {
    tooltipRef.current.hideTooltip()
    d3.select(tooltipLineRef.current).selectAll('line').remove()
}

export default FocalCNAPlotPanel
