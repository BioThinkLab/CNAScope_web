import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getAnalysisCNATreeUrl } from "@/lib/api/analysis"

export const useAnalysisCNATree = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        getAnalysisCNATreeUrl(taskId),
        fetcher
    )

    return {
        tree: data,
        isTreeLoading: isLoading,
        isTreeError: error,
        mutate
    }
}
