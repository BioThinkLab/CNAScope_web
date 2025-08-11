import {useEffect, useRef} from "react";
import * as d3 from 'd3'
import {
    CNVMatrixTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/CNAHeatmapTooltipTemplates"

const CNAChromosomeHeatmap = ({
    marginLeft,
    paddingTop,
    blockHeight,
    blockWidth,
    metaWidth,
    metaOffset,
    colorScales,
    blockGap,
    leaves,
    CNVClusterMeanMatrix,
    clusterMetaDict,
    metaNameList,
    headerBlockOffset,
    binIndex,
    getCNVColor,
    showTooltip,
    hideTooltip
}) => {
    const heatMapContainerRef = useRef(null)

    useEffect(() => {
            const heatMapContainer = d3.select(heatMapContainerRef.current)
                .selectAll(':scope > g')
                .data(leaves)
                .join('g')
                .attr('transform', d => `translate(0, ${CNVClusterMeanMatrix[d]['offset'] * blockHeight})`)

            heatMapContainer.each(function (leaf) {
                let metaInfoContainer = d3.select(this).select('.metaInfo')
                if (metaInfoContainer.empty()) {
                    metaInfoContainer = d3.select(this)
                        .append('g')
                        .attr('class', 'metaInfo')
                }

                metaInfoContainer
                    .selectAll('g')
                    .data(Object.keys(clusterMetaDict[leaf]))
                    .join('g')
                    .attr('transform', (d, i) => `translate(0, ${i * blockHeight})`)
                    .each(function (fileItem) {
                        d3.select(this)
                            .selectAll('rect')
                            .data(d => clusterMetaDict[leaf][d])
                            .join('rect')
                            .attr('x', (d, i) => metaWidth * i)
                            .attr('width', metaWidth - blockGap)
                            .attr('height', blockHeight - blockGap)
                            .attr('fill', (d, i) => colorScales[metaNameList[i]](d))
                            .each(function (d, i) {
                                d3.select(this)
                                    .on('mouseenter',
                                        event => showTooltip(
                                            event,
                                            CNVMatrixTooltipTemplate(fileItem, colorScales[metaNameList[i]](d), metaNameList[i], d))
                                    )
                                    .on('mousemove',
                                        event => showTooltip(
                                            event,
                                            CNVMatrixTooltipTemplate(fileItem, colorScales[metaNameList[i]](d), metaNameList[i], d))
                                    )
                                    .on('mouseout', hideTooltip)
                            })
                    })
            })

            heatMapContainer.each(function (leaf) {
                const leafMatrix = CNVClusterMeanMatrix[leaf]
                const fileNum = leafMatrix.fileNum

                let chromosomeContainer = d3.select(this).select('.chromosome')
                if (chromosomeContainer.empty()) {
                    chromosomeContainer = d3.select(this).append('g')
                        .attr('class', 'chromosome')
                }

                chromosomeContainer.selectAll('g')
                    .data(Object.keys(leafMatrix.CNVAvg))
                    .join('g')
                    .attr('transform', (d, i) => `translate(${metaOffset + headerBlockOffset[i][1]}, 0)`)
                    .each(function (chr) {
                        d3.select(this)
                            .selectAll('rect')
                            .data(leafMatrix.CNVAvg[chr])
                            .join('rect')
                            .each(function (value, i) {
                                d3.select(this)
                                    .attr('x', i * blockWidth)
                                    .attr('width', blockWidth - blockGap)
                                    .attr('height', blockHeight * fileNum - blockGap)
                                    .attr('fill', d => getCNVColor(d))
                                    .on('mouseenter', event =>
                                        showTooltip(
                                            event,
                                            CNVMatrixTooltipTemplate(leaf, getCNVColor(value), binIndex[chr][i], value))
                                    )
                                    .on('mousemove', event =>
                                        showTooltip(
                                            event,
                                            CNVMatrixTooltipTemplate(leaf, getCNVColor(value), binIndex[chr][i], value))
                                    )
                                    .on('mouseout', hideTooltip)
                            })
                    })
            })
        }, [CNVClusterMeanMatrix, binIndex, blockGap, blockHeight, blockWidth, clusterMetaDict, colorScales, getCNVColor, headerBlockOffset, hideTooltip, leaves, marginLeft, metaNameList, metaOffset, metaWidth, showTooltip]
    );

    return (
        <>
            <g ref={heatMapContainerRef} transform={`translate(${marginLeft}, ${paddingTop})`} className={'heatMapContainer'}></g>
        </>
    )
}

export default CNAChromosomeHeatmap
