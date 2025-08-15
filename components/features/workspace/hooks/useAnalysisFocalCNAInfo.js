import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getAnalysisFocalCNAInfoUrl } from "@/lib/api/analysis"

export const useAnalysisFocalCNAInfo = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        getAnalysisFocalCNAInfoUrl(taskId),
        fetcher
    )

    return {
        focalInfo: data || [],
        isFocalInfoLoading: isLoading,
        isFocalInfoError: error,
        mutate,
    }
}
