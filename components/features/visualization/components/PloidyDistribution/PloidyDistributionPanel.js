import { useContainerSize } from "@/components/common/container/ResponsiveVisualizationContainer"
import * as d3 from "d3"
import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"

const initFigure = (width, height, config, distributions) => {
    // Calculate global inner width and height.
    const innerWidth = width - config.chart.marginLeft - config.chart.marginRight
    const innerHeight = height - config.chart.marginTop - config.chart.marginBottom

    // Calculate Line Chart settings.
    const yPadding = 45 + config.chart.marginTop
    const lineChartWidth = innerWidth
    const lineChartHeight = innerHeight - yPadding
    const xRange = [config.chart.marginLeft, config.chart.marginLeft + lineChartWidth]
    const yRange = [config.chart.marginTop + yPadding + lineChartHeight, config.chart.marginTop + yPadding]

    const xValues = distributions.map(item => item[0])
    const yValues = distributions.map(item => item[1])

    const xDomain = [Math.min(...xValues), Math.max(...xValues)]
    const yDomain = [0, Math.ceil(Math.log10(Math.max(...yValues)))]

    const x = d3.scaleLinear()
        .domain(xDomain)
        .range([xRange[0], xRange[1]])

    const y = d3.scaleLinear()
        .domain(yDomain)
        .range([yRange[0], yRange[1]])

    const area = (data) => d3.area()
        .x(d => x(d[0]))
        .y0(y(0))
        .y1(d => y(d[1] === 0 ? 0 : Math.log10(d[1])))
        (data)

    return {
        xRange,
        yRange,
        x,
        y,
        area
    }
}

const PloidyDistributionPanel = forwardRef(({
    distributions,
    config,
    isShowLeft,
    handleIsShowLeftChange
}, ref) => {
    const { width, height } = useContainerSize()
    const svgWidth = isShowLeft ? width - 320 : width - 20
    const svgHeight = height - 20

    const svgRef = useRef(null)
    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)
    const pathRef = useRef(null)

    const {
        xRange,
        yRange,
        x,
        y,
        area
    } = initFigure(svgWidth, svgHeight, config, distributions)

    useEffect(() => {
        const gx = d3.select(xAxisRef.current)

        gx.call(
            d3.axisBottom(x).ticks((xRange[1] - xRange[0]) / 80)
        )
    }, [x, xRange])

    useEffect(() => {
        const gy = d3.select(yAxisRef.current)

        gy.selectAll('.tick .assist-line').remove()

        gy.call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line")
                .clone()
                .attr('class', 'assist-line')
                .attr("x2", xRange[1] - xRange[0])
                .attr("stroke-opacity", 0.2)
                .attr("stroke-dasharray", '10, 10')
            )

        gy.selectAll('.yAxis-label')
            .data([1])
            .join('text')
            .attr('x', -24)
            .attr('y', yRange[1] - 20)
            .attr('text-anchor', 'start')
            .attr('fill', 'black')
            .attr('font-weight', 'bold')
            .attr('class', 'yAxis-label')
            .text('log10(Count)')
    }, [xRange, y, yRange])

    useEffect(() => {
        const gPath = d3.select(pathRef.current)

        gPath.selectAll('path')
            .data([1])
            .join('path')
            .attr('stroke', "#1f77b4")
            .attr('fill', '#1f77b4')
            .attr('d', area(distributions))
    }, [area, distributions])

    useImperativeHandle(ref, () => ({
        downloadSvg: () => {
            if (!svgRef.current) return
            downloadSvg(svgRef.current, `CNA_Ploidy_Distribution.svg`)
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
            <svg
                width={svgWidth}
                height={svgHeight}
                ref={svgRef}
            >
                <text
                    fontSize='24px'
                    transform={`translate(${svgWidth / 2}, ${config.chart.marginTop})`}
                    dy='1rem'
                    fontWeight={500}
                    textAnchor='middle'
                >
                    CNA Ploidy Distribution
                </text>
                <g ref={xAxisRef} transform={`translate(0,${yRange[0]})`}></g>
                <g ref={yAxisRef} transform={`translate(${xRange[0]}, 0)`}></g>
                <g ref={pathRef}></g>
            </svg>
        </Box>
    )
})

PloidyDistributionPanel.displayName = 'PloidyDistributionPanel'

export default PloidyDistributionPanel
