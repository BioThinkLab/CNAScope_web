import { useEffect, useRef } from "react"
import * as d3 from "d3"
import {
    CNVMatrixTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/CNAHeatmapTooltipTemplates"

const CNAGeneMetaHeatmap = ({
    filteredMeta,
    xMeta,
    yMeta,
    metaFields,
    colorScales,
    showTooltip,
    hideTooltip
}) => {
    const xAxisRef = useRef(null)
    const metaHeatMapRef = useRef(null)

    useEffect(() => {
        const xAxis = d3.select(xAxisRef.current)

        xAxis.call(d3.axisTop(xMeta).tickSize(0))
            .call(g => g.select(".domain").remove())

        xAxis.selectAll('.tick text')
            .attr('transform', 'rotate(-90)')
            .attr('x', 6)
            .attr('y', xMeta.bandwidth() * 0.1)
            .style('text-anchor', 'start');
    }, [xMeta])

    useEffect(() => {
        const metaHeatMap = d3.select(metaHeatMapRef.current)

        metaHeatMap.selectAll('g')
            .data(Object.entries(filteredMeta))
            .join('g')
            .attr('transform', d => `translate(0, ${yMeta(d[0])})`)
            .selectAll('rect')
            .data(d => d[1].map((item, i) => ({ value: item, key: d[0], index: i })))
            .join('rect')
            .attr('x', (d, i) => xMeta(metaFields[i]))
            .attr('width', xMeta.bandwidth() - 0.05)
            .attr('height', yMeta.bandwidth() - 0.05)
            .attr('fill', (d, i) => colorScales[metaFields[i]](d.value))
            .on('mouseenter', (event, d) => {
                showTooltip(event, CNVMatrixTooltipTemplate(d.key, colorScales[metaFields[d.index]](d.value), metaFields[d.index], d.value))
            })
            .on('mousemove', (event, d) => {
                showTooltip(event, CNVMatrixTooltipTemplate(d.key, colorScales[metaFields[d.index]](d.value), metaFields[d.index], d.value))
            })
            .on('mouseout', hideTooltip)

    }, [colorScales, filteredMeta, hideTooltip, metaFields, showTooltip, xMeta, yMeta])

    return (
        <>
            <g ref={xAxisRef}></g>
            <g ref={metaHeatMapRef}></g>
        </>
    )
}

export default CNAGeneMetaHeatmap
