import { ANALYSIS_API_BASE } from "@/lib/api/config"
import { getPloidyDistributionUrl } from "@/lib/api/dataset"

export const getBasicAnnotationSubmitUrl = () => {
    return `${ANALYSIS_API_BASE}/submit_basic_annotation_task/`
}

export const getRecurrentAnnotationSubmitUrl = () => {
    return `${ANALYSIS_API_BASE}/submit_recurrent_cna_task/`
}

export const getQueryTaskUrl = () => {
    return `${ANALYSIS_API_BASE}/query_task/`
}

export const getRunDemoUrl = (demoType) => {
    return `${ANALYSIS_API_BASE}/run_demo/?name=${demoType}`
}

export const buildQueryTaskUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/query_task/?taskUUID=${taskId}`
}

export const getAnalysisCNAMatrixUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/CNA_matrix/?uuid=${taskId}`
}

export const getAnalysisCNAMetaUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/CNA_meta/?uuid=${taskId}`
}

export const getAnalysisCNATreeUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/CNA_tree/?uuid=${taskId}`
}

export const getAnalysisCNAGenesUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/CNA_genes/?uuid=${taskId}`
}

export const getAnalysisCNANewickUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/CNA_newick/?uuid=${taskId}`
}

export const getAnalysisCNAGeneMatrixUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/CNA_gene_matrix/?uuid=${taskId}`
}

export const getAnalysisCNATermsUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/CNA_terms/?uuid=${taskId}`
}

export const getAnalysisCNATermsMatrixUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/CNA_term_matrix/?uuid=${taskId}`
}

export const getAnalysisPloidyDistributionUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/ploidy_distribution/?uuid=${taskId}`
}

export const getAnalysisFocalCNAInfoUrl = (taskId) => {
    return `${ANALYSIS_API_BASE}/focal_CNA_info/?uuid=${taskId}`
}
