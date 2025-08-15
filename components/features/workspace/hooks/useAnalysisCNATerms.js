import useSWR from "swr"
import { getCNATermListUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"
import { getAnalysisCNATermsUrl } from "@/lib/api/analysis"

export const useAnalysisCNATerms = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        getAnalysisCNATermsUrl(taskId),
        fetcher
    )

    return {
        terms: data,
        isTermsLoading: isLoading,
        isTermsError: error,
        mutate
    }
}
