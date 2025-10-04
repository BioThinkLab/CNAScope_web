import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import {
    initFigure,
    parseCNAMatrixToNodePairs,
    sortChromosomes
} from "@/components/features/visualization/utils/ploidyStairstepUtils"
import { useContainerSize } from "@/components/common/container/ResponsiveVisualizationContainer"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"
import { hg19ChromosomeTicks, hg38ChromosomeTicks } from "@/components/features/visualization/utils/chromosomeUtils"
import {
    PloidyStairstepTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/PloidyStairstepTooltipTemplate"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"
import { produce } from "immer"

const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

const CNAPloidyStairstepPanel = forwardRef(({
    clusterMeans,
    cluster,
    config,
    baselineCNA,
    reference,
    isShowLeft
}, ref) => {
    const [groupInfos, setGroupInfos] = useState([])

    const { width, height } = useContainerSize()
    const svgWidth = isShowLeft ? width - 320 : width - 20
    const svgHeight = height - 20

    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)
    const pathRef = useRef(null)
    const legendRef = useRef(null)
    const svgRef = useRef(null)
    const toolTipRef = useRef(null)
    const toolTipLineRef = useRef(null)
    const xz = useRef(null)

    const nodePairs = useMemo(() => {
        return Object.keys(clusterMeans).reduce((acc, key) => {
            acc[key] = parseCNAMatrixToNodePairs(
                clusterMeans[key],
                sortChromosomes(Object.keys(clusterMeans[key])),
                reference
            )
            return acc
        }, {})
    }, [clusterMeans, reference])

    const {
        rowLegendNum,
        legendOffset,
        xRange,
        yRange,
        x,
        y,
        xAxis,
        line
    } = initFigure(svgWidth, svgHeight, config, baselineCNA, reference, cluster)

    useEffect(() => {
        setGroupInfos(Object.keys(nodePairs).map((cluster, index) => ({
            name: cluster,
            display: true,
            index: index
        })))
    }, [nodePairs])

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
            .data(groupInfos.filter(info => info.display))
            .join('path')
            .attr('clip-path', 'url(#ploidy-stairstep-clip)')
            .attr('stroke', d => colorScale(d.index))
            .attr('fill', 'transparent')
            .attr('d', d => line(nodePairs[d.name], x))
    }, [groupInfos, line, nodePairs, x])

    useEffect(() => {
        const gLegend = d3.select(legendRef.current)

        gLegend.selectAll('g')
            .data(groupInfos)
            .join('g')
            .attr('transform', (d, i) => legendTransform(i, rowLegendNum, config))
            .each(function (d) {
                const g = d3.select(this)

                g.selectAll('line')
                    .data([d])
                    .join('line')
                    .attr('x1', 0)
                    .attr('y1', config.legend.height / 2)
                    .attr('x2', config.legend.width / 4)
                    .attr('y2', config.legend.height / 2)
                    .attr('stroke', colorScale(d.index))
                    .attr('stroke-width', 2)
                    .attr('opacity', d.display ? 1 : 0.3)

                g.selectAll('text')
                    .data([d])
                    .join('text')
                    .attr('x', config.legend.width / 4 + 5)
                    .attr('dy', '1rem')
                    .text(d => `Cluster ${d.name}`)
                    .attr('font-size', '14px')
                    .attr('font-family', 'sans-serif')
                    .attr('opacity', d.display ? 1 : 0.3)

                g.selectAll('rect')
                    .data([d])
                    .join('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', config.legend.width)
                    .attr('height', config.legend.height)
                    .attr('fill', 'transparent')
                    .attr('cursor', 'pointer')
                    .on('click', (event, d) => {
                        handleLegendClick(d, setGroupInfos)
                    })
            })
    }, [config, groupInfos, rowLegendNum])

    useEffect(() => {
        const zoomed = (event) => {
            xz.current = event.transform.rescaleX(x)
            d3.select(pathRef.current)
                .selectAll('path')
                .data(groupInfos.filter(info => info.display))
                .attr('d', d => line(nodePairs[d.name], xz.current))
            d3.select(xAxisRef.current).call(xAxis, xz.current);
        }

        const zoom = d3.zoom()
            .scaleExtent([1, 32])
            .extent([[xRange[0], yRange[1]], [xRange[1], yRange[0]]])
            .translateExtent([[xRange[0], -Infinity], [xRange[1], Infinity]])
            .on("zoom", zoomed);

        d3.select(svgRef.current).call(zoom)
    }, [groupInfos, line, nodePairs, x, xAxis, xRange, yRange])

    useImperativeHandle(ref, () => ({
        downloadSvg: () => {
            if (!svgRef.current) return
            downloadSvg(svgRef.current, `Ploidy_Stairstep.svg`)
        }
    }))

    return (
        <>
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
                    CN Stairstep
                </text>
                <g ref={legendRef} transform={`translate(${legendOffset}, ${config.chart.marginTop + 45})`}></g>
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
                        groupInfos,
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
                        groupInfos,
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
        </>
    )
})

const pointerMoved = (event, groupInfos, nodePairs, xz, toolTipRef, offset, tooltipLineRef, yRange, reference) => {
    const chromosomeTicks = reference === 'hg19' ? hg19ChromosomeTicks : hg38ChromosomeTicks

    const nodePairsBisect = d3.bisector(d => d[0]).right
    const chrInfoBisect = d3.bisector(d => parseInt(d)).left
    const groupActivatedList = groupInfos.filter(group => group.display).map(group => group.name)
    const xPosition = parseInt(xz.current.invert(d3.pointer(event)[0] + offset))

    const groupValues = {}

    const chrEnds = Object.keys(chromosomeTicks)
    const chrIndex = chrInfoBisect(chrEnds, xPosition)
    const currentChr = chromosomeTicks[chrEnds[chrIndex]]
    const currentXPosition = chrIndex === 0 ? xPosition : xPosition - parseInt(chrEnds[chrIndex - 1])

    groupValues.chromosome = currentChr
    groupValues.xPosition = currentXPosition

    groupValues.colorScale = colorScale
    groupValues.values = []

    for(let group of groupActivatedList) {
        const CNVNodePairs = nodePairs[group]
        const i = nodePairsBisect(CNVNodePairs, xPosition) - 1

        groupValues.values.push({
            group: group,
            value: CNVNodePairs[i][1]
        })
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

    toolTipRef.current.showTooltip(event, PloidyStairstepTooltipTemplate(groupValues))
}

const pointerLeft = (toolTipRef, tooltipLineRef) => {
    toolTipRef.current.hideTooltip()
    d3.select(tooltipLineRef.current).selectAll('line').remove()
}

const legendTransform = (index, rowLegendNum, config) => {
    const xOffset = (index % rowLegendNum) * (config.legend.width + config.legend.itemHorizontalGap)
    const yOffset = Math.floor(index / rowLegendNum) * (config.legend.height + config.legend.itemVerticalGap)

    return `translate(${xOffset}, ${yOffset})`
}

const handleLegendClick = (groupInfo, setGroupInfos) => {
    setGroupInfos(produce(draft => {
        const group = draft.find(g => g.name === groupInfo.name)
        if (group) {
            group.display = !group.display
        }
    }))
}

CNAPloidyStairstepPanel.displayName = 'CNAPloidyStairstepPanel'

export default CNAPloidyStairstepPanel
