import { DATABASE_API_BASE } from "@/lib/api/config"

export const downloadSingleFile = (fileUrl) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.click()
}

export const getDatasetListUrl = () => {
    return `${DATABASE_API_BASE}/datasets/`
}

export const getDatasetDownloadUrl = (datasetName) => {
    return `${DATABASE_API_BASE}/download_dataset/?dataset_name=${datasetName}`
}

export const getDatasetDetailUrl = (datasetName) => {
    return `${DATABASE_API_BASE}/datasets/${encodeURIComponent(datasetName)}/`
}

export const getDatasetSamplesURL = (datasetName) => {
    return `${DATABASE_API_BASE}/samples/?dataset_name=${encodeURIComponent(datasetName)}`
}

export const getCNAMatrixUrl = (datasetName, workflow, binSize) => {
    return `${DATABASE_API_BASE}/CNA_matrix/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&bin_size=${encodeURIComponent(binSize)}`
}

export const getCNAVectorUrl = () => {
    return `${DATABASE_API_BASE}/CNA_vector/`
}

export const getCNAMetaUrl = (datasetName, workflow, binSize) => {
    return `${DATABASE_API_BASE}/CNA_meta/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&bin_size=${encodeURIComponent(binSize)}`
}

export const getCNATreeUrl = (datasetName, workflow, binSize) => {
    return `${DATABASE_API_BASE}/CNA_tree/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&bin_size=${encodeURIComponent(binSize)}`
}

export const getCNAGeneListUrl = (datasetName, workflow, binSize) => {
    return `${DATABASE_API_BASE}/CNA_genes/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&bin_size=${encodeURIComponent(binSize)}`
}

export const getCNANewickUrl = (datasetName, workflow, binSize) => {
    return `${DATABASE_API_BASE}/CNA_newick/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&bin_size=${encodeURIComponent(binSize)}`
}

export const getCNAGeneMatrixUrl = () => {
    return `${DATABASE_API_BASE}/CNA_gene_matrix/`
}

export const getCNATermListUrl = (datasetName, workflow, binSize) => {
    return `${DATABASE_API_BASE}/CNA_terms/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&bin_size=${encodeURIComponent(binSize)}`
}

export const getCNATermMatrixUrl = () => {
    return `${DATABASE_API_BASE}/CNA_term_matrix/`
}

export const getFocalCNAOptionsUrl = (datasetName) => {
    return `${DATABASE_API_BASE}/focal_CNA_options/?dataset_name=${encodeURIComponent(datasetName)}`
}

export const getFocalCNAInfoUrl = (datasetName, CNType, workflow) => {
    return `${DATABASE_API_BASE}/focal_CNA_info/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&cn_type=${encodeURIComponent(CNType)}`
}

export const getGeneRecurrenceQueryUrl = (datasetName, workflow, page, pageSize) => {
    return `${DATABASE_API_BASE}/gene_recurrence_query/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&page=${page}&page_size=${pageSize}`
}

export const getPloidyDistributionUrl = (datasetName, workflow, binSize) => {
    return `${DATABASE_API_BASE}/ploidy_distribution/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&bin_size=${encodeURIComponent(binSize)}`
}

export const getTopCNVarianceUrl = (datasetName, workflow, binSize) => {
    return `${DATABASE_API_BASE}/top_cn_variance/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&bin_size=${encodeURIComponent(binSize)}`
}

export const getSpatialTopCNVarianceUrl = (datasetName, workflow, binSize) => {
    return `${DATABASE_API_BASE}/spatial_top_cn_variance/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&bin_size=${encodeURIComponent(binSize)}`
}

export const getConsensusFocalGene = (datasetName) => {
    return `${DATABASE_API_BASE}/consensus_focal_gene/?dataset_name=${encodeURIComponent(datasetName)}`
}

export const getConsensusGene = (datasetName) => {
    return `${DATABASE_API_BASE}/consensus_gene/?dataset_name=${encodeURIComponent(datasetName)}`
}

export const getConsensusGeneDownloadUrl = (datasetName) => {
    return `${DATABASE_API_BASE}/consensus_gene_download/?dataset_name=${encodeURIComponent(datasetName)}`
}

export const getPathwayEnrichmentOptionsUrl = (datasetName) => {
    return `${DATABASE_API_BASE}/pathway_enrichment_options/?dataset_name=${encodeURIComponent(datasetName)}`
}

export const getPathwayEnrichmentPlotUrl = (datasetName, CNType, workflow) => {
    return `${DATABASE_API_BASE}/pathway_enrichment_plot/?dataset_name=${encodeURIComponent(datasetName)}&cn_type=${encodeURIComponent(CNType)}&workflow=${encodeURIComponent(workflow)}`
}
