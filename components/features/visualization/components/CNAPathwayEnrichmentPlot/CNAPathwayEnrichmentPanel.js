import { useContainerSize } from "@/components/common/container/ResponsiveVisualizationContainer"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import { initFigure } from "@/components/features/visualization/utils/pathwayEnrichmentUtils"
import * as d3 from "d3"
import { VerticalColorLegend } from "@/components/features/visualization/components/legend/ColorLegend"
import * as _ from "lodash"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"

const CNAPathwayEnrichmentPanel = forwardRef(({
    renderData,
    config
}, ref) => {
    const svgRef = useRef(null)
    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)
    const barsRef = useRef(null)
    const tooltipRef = useRef(null)

    const { width, height } = useContainerSize()
    const svgWidth = width - 320
    const svgHeight = height - 20

    const {
        x,
        xAxis,
        y,
        data,
        colorScale,
        colorScaleOffsetX,
        colorScaleOffsetY
    } = useMemo(() => {
        return initFigure(renderData, svgWidth, svgHeight, config)
    }, [config, renderData, svgHeight, svgWidth])

    useEffect(() => {
        tooltipRef.current = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background-color', 'rgba(0, 0, 0, 0.7)')
            .style('color', 'white')
            .style('padding', '5px')
            .style('border-radius', '4px')
    }, []);

    useEffect(() => {
        const gXAxis = d3.select(xAxisRef.current)

        gXAxis.attr("class", "x-axis")
            .attr("transform", `translate(0,${svgHeight - config.chart.marginBottom})`)
            .call(xAxis)

        gXAxis.selectAll('text')
            .each(function(d) {
                // 获取当前文本内容
                let text = d;

                // 判断文本长度是否超过 20 个字符
                if (text.length > 15) {
                    // 截断文本并添加省略号
                    text = text.substring(0, 15) + '...';
                }

                // 更新文本内容并设置 title（完整文本）
                d3.select(this)
                    .text(text)
                    .attr('title', d)  // title（不一定工作）
                    .on('mouseover', function(event, d) {
                        // 在鼠标悬停时显示 tooltip
                        tooltipRef.current.style('visibility', 'visible')
                            .text(d);  // 显示完整文本
                    })
                    .on('mousemove', function(event) {
                        // 在鼠标移动时更新 tooltip 位置
                        tooltipRef.current.style('top', (event.pageY + 5) + 'px')
                            .style('left', (event.pageX + 5) + 'px');
                    })
                    .on('mouseout', function() {
                        // 鼠标离开时隐藏 tooltip
                        tooltipRef.current.style('visibility', 'hidden');
                    });

                // 应用旋转和文本对齐
                d3.select(this)
                    .attr('transform', 'rotate(45)')
                    .style('text-anchor', 'start');
            });

    }, [config.chart.marginBottom, svgHeight, xAxis])

    useEffect(() => {
        const gYAxis = d3.select(yAxisRef.current)

        gYAxis.attr("class", "y-axis")
            .attr("transform", `translate(${config.chart.marginLeft},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
    }, [config.chart.marginLeft, y])

    useEffect(() => {
        const gBars = d3.select(barsRef.current)

        gBars.attr("class", "bars")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x(d['Term']))
            .attr("y", d => y(d['-log10(Adjusted P-value)']))
            .attr("height", d => y(0) - y(d['-log10(Adjusted P-value)']))
            .attr("width", x.bandwidth())
            .attr("fill", d => colorScale(d['Odds Ratio']))
            // 鼠标悬停显示 tooltip
            .on("mouseover", function(event, d) {
                tooltipRef.current.style("visibility", "visible")
                    .html(`-log10(Adjusted P-value): ${_.round(d['-log10(Adjusted P-value)'], 3)}<br>Odds Ratio: ${_.round(d['Odds Ratio'], 3)}`);  // 显示 Odds Ratio
            })

            // 鼠标移动时更新 tooltip 位置
            .on("mousemove", function(event) {
                tooltipRef.current.style("top", (event.pageY + 5) + "px")
                    .style("left", (event.pageX + 5) + "px");
            })

            // 鼠标移出时隐藏 tooltip
            .on("mouseout", function() {
                tooltipRef.current.style("visibility", "hidden");
            });
    }, [colorScale, data, x, y])

    useEffect(() => {
        function zoom(svg) {
            const extent = [
                [config.chart.marginLeft, config.chart.marginTop],
                [svgWidth - config.chart.marginRight, svgHeight - config.chart.marginTop]
            ]

            svg.call(d3.zoom()
                .scaleExtent([1, 8])
                .translateExtent(extent)
                .extent(extent)
                .on("zoom", zoomed));

            function zoomed(event) {
                x.range(
                    [
                        config.chart.marginLeft,
                        svgWidth - config.chart.marginRight
                    ].map(d => event.transform.applyX(d)))
                svg.selectAll(".bars rect").attr("x", d => x(d['Term'])).attr("width", x.bandwidth());
                svg.selectAll(".x-axis").call(xAxis);
            }
        }

        d3.select(svgRef.current).call(zoom)
    }, [config.chart.marginLeft, config.chart.marginRight, config.chart.marginTop, svgHeight, svgWidth, x, xAxis])

    useImperativeHandle(ref, () => ({
        downloadSvg: () => {
            if (!svgRef.current) return
            downloadSvg(svgRef.current, `Pathway_Enrichment_Plot.svg`)
        }
    }))

    return (
        <svg ref={svgRef} width={svgWidth} height={svgHeight}>
            <clipPath id="chart-clip">
                <rect
                    x={config.chart.marginLeft}
                    y={0}
                    width={svgWidth - config.chart.marginLeft - config.chart.marginRight}
                    height={svgHeight}
                />
            </clipPath>
            <text
                fontSize='24px'
                transform={`translate(${svgWidth / 2}, ${40})`}
                dy='1rem'
                fontWeight={500}
                textAnchor='middle'
            >
                Pathway Enrichment Plot
            </text>
            <g ref={xAxisRef} clipPath="url(#chart-clip)"></g>
            <g ref={yAxisRef}></g>
            <g ref={barsRef} clipPath="url(#chart-clip)"></g>
            <g transform={`translate(${colorScaleOffsetX}, ${colorScaleOffsetY})`}>
                <VerticalColorLegend
                    color={colorScale}
                    title={"Odds Ratio"}
                    height={320}
                    width={50}
                    legendMarginTop={0}
                />
            </g>
        </svg>
    )
})

CNAPathwayEnrichmentPanel.displayName = 'CNAPathwayEnrichmentPanel'

export default CNAPathwayEnrichmentPanel
