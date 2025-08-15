import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getAnalysisCNAMetaUrl } from "@/lib/api/analysis"

export const useAnalysisCNAMeta = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        getAnalysisCNAMetaUrl(taskId),
        fetcher
    )

    return {
        meta: data,
        isMetaLoading: isLoading,
        isMetaError: error,
        mutate
    }
}
