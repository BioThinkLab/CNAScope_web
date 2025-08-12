import { useEffect, useRef } from "react"
import * as d3 from "d3"
import {
    CNVMatrixTooltipTemplate,
    geneTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/CNAHeatmapTooltipTemplates"

const CNAGeneHeatmap = ({
    cutTreeCNVMatrix,
    xMatrix,
    yMatrix,
    geneInfos,
    CNVMatrixScale,
    showTooltip,
    hideTooltip
}) => {
    const xAxisRef = useRef(null)
    const geneCNVHeatMapRef = useRef(null)

    useEffect(() => {
        const xAxis = d3.select(xAxisRef.current)

        xAxis.call(
            d3.axisTop(xMatrix)
                .tickSize(0)
                .tickFormat((d, i) => {
                    return geneInfos[i]['gene']
                })
        ).call(g => g.select(".domain").remove())

        xAxis.selectAll('.tick text')
            .attr('transform', 'rotate(-90)')
            .attr('x', 6)
            .attr('y', xMatrix.bandwidth() * 0.1)
            .style('cursor', 'default')
            .style('text-anchor', 'start')
    }, [geneInfos, hideTooltip, showTooltip, xMatrix])

    useEffect(() => {
        const geneCNVHeatMap = d3.select(geneCNVHeatMapRef.current)

        geneCNVHeatMap.selectAll('g')
            .data(Object.entries(cutTreeCNVMatrix))
            .join('g')
            .attr('transform', d => `translate(0, ${yMatrix[d[0]].y})`)
            .selectAll('rect')
            .data(d => d[1].map((item, i) => ({ value: item, key: d[0], index: i })))
            .join('rect')
            .attr('x', (d, i) => xMatrix(geneInfos[i]['gene']))
            .attr('width', xMatrix.bandwidth() - 0.05)
            .attr('height', d => yMatrix[d.key].height)
            .attr('fill', d => CNVMatrixScale(d.value))
            .on('mouseenter', (event, d) => {
                showTooltip(event, CNVMatrixTooltipTemplate(d.key, CNVMatrixScale(d.value), geneInfos[d.index]['gene'], d.value))
            })
            .on('mousemove', (event, d) => {
                showTooltip(event, CNVMatrixTooltipTemplate(d.key, CNVMatrixScale(d.value), geneInfos[d.index]['gene'], d.value))
            })
            .on('mouseout', hideTooltip)
    }, [CNVMatrixScale, cutTreeCNVMatrix, geneInfos, hideTooltip, showTooltip, xMatrix, yMatrix])

    return (
        <>
            <g ref={xAxisRef}></g>
            <g ref={geneCNVHeatMapRef}></g>
        </>
    )
}

export default CNAGeneHeatmap
