import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getAnalysisCNAMatrixUrl } from "@/lib/api/analysis"

export const useAnalysisCNAMatrix = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        getAnalysisCNAMatrixUrl(taskId),
        fetcher
    )

    return {
        matrix: data,
        isMatrixLoading: isLoading,
        isMatrixError: error,
        mutate
    }
}
