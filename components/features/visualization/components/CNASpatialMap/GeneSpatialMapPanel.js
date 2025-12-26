import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import {
    initAxis,
    initAxisDomain,
    initGeneFigureConfig
} from "@/components/features/visualization/utils/embeddingMapUtils"
import * as d3 from "d3"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"
import { Stack } from "@mui/system"
import { VerticalColorLegend } from "@/components/features/visualization/components/legend/ColorLegend"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"
import {
    GeneEmbeddingScatterPlotTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/EmbeddingMapTooltipTemplate"
import _ from "lodash"

const GeneSpatialMapPanel = forwardRef(({
    extents,
    meta,
    gene,
    genes,
    config,
    isLog
}, ref) => {
    const svgRef = useRef(null)
    const toolTipRef = useRef(null)
    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)
    const dotsRef = useRef(null)

    const embeddingMethod = 'n_spatial'

    const {
        svgWidth,
        svgHeight,
        innerWidth,
        figureSize,
        subTitleMarginTop,
        xOffsetScatterPlot,
        yOffsetScatterPlot,
        yOffsetXAxis,
        xOffsetLegend,
        yOffsetLegend,
        xRange,
        yRange,
        CNARange,
        CNAValueScale
    } = initGeneFigureConfig(920, config, isLog)
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
            .attr('fill', d => CNAValueScale(genes[d.id]))
            .on('pointerenter pointermove',
                (event, d) => handleDotPointerEnter(
                    event, d.id,
                    [d[`${embeddingMethod}1`], d[`${embeddingMethod}2`]],
                    genes[d.id],
                    toolTipRef
                )
            )
            .on('pointerleave', () => handleDotPointerLeft(toolTipRef))

    }, [CNAValueScale, config.scatter.radius, embeddingMethod, genes, meta, x, y])

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
                                Spatial Distribution Plot
                            </text>
                            <text
                                fontSize={config.title.subFontSize}
                                transform={`translate(${svgWidth / 2}, ${subTitleMarginTop})`}
                                dy='1em'
                                textAnchor='middle'
                                fontWeight={500}
                                fill="#B0B0B0"
                            >
                                <tspan fontWeight="bold" fill="#000000" opacity={0.6}>Color By:</tspan>
                                <tspan>Gene ({gene.value})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</tspan>
                                <tspan fontWeight="bold" fill="#000000" opacity={0.6}>Moran I:</tspan>
                                <tspan>{_.round(gene.moranI, 3)}</tspan>
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
                        <g transform={`translate(${xOffsetLegend}, ${yOffsetLegend})`}>
                            <VerticalColorLegend
                                color={CNAValueScale}
                                title={"CNV Value"}
                                height={320}
                                width={40}
                                legendMarginTop={0}
                                ticks={CNARange[2] - CNARange[0] + 1}
                            />
                        </g>
                    </g>
                </svg>
            </Stack>
            {createPortal(<CustomTooltip ref={toolTipRef}/>, document.body)}
        </>
    )
})

const handleDotPointerEnter = (event, nodeId, coordinate, value, tooltipRef) => {
    tooltipRef.current.showTooltip(event, GeneEmbeddingScatterPlotTooltipTemplate(nodeId, coordinate, value))
}

const handleDotPointerLeft = (tooltipRef) => {
    tooltipRef.current.hideTooltip()
}

GeneSpatialMapPanel.displayName = 'GeneSpatialMapPanel'

export default GeneSpatialMapPanel
