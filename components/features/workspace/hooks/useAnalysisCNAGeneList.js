import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getAnalysisCNAGenesUrl } from "@/lib/api/analysis"

export const useAnalysisCNAGeneList = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        getAnalysisCNAGenesUrl(taskId),
        fetcher
    )

    return {
        genes: data,
        isGenesLoading: isLoading,
        isGenesError: error,
        mutate
    }
}
