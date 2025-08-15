import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getAnalysisCNANewickUrl } from "@/lib/api/analysis"

export const useAnalysisCNANewick = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        getAnalysisCNANewickUrl(taskId),
        fetcher
    )

    return {
        newick: data,
        isNewickLoading: isLoading,
        isNewickError: error,
        mutate
    }
}
