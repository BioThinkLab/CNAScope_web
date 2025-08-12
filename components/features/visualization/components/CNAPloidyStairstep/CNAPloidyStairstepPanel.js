import * as d3 from 'd3'
import { useEffect, useMemo, useRef } from "react"
import { initFigure, parseCNAMatrixToNodePairs } from "@/components/features/visualization/utils/ploidyStairstepUtils"
import { Box, Stack } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import { useContainerSize } from "@/components/common/container/ResponsiveVisualizationContainer"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"
import { hg19ChromosomeTicks, hg38ChromosomeTicks } from "@/components/features/visualization/utils/chromosomeUtils"
import {
    PloidyStairstepTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/PloidyStairstepTooltipTemplate"


const CNAPloidyStairstepPanel = ({
    clusterMean,
    config,
    baselineCNA,
    reference,
    isShowLeft,
    handleIsShowLeftChange
}) => {
    const { width, height } = useContainerSize()
    const svgWidth = isShowLeft ? width - 320 : width - 20
    const svgHeight = height - 20

    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)
    const pathRef = useRef(null)
    const svgRef = useRef(null)
    const toolTipRef = useRef(null)
    const toolTipLineRef = useRef(null)
    const xz = useRef(null)

    const nodePairs = useMemo(() => {
        return parseCNAMatrixToNodePairs(clusterMean, Object.keys(clusterMean), reference)
    }, [clusterMean, reference])

    const {
        xRange,
        yRange,
        x,
        y,
        xAxis,
        line
    } = initFigure(svgWidth, svgHeight, config, baselineCNA, reference)

    useEffect(() => {
        const gx = d3.select(xAxisRef.current)

        gx.call(xAxis, x)
        xz.current = x
    }, [x, xAxis])

    useEffect(() => {
        const gy = d3.select(yAxisRef.current)

        gy.selectAll('.tick .assist-line').remove()

        gy.call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line")
                .clone()
                .attr('class', 'assist-line')
                .attr("x2", xRange[1] - xRange[0])
                .attr("stroke-opacity", d => d === baselineCNA ? 1 : 0.2)
                .attr("stroke-dasharray", d => d === baselineCNA ? '10, 10' : null)
            )

        gy.selectAll('.yAxis-label')
            .data([1])
            .join('text')
            .attr('x', baselineCNA === 0 ? -24 : -18)
            .attr('y', yRange[1] - 20)
            .attr('text-anchor', 'start')
            .attr('fill', 'black')
            .attr('font-weight', 'bold')
            .attr('class', 'yAxis-label')
            .text(baselineCNA === 0 ? '↑ CN log2 ratio' : '↑ CN')
    }, [baselineCNA, xRange, y, yRange])

    useEffect(() => {
        const gPath = d3.select(pathRef.current)

        gPath.selectAll('path')
            .data([1])
            .join('path')
            .attr('clip-path', 'url(#ploidy-stairstep-clip)')
            .attr('stroke', "#1f77b4")
            .attr('fill', 'transparent')
            .attr('d',line(nodePairs, x))
    }, [line, nodePairs, x])

    useEffect(() => {
        const zoomed = (event) => {
            xz.current = event.transform.rescaleX(x)
            d3.select(pathRef.current)
                .selectAll('path')
                .data([1])
                .attr('d', line(nodePairs, xz.current))
            d3.select(xAxisRef.current).call(xAxis, xz.current);
        }

        const zoom = d3.zoom()
            .scaleExtent([1, 32])
            .extent([[xRange[0], yRange[1]], [xRange[1], yRange[0]]])
            .translateExtent([[xRange[0], -Infinity], [xRange[1], Infinity]])
            .on("zoom", zoomed);

        d3.select(svgRef.current).call(zoom)
    }, [line, nodePairs, x, xAxis, xRange, yRange])

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
                <clipPath id="ploidy-stairstep-clip">
                    <rect x={xRange[0]} y={yRange[1]} width={xRange[1] - xRange[0]}
                          height={yRange[0] - yRange[1]}></rect>
                </clipPath>
                <text
                    fontSize='24px'
                    transform={`translate(${svgWidth / 2}, ${config.chart.marginTop})`}
                    dy='1rem'
                    fontWeight={500}
                    textAnchor='middle'
                >
                    Ploidy Stairstep
                </text>
                <g ref={xAxisRef} transform={`translate(0,${yRange[0]})`}></g>
                <g ref={yAxisRef} transform={`translate(${xRange[0]}, 0)`}></g>
                <g ref={pathRef}></g>
                <rect
                    transform={`translate(${xRange[0]}, ${yRange[1]})`}
                    width={xRange[1] - xRange[0]}
                    height={yRange[0] - yRange[1]}
                    fill='transparent'
                    onPointerEnter={(event) => pointerMoved(
                        event,
                        nodePairs,
                        xz,
                        toolTipRef,
                        config.chart.marginLeft,
                        toolTipLineRef,
                        yRange,
                        reference
                    )}
                    onPointerMove={(event) => pointerMoved(
                        event,
                        nodePairs,
                        xz,
                        toolTipRef,
                        config.chart.marginLeft,
                        toolTipLineRef,
                        yRange,
                        reference
                    )}
                    onMouseLeave={() => pointerLeft(toolTipRef, toolTipLineRef)}
                ></rect>
                <g ref={toolTipLineRef}></g>
            </svg>
            {createPortal(<CustomTooltip ref={toolTipRef}/>, document.body)}
        </Box>
    )
}

const pointerMoved = (event, nodePairs, xz, toolTipRef, offset, tooltipLineRef, yRange, reference) => {
    const chromosomeTicks = reference === 'hg19' ? hg19ChromosomeTicks : hg38ChromosomeTicks

    const nodePairsBisect = d3.bisector(d => d[0]).right
    const chrInfoBisect = d3.bisector(d => parseInt(d)).left
    const xPosition = parseInt(xz.current.invert(d3.pointer(event)[0] + offset))

    const groupValue = {}

    const chrEnds = Object.keys(chromosomeTicks)
    const chrIndex = chrInfoBisect(chrEnds, xPosition)
    const currentChr = chromosomeTicks[chrEnds[chrIndex]]
    const currentXPosition = chrIndex === 0 ? xPosition : xPosition - parseInt(chrEnds[chrIndex - 1])

    groupValue.chromosome = currentChr
    groupValue.xPosition = currentXPosition

    const i = nodePairsBisect(nodePairs, xPosition) - 1

    groupValue.value = nodePairs[i][1]

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

    toolTipRef.current.showTooltip(event, PloidyStairstepTooltipTemplate(groupValue))
}

const pointerLeft = (toolTipRef, tooltipLineRef) => {
    toolTipRef.current.hideTooltip()
    d3.select(tooltipLineRef.current).selectAll('line').remove()
}

export default CNAPloidyStairstepPanel
