import { ANALYSIS_API_BASE } from "@/lib/api/config"

export const getBasicAnnotationSubmitUrl = () => {
    return `${ANALYSIS_API_BASE}/submit_basic_annotation_task/`
}

export const getRecurrentAnnotationSubmitUrl = () => {
    return `${ANALYSIS_API_BASE}/submit_recurrent_cna_task/`
}

export const getQueryTaskUrl = () => {
    return `${ANALYSIS_API_BASE}/query_task/`
}
