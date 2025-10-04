import * as d3 from 'd3'

export const initFigure = (renderData, svgWidth, svgHeight, config) => {
    const data = renderData.map(item => ({
        "Gene_set": item["Gene_set"],
        "Term": item["Term"],
        "-log10(Adjusted P-value)": -Math.log10(item["Adjusted P-value"]), // 计算 -log10
        "Odds Ratio": item["Odds Ratio"]
    }))

    const x = d3.scaleBand()
        .domain(data.map(d => d['Term']))
        .range([config.chart.marginLeft, svgWidth - config.chart.marginRight])
        .padding(0.1)

    const xAxis = d3.axisBottom(x).tickSizeOuter(0)

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['-log10(Adjusted P-value)'])]).nice()
        .range([svgHeight - config.chart.marginBottom, config.chart.marginTop])

    const minValue = 0;  // 设置从 0 开始
    const maxValue = Math.ceil(d3.max(data, d => d['Odds Ratio']) / 5) * 5;  // 最大值取5的倍数

    const colorScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range(["#d7301f", "#4575b4"])

    const colorScaleOffsetX = svgWidth - config.chart.marginRight + 30
    const colorScaleOffsetY = (svgHeight - config.chart.marginTop - config.chart.marginBottom) / 2

    return {
        x,
        xAxis,
        y,
        data,
        colorScale,
        colorScaleOffsetX,
        colorScaleOffsetY
    }
}
