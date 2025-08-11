import {useEffect, useRef} from "react";
import * as d3 from "d3"
import _ from "lodash"
import {
    chromosomeHeaderTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/CNAHeatmapTooltipTemplates"


const CNAChromosomeHeatmapHeader = ({
    marginLeft,
    paddingTop,
    metaOffset,
    chromosomeLegendHeight,
    blockWidth,
    blockGap,
    metaWidth,
    headerBlockOffset,
    CNVMatrixMeta,
    metaHeaders,
    showTooltip,
    hideTooltip
}) => {
    const headerContainerRef = useRef(null)

    useEffect(() => {
        const headerContainer = d3.select(headerContainerRef.current)
        const heatMapContainer = d3.select('.heatMapContainer')

        const chromosomeList = CNVMatrixMeta.map(item => item[0])
        const chromosomeLengthList = CNVMatrixMeta.map(item => item[1])

        let chromosomeHeaderContainer = headerContainer.select('.chromosomeHeader')
        if (chromosomeHeaderContainer.empty()) {
            chromosomeHeaderContainer = headerContainer.append('g')
                .attr('class', 'chromosomeHeader')
        }

        chromosomeHeaderContainer
            .selectAll('g')
            .data(headerBlockOffset)
            .join(
                enter => {
                    chromosomeHeaderContainer.attr('transform', `translate(${metaOffset}, 0)`)

                    const gElement = enter.append('g')
                        .attr('transform', d => `translate(${d[1]}, 0)`)

                    gElement.append('rect')
                        .attr('width', d => d[2])
                        .attr('height', chromosomeLegendHeight)
                        .attr('fill', (d, i) => i % 2 === 0 ? '#c6c6c6' : '#303030')
                        .attr('cursor', 'pointer')
                        .attr('pointer-events', 'all')
                        .each(function (d) {
                            const chr = _.replace(d[0], 'chr', 'Chromosome')

                            d3.select(this)
                                .on('mouseenter', event => showTooltip(event, chromosomeHeaderTooltipTemplate(chr)))
                                .on('mousemove', event => showTooltip(event, chromosomeHeaderTooltipTemplate(chr)))
                                .on('mouseout', hideTooltip)
                        })
                        .on('click', function (event, d) {
                            const chr = d[0]
                            const afterChr = chromosomeList.slice(chromosomeList.indexOf(chr) + 1, chromosomeList.length)
                            const chrLength = chromosomeLengthList[chromosomeList.indexOf(chr)]

                            expandChromosomeCNVViz(
                                chr,
                                afterChr,
                                heatMapContainer,
                                chrLength,
                                blockWidth,
                                d,
                                this.parentNode,
                                chromosomeHeaderContainer,
                                blockGap)
                        })

                    gElement.append('text')
                        .attr('x', d => d[2] / 2)
                        .attr('y', chromosomeLegendHeight / 2)
                        .attr('pointer-events', 'none')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '.35em')
                        .text(d => d[0].slice(3, d[0].length))
                        .attr('fill', (d, i) => i % 2 === 0 ? '#000000' : '#ffffff')
                },
                update => {
                    chromosomeHeaderContainer.attr('transform', `translate(${metaOffset}, 0)`)

                    update.each(function () {
                        const gElement = d3.select(this)
                            .attr('transform', d => `translate(${d[1]}, 0)`)

                        gElement.select('rect')
                            .attr('width', d => d[2])
                            .attr('height', chromosomeLegendHeight)
                            .on('click', function (event, d) {
                                const chr = d[0]
                                const afterChr = chromosomeList.slice(chromosomeList.indexOf(chr) + 1, chromosomeList.length)
                                const chrLength = chromosomeLengthList[chromosomeList.indexOf(chr)]

                                expandChromosomeCNVViz(
                                    chr,
                                    afterChr,
                                    heatMapContainer,
                                    chrLength,
                                    blockWidth,
                                    d,
                                    this.parentNode,
                                    chromosomeHeaderContainer,
                                    blockGap)
                            })

                        gElement.select('text')
                            .attr('x', d => d[2] / 2)
                            .attr('y', chromosomeLegendHeight / 2)
                    })
                }
            )

        let metaHeaderContainer = headerContainer.select('.metaHeader')
        if (metaHeaderContainer.empty()) {
            metaHeaderContainer = headerContainer.append('g')
                .attr('class', 'metaHeader')
                .attr('transform', `translate(0, ${chromosomeLegendHeight})`)
        } else {
            metaHeaderContainer.attr('transform', `translate(0, ${chromosomeLegendHeight})`)
        }

        metaHeaderContainer
            .selectAll('text')
            .data(metaHeaders)
            .join(
                enter => {
                    enter.append('text')
                        .attr('dy', '0.3em')
                        .attr('font-size', '12')
                        .attr('font-family', 'sans-serif')
                        .attr('transform', (d, i) => `rotate(-90) translate(4, ${metaWidth * i})`)
                        .text(d => d.split('_').pop())
                },
                update => {
                    metaHeaderContainer.selectAll('text')
                        .attr('transform', (d, i) => `rotate(-90) translate(4, ${metaWidth * i + metaWidth / 2})`)
                }
            )
    }, [CNVMatrixMeta, blockGap, blockWidth, chromosomeLegendHeight, headerBlockOffset, hideTooltip, metaHeaders, metaOffset, metaWidth, showTooltip]);

    return (
        <>
            <g ref={headerContainerRef} transform={`translate(${marginLeft}, ${paddingTop})`}></g>
        </>
    )
}

const expandChromosomeCNVViz = (chr, afterChr, heatMapContainer, chrLength, width, headerDatum, headerClicked, chromosomeHeaderContainer, blockGap) => {
    const scale = 5
    const offset = chrLength * width * (scale - 1)

    const chromosomeSelection = heatMapContainer.selectAll('.chromosome').selectAll('g')
    const currentChromosomeSelection = chromosomeSelection.filter(function (d) {
        return d === chr
    })
    const afterChromosomeSelection = chromosomeSelection.filter(function (d) {
        return afterChr.includes(d)
    })
    const afterHeaderSelection = chromosomeHeaderContainer.selectAll('g').filter(function (d) {
        return afterChr.includes(d[0])
    })

    if (parseFloat(currentChromosomeSelection.select('rect').attr('width')) !== width - blockGap) {
        afterChromosomeSelection.each(function () {
            const currentTransform = d3.select(this).attr('transform')
            const currentXOffset = parseFloat(currentTransform.match(/translate\(([\d.]+), 0\)/)[1])

            d3.select(this)
                .attr('transform', `translate(${currentXOffset - offset}, 0)`)
        })
        currentChromosomeSelection.selectAll('rect').attr('width', width - blockGap).attr('x', (d, i) => i * width)

        d3.select(headerClicked).select('rect').attr('width', chrLength * width)
        d3.select(headerClicked).select('text').attr('x', (chrLength * width) / 2)
        afterHeaderSelection.each(function () {
            const currentTransform = d3.select(this).attr('transform')
            const currentXOffset = parseFloat(currentTransform.match(/translate\(([\d.]+), 0\)/)[1])

            d3.select(this)
                .attr('transform', `translate(${currentXOffset - offset}, 0)`)
        })
    } else {
        afterChromosomeSelection.each(function () {
            const currentTransform = d3.select(this).attr('transform')
            const currentXOffset = parseFloat(currentTransform.match(/translate\(([\d.]+), 0\)/)[1])

            d3.select(this)
                .attr('transform', `translate(${currentXOffset + offset}, 0)`)
        })
        currentChromosomeSelection.selectAll('rect').attr('width', scale * width - blockGap).attr('x', (d, i) => i * scale * width)

        d3.select(headerClicked).select('rect').attr('width', chrLength * scale * width)
        d3.select(headerClicked).select('text').attr('x', (chrLength * scale * width) / 2)
        afterHeaderSelection.each(function () {
            const currentTransform = d3.select(this).attr('transform')
            const currentXOffset = parseFloat(currentTransform.match(/translate\(([\d.]+), 0\)/)[1])

            d3.select(this)
                .attr('transform', `translate(${currentXOffset + offset}, 0)`)
        })
    }
}

export default CNAChromosomeHeatmapHeader
