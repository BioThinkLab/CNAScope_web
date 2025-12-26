import * as d3 from "d3"
import { Heap } from "heap-js"
import { parseNewickTree } from "@/components/features/visualization/utils/TreeUtils"

const SCROLLBAR_HEIGHT = 16

export const initFigureConfig = (height, cluster, config) => {
    const svgHeight = height - SCROLLBAR_HEIGHT
    const innerHeight = svgHeight - config.chart.margin * 2
    const yTitleHeight = config.title.marginTop + config.title.marginBottom + Math.ceil(config.title.fontSize * 1.31)
    const figureSize = innerHeight - yTitleHeight - config.chart.axisWidth

    const rowLegendNum = Math.floor(figureSize / (config.legend.height + config.legend.itemVerticalGap))
    const rowNum = Math.ceil(cluster / rowLegendNum)

    const innerWidth = figureSize + config.chart.axisWidth + (rowNum - 1) * config.legend.itemHorizontalGap + rowNum * config.legend.width + config.legend.marginLeft
    const svgWidth = innerWidth + config.chart.margin * 2

    const xOffsetScatterPlot = config.chart.axisWidth
    const yOffsetScatterPlot = yTitleHeight
    const yOffsetXAxis = yTitleHeight + figureSize

    const xOffsetLegend = config.chart.axisWidth + figureSize + config.legend.marginLeft
    const yOffsetLegend = rowNum === 1 ? (
        yTitleHeight + (figureSize - config.legend.height * cluster - config.legend.itemVerticalGap * (cluster - 1)) / 2
    ) : (
        yTitleHeight + (figureSize - config.legend.height * rowLegendNum - config.legend.itemVerticalGap * (rowLegendNum - 1)) / 2
    )

    const xRange = [0, figureSize]
    const yRange = [figureSize, 0]

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    return {
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
    }
}

export const initGeneFigureConfig = (height, config, isLog) => {
    const svgHeight = height - SCROLLBAR_HEIGHT
    const innerHeight = svgHeight - config.chart.margin * 2
    const yTitleHeight = config.title.marginTop + config.title.marginBottom + Math.ceil(config.title.fontSize * 1.31)
        + Math.ceil(config.title.subFontSize * 1.31) + 10
    const subTitleMarginTop = config.title.marginTop + Math.ceil(config.title.fontSize * 1.31) + 10
    const figureSize = innerHeight - yTitleHeight - config.chart.axisWidth

    const innerWidth = figureSize + config.chart.axisWidth + 40 + config.legend.marginLeft
    const svgWidth = innerWidth + config.chart.margin * 2

    const xOffsetScatterPlot = config.chart.axisWidth
    const yOffsetScatterPlot = yTitleHeight
    const yOffsetXAxis = yTitleHeight + figureSize

    const xOffsetLegend = config.chart.axisWidth + figureSize + config.legend.marginLeft
    const yOffsetLegend = yTitleHeight + (figureSize - 320) / 2

    const xRange = [0, figureSize]
    const yRange = [figureSize, 0]

    const CNARange = isLog ? [-1, 0, 1] : [0, 2, 10]
    const CNAValueScale = d3.scaleSqrt(CNARange, ["#add8e6", "#e0e0e0", "#6A0220"])

    return {
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
    }
}

export const initAxisDomain = (embeddingMethod, extents) => {
    const axisDomain = [
        Math.min(extents[`${embeddingMethod}1`].min, extents[`${embeddingMethod}2`].min),
        Math.max(extents[`${embeddingMethod}1`].max, extents[`${embeddingMethod}2`].max),
    ]

    return [Math.floor(axisDomain[0] * 10 - 1) / 10, Math.ceil(axisDomain[1] * 10 + 1) / 10]
}

export const initAxis = (axisDomain, xRange, yRange) => {
    const x = d3.scaleLinear()
        .domain(axisDomain)
        .range(xRange)

    const y = d3.scaleLinear()
        .domain(axisDomain)
        .range(yRange)

    return {
        x,
        y
    }
}

export const clusterPruning = (newick, cluster) => {
    const root = parseNewickTree(newick)

    if (root.leaves().length < cluster) return null

    const leaves = new Heap((a, b) => a.data.distanceToRoot - b.data.distanceToRoot)
    leaves.push(root)

    while (leaves.length !== cluster) {
        const leaf = leaves.pop()

        leaves.push(...leaf.children)

        if (leaves.peek().children === undefined) break
    }

    const prunedLeaves = leaves.toArray().sort((a, b) => b.x - a.x)

    return prunedLeaves.map((leaf, index) =>
        [
            index + 1,
            leaf.leaves().map(item => item.data.name)
        ]
    )
}

const availableEmbeddingMethod = [
    {
        label: 'PCA',
        value: 'e_PCA'
    },
    {
        label: 'TSNE',
        value: 'e_TSNE'
    },
    {
        label: 'UMAP',
        value: 'e_UMAP'
    },
    {
        label: 'NMF',
        value: 'e_NMF'
    },
    {
        label: 'ICA',
        value: 'e_ICA'
    },
    {
        label: 'PHATE',
        value: 'e_PHATE'
    },
    {
        label: 'Spatial',
        value: 'n_spatial'
    }
]

const detectEmbeddingMethods = (columns) => {
    const supportedMethods = []

    availableEmbeddingMethod.forEach(method => {
        if (columns.some(col => col.startsWith(method.value))) {
            supportedMethods.push(method)
        }
    })

    return supportedMethods
}

const convertHeaderName = (header) => {
    // 如果是 n_spatial_x 格式，去掉下划线
    if (/n_spatial_\d+/.test(header)) {
        return header.replace('n_spatial_', 'n_spatial')  // 替换为 n_spatialx 格式
    }

    return header  // 其他情况返回原列名
}

const convertData = (d) => {
    const transformedData = {};

    for (const key in d) {
        let value = d[key];

        // 1. 转换列名
        const transformedKey = convertHeaderName(key);

        // 2. 尝试转换数值字段
        // 如果是数值字段，尝试转换为数字
        const numValue = +value;
        if (!isNaN(numValue)) {
            value = numValue;  // 如果可以转换为数字，使用数字
        }

        // 将转换后的数据存入对象
        transformedData[transformedKey] = value;
    }

    return transformedData;
}

export const processMeta = (meta) => {
    const rows = d3.csvParse(meta, convertData)

    const supportedMethods = detectEmbeddingMethods(rows.columns)
    const numericFields = supportedMethods.flatMap(method => [`${method.value}1`, `${method.value}2`])
    const extents = Object.fromEntries(numericFields.map(f => [f, { min: Infinity, max: -Infinity }]))

    for (const row of rows) {
        for (const f of numericFields) {
            const v = row[f]
            if (!Number.isFinite(v)) continue     // 忽略 null/undefined/NaN
            if (v < extents[f].min) extents[f].min = v
            if (v > extents[f].max) extents[f].max = v
        }
    }

    // 若某字段全是空，置为 null
    for (const f of numericFields) {
        if (extents[f].min === Infinity) extents[f] = { min: null, max: null }
    }

    const filteredMethods = supportedMethods.filter(method => method.value !== 'n_spatial')

    return { parsedMeta: rows, embeddingMethods: filteredMethods, extents }
}

export const clusterMeta = (meta, newick, cluster) => {
    const clusters = clusterPruning(newick, cluster)

    if (!clusters) {
        return []
    }

    // 创建一个映射以根据id查找对应的clusterIndex
    const idToCluster = new Map()
    clusters.forEach(([clusterIndex, items]) => {
        items.forEach(item => {
            idToCluster.set(item, clusterIndex)  // 记录每个item的clusterIndex
        })
    })

    // 将clusterIndex整合到每个processedMeta项中
    return meta.map(row => {
        const cluster = idToCluster.get(row.id) || null  // 如果没有找到，则设为null
        return { ...row, cluster }
    })
}

export const processTopCNVariances = (topCNVariances) => {
    const binOptions = []
    const geneOptions = []
    const termOptions = []

    for (const item of topCNVariances) {
        if (item['Type'] === 'Bin') {
            binOptions.push({
                value: item['id'],
                variance: item['Variance']
            })
        } else if (item['Type'] === 'Gene') {
            geneOptions.push({
                value: item['id'],
                variance: item['Variance']
            })
        } else if (item['Type'] === 'Term') {
            termOptions.push({
                value: item['id'],
                variance: item['Variance']
            })
        }
    }

    return {
        binOptions,
        geneOptions,
        termOptions
    }
}

export const processSpatialTopCNVariances = (topCNVariances) => {
    const binOptions = []
    const geneOptions = []
    const termOptions = []

    for (const item of topCNVariances) {
        if (item['Type'] === 'Bin') {
            binOptions.push({
                value: item['id'],
                moranI: item['Moran I']
            })
        } else if (item['Type'] === 'Gene') {
            geneOptions.push({
                value: item['id'],
                moranI: item['Moran I']
            })
        } else if (item['Type'] === 'Term') {
            termOptions.push({
                value: item['id'],
                moranI: item['Moran I']
            })
        }
    }

    return {
        binOptions,
        geneOptions,
        termOptions
    }
}
