import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { initAxis, initAxisDomain, initFigureConfig } from "@/components/features/visualization/utils/embeddingMapUtils"
import { Box, Stack } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import {
    EmbeddingScatterPlotTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/EmbeddingMapTooltipTemplate"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"

const EmbeddingMapPanel = forwardRef(({
    embeddingMethod,
    meta,
    extents,
    config,
    isShowLeft,
    handleIsShowLeftChange
}, ref) => {
    const svgRef = useRef(null)
    const toolTipRef = useRef(null)
    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)
    const dotsRef = useRef(null)

    const {
        svgWidth,
        svgHeight,
        innerWidth,
        figureSize,
        xOffsetScatterPlot,
        yOffsetScatterPlot,
        yOffsetXAxis,
        xRange,
        yRange
    } = initFigureConfig(920, config)
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

        gDots.selectAll('circle')
            .data(meta, d => d.id)
            .join('circle')
            .attr('cx', d => x(d[`${embeddingMethod}1`]))
            .attr('cy', d => y(d[`${embeddingMethod}2`]))
            .attr('r', config.scatter.radius)
            .attr('fill', 'rgba(30, 144, 255, 0.6)')
            .on('pointerenter pointermove', (event, d) => handleDotPointerEnter(event, d.id, [d[`${embeddingMethod}1`], d[`${embeddingMethod}2`]], 'rgba(30, 144, 255, 0.6)', toolTipRef))
            .on('pointerleave', () => handleDotPointerLeft(toolTipRef))
    }, [config.scatter.radius, embeddingMethod, meta, x, y])

    useImperativeHandle(ref, () => ({
        downloadSvg: () => {
            if (!svgRef.current) return
            downloadSvg(svgRef.current, `${embeddingMethod.slice(2)}_Embedding_Map.svg`)
        }
    }))

    return (
        <Box sx={{ position: 'relative', height: '920px' }}>
            <Box sx={{ position: 'absolute', top: '14px', left: '4px' }}>
                <SplitterControlButton
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    title='Setting Options'
                />
            </Box>
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
                    </g>
                </svg>
            </Stack>
            {createPortal(<CustomTooltip ref={toolTipRef}/>, document.body)}
        </Box>
    )
})

const handleDotPointerEnter = (event, nodeId, coordinate, color, tooltipRef) => {
    tooltipRef.current.showTooltip(event, EmbeddingScatterPlotTooltipTemplate(nodeId, coordinate, color))
}

const handleDotPointerLeft = (tooltipRef) => {
    tooltipRef.current.hideTooltip()
}

EmbeddingMapPanel.displayName = 'EmbeddingMapPanel'

export default EmbeddingMapPanel
