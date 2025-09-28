import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { initAxis, initAxisDomain, initFigureConfig } from "@/components/features/visualization/utils/embeddingMapUtils"
import { Stack } from "@mui/system"
import {
    EmbeddingScatterPlotTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/EmbeddingMapTooltipTemplate"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"

const EmbeddingMapPanel = forwardRef(({
    embeddingMethod,
    cluster,
    meta,
    extents,
    config
}, ref) => {
    const svgRef = useRef(null)
    const toolTipRef = useRef(null)
    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)
    const dotsRef = useRef(null)
    const legendContainerRef = useRef(null)

    const {
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
    } = initFigureConfig(920, cluster, config)
    const axisDomain = initAxisDomain(embeddingMethod, extents)
    const { x, y } = initAxis(axisDomain, xRange, yRange)

    useEffect(() => {
        const gx = d3.select(xAxisRef.current)

        gx.call(d3.axisBottom(x))
    }, [x])

    useEffect(() => {
        const gy = d3.select(yAxisRef.current)

        gy.call(d3.axisLeft(y))
    }, [y])

    useEffect(() => {
        const gDots = d3.select(dotsRef.current)

        gDots.selectAll('g')
            .data(Array.from({ length: cluster }, (_, i) => i + 1))
            .join('g')
            .attr('class', d => `cluster${d}`)
            .each(function (datum) {
                const gClusterDots = d3.select(this)

                gClusterDots.selectAll('circle')
                    .data(meta.filter(item => item.cluster === datum), d => d.id)
                    .join('circle')
                    .attr('cx', d => x(d[`${embeddingMethod}1`]))
                    .attr('cy', d => y(d[`${embeddingMethod}2`]))
                    .attr('r', config.scatter.radius)
                    .attr('fill', colorScale(datum))
                    .on('pointerenter pointermove', (event, d) => handleDotPointerEnter(event, d.id, [d[`${embeddingMethod}1`], d[`${embeddingMethod}2`]], 'rgba(30, 144, 255, 0.6)', toolTipRef))
                    .on('pointerleave', () => handleDotPointerLeft(toolTipRef))
            })
    }, [cluster, colorScale, config.scatter.radius, embeddingMethod, meta, x, y])

    useEffect(() => {
        const gLegend = d3.select(legendContainerRef.current)

        gLegend.selectAll('g')
            .data(Array.from({ length: cluster }, (_, i) => i + 1))
            .join('g')
            .attr('transform', (d, i) => `translate(${Math.floor(i / rowLegendNum) * (config.legend.width + config.legend.itemHorizontalGap)}, ${(config.legend.itemVerticalGap + config.legend.height) * (i % rowLegendNum)})`)
            .each(function (d) {
                const g = d3.select(this)

                g.selectAll('rect')
                    .data([d])
                    .join('rect')
                    .attr('y', 2)
                    .attr('width', 26)
                    .attr('height', 16)
                    .attr('rx', 4)
                    .attr('ry', 4)
                    .attr('fill', colorScale(d))

                g.selectAll('text')
                    .data([d])
                    .join('text')
                    .attr('x', 30)
                    .attr('dy', '1rem')
                    .text(d => `Cluster ${d}`)

                g.selectAll('.legend-event-trigger')
                    .data([d])
                    .join('rect')
                    .attr('class', 'legend-event-trigger')
                    .attr('width', config.legend.width)
                    .attr('height', config.legend.height)
                    .attr('fill', 'transparent')
                    .on('pointerenter pointermove', (event, d) => handleLegendPointerEnter(d, dotsRef))
                    .on('pointerleave', (event, d) => handleLegendPointerLeft(d, dotsRef))
            })
    }, [cluster, colorScale, config.legend.height, config.legend.itemHorizontalGap, config.legend.itemVerticalGap, config.legend.width, rowLegendNum])

    useImperativeHandle(ref, () => ({
        downloadSvg: () => {
            if (!svgRef.current) return
            downloadSvg(svgRef.current, `${embeddingMethod.slice(2)}_Embedding_Map.svg`)
        }
    }))

    return (
        <>
            <Stack sx={{ alignItems: 'center', overflowX: 'auto' }}>
                <svg ref={svgRef} width={svgWidth} height={svgHeight}>
                    <g className='plotContainer'
                       transform={`translate(${config.chart.margin}, ${config.chart.margin})`}>
                        <g className='title'>
                            <text
                                fontSize={config.title.fontSize}
                                transform={`translate(${svgWidth / 2}, ${config.title.marginTop})`}
                                dy='1em'
                                textAnchor='middle'
                                fontWeight={500}
                            >
                                {embeddingMethod.slice(2)} Embedding Map
                            </text>
                        </g>
                        <g ref={xAxisRef} transform={`translate(${xOffsetScatterPlot}, ${yOffsetXAxis})`}>
                            <text
                                x={figureSize / 2}
                                y={36}
                                fontSize={14}
                                fontWeight='bold'
                                fill='black'
                                textAnchor='middle'
                            >
                                {embeddingMethod.slice(2)}1
                            </text>
                        </g>
                        <g ref={yAxisRef} transform={`translate(${xOffsetScatterPlot}, ${yOffsetScatterPlot})`}>
                            <text
                                y={figureSize / 2 + 36}
                                fontSize={14}
                                fontWeight='bold'
                                fill='black'
                                textAnchor='middle'
                                transform={`rotate(90, 0, ${figureSize / 2})`}
                            >
                                {embeddingMethod.slice(2)}2
                            </text>
                        </g>
                        <g ref={dotsRef} transform={`translate(${xOffsetScatterPlot}, ${yOffsetScatterPlot})`}></g>
                        <g ref={legendContainerRef} transform={`translate(${xOffsetLegend}, ${yOffsetLegend})`}></g>
                    </g>
                </svg>
            </Stack>
            {createPortal(<CustomTooltip ref={toolTipRef}/>, document.body)}
        </>
    )
})

const handleLegendPointerEnter = (datum, dotsRef) => {
    const gDots = d3.select(dotsRef.current)

    gDots.selectAll(`g:not(.cluster${datum})`)
        .attr('opacity', 0.2)
}

const handleLegendPointerLeft = (datum, dotsRef) => {
    const gDots = d3.select(dotsRef.current)

    gDots.selectAll('g')
        .attr('opacity', 1)
}

const handleDotPointerEnter = (event, nodeId, coordinate, color, tooltipRef) => {
    tooltipRef.current.showTooltip(event, EmbeddingScatterPlotTooltipTemplate(nodeId, coordinate, color))
}

const handleDotPointerLeft = (tooltipRef) => {
    tooltipRef.current.hideTooltip()
}

EmbeddingMapPanel.displayName = 'EmbeddingMapPanel'

export default EmbeddingMapPanel
