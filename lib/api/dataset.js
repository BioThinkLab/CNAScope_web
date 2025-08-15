import { DATABASE_API_BASE } from "@/lib/api/config"

export const getDatasetListUrl = () => {
    return `${DATABASE_API_BASE}/datasets/`
}

export const getDatasetDetailUrl = (datasetName) => {
    return `${DATABASE_API_BASE}/datasets/${encodeURIComponent(datasetName)}/`
}

export const getDatasetSamplesURL = (datasetName) => {
    return `${DATABASE_API_BASE}/samples/?dataset_name=${encodeURIComponent(datasetName)}`
}

export const getCNAMatrixUrl = (datasetName, workflow) => {
    return `${DATABASE_API_BASE}/CNA_matrix/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}`
}

export const getCNAMetaUrl = (datasetName, workflow) => {
    return `${DATABASE_API_BASE}/CNA_meta/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}`
}

export const getCNATreeUrl = (datasetName, workflow) => {
    return `${DATABASE_API_BASE}/CNA_tree/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}`
}

export const getCNAGeneListUrl = (datasetName, workflow) => {
    return `${DATABASE_API_BASE}/CNA_genes/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}`
}

export const getCNANewickUrl = (datasetName, workflow) => {
    return `${DATABASE_API_BASE}/CNA_newick/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}`
}

export const getCNAGeneMatrixUrl = () => {
    return `${DATABASE_API_BASE}/CNA_gene_matrix/`
}

export const getCNATermListUrl = (datasetName, workflow) => {
    return `${DATABASE_API_BASE}/CNA_terms/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}`
}

export const getCNATermMatrixUrl = () => {
    return `${DATABASE_API_BASE}/CNA_term_matrix/`
}

export const getFocalCNAInfoUrl = (datasetName, workflow) => {
    return `${DATABASE_API_BASE}/focal_CNA_info/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}`
}

export const getGeneRecurrenceQueryUrl = (datasetName, workflow, page, pageSize) => {
    return `${DATABASE_API_BASE}/gene_recurrence_query/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}&page=${page}&page_size=${pageSize}`
}

export const getPloidyDistributionUrl = (datasetName, workflow) => {
    return `${DATABASE_API_BASE}/ploidy_distribution/?dataset_name=${encodeURIComponent(datasetName)}&workflow_type=${encodeURIComponent(workflow)}`
}
