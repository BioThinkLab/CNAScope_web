import * as d3 from "d3"

export const parseCNVMeta = (CNVMeta, numericProps, metaFields) => {
    const meta = d3.csvParse(CNVMeta, d3.autoType)
    const numericPropsValueRanges = getNumericPropsValueRanges(numericProps, meta)

    const colorScales = {
        ...getCNVMetaNumericPropsColorScale(numericPropsValueRanges)
    }

    const processedMeta = processMatrix(meta, metaFields)

    return {
        processedMeta,
        colorScales,
    }
}

const getNumericPropsValueRanges = (numericProps, ObjectList) => {
    const numericValueRanges = {}

    numericProps.forEach((numericProp) => {
        const values = ObjectList.map(object => object[numericProp])

        numericValueRanges[numericProp] = {
            min: Math.min(...values),
            max: Math.max(...values)
        }
    })

    return numericValueRanges
}

const getCNVMetaNumericPropsColorScale = (numericPropsValueRanges) => {
    const ePC1ColorScale = d3.scaleLinear()
        .domain([numericPropsValueRanges['e_PCA1'].min, numericPropsValueRanges['e_PCA1'].max])  // 设定数据的值域，0到100
        .range(['#c4a1d3', '#ad49e1'])

    const ePC2ColorScale = d3.scaleLinear()
        .domain([numericPropsValueRanges['e_PCA2'].min, numericPropsValueRanges['e_PCA2'].max])
        .range(['#52b199', '#0d7c66'])

    const eTSNE1ColorScale = d3.scaleLinear()
        .domain([numericPropsValueRanges['e_TSNE1'].min, numericPropsValueRanges['e_TSNE2'].max])
        .range(['#d88f92', '#c63c51'])

    const eTSNE2ColorScale = d3.scaleLinear()
        .domain([numericPropsValueRanges['e_TSNE2'].min, numericPropsValueRanges['e_TSNE2'].max])
        .range(['#bad9ff', '#3572ef'])

    const eUMAP1ColorScale = d3.scaleLinear()
        .domain([numericPropsValueRanges['e_UMAP1'].min, numericPropsValueRanges['e_UMAP1'].max])
        .range(['#ffa699', '#ff7f3e'])

    const eUMAP2ColorScale = d3.scaleLinear()
        .domain([numericPropsValueRanges['e_UMAP2'].min, numericPropsValueRanges['e_UMAP2'].max])
        .range(['#f0e8fa', '#FF76CE'])

    return {
        'e_PCA1': ePC1ColorScale,
        'e_PCA2': ePC2ColorScale,
        'e_TSNE1': eTSNE1ColorScale,
        'e_TSNE2': eTSNE2ColorScale,
        'e_UMAP1': eUMAP1ColorScale,
        'e_UMAP2': eUMAP2ColorScale
    }
}

export const parseGeneCNVMatrix = (CNVMatrix, geneInfos, baselineCNA) => {
    const matrix = d3.csvParse(CNVMatrix, d3.autoType)
    const CNVColorScale = createGeneCNVColorScale(baselineCNA)
    const geneIdFields = geneInfos.map(geneInfo => geneInfo['gene'])
    const processedMatrix = processMatrix(matrix, geneIdFields)

    return {
        processedMatrix,
        CNVColorScale
    }
}

const createGeneCNVColorScale = (baselineCNA) => {
    const lowRange = baselineCNA === 2 ? [0, 2] : [-1, 0]
    const highRange = baselineCNA === 2 ? [2, 10] : [0, 1]

    const colorScaleLow = d3.scaleLinear()
        .domain(lowRange)
        .range(['#add8e6', '#ffffff'])
        .clamp(true)
    const colorScaleHigh = d3.scaleLinear()
        .domain(highRange)
        .range(['#ffffff', '#6A0220'])
        .clamp(true)

    return (value) => {
        return value < 2 ? colorScaleLow(value) : colorScaleHigh(value)
    }
}

const processMatrix = (matrix, fields) => {
    return matrix.reduce((acc, item) => {
        const fileId = item['id']
        acc[fileId] = fields.map(field => item[field])

        return acc
    }, {})
}
