import useSWR from "swr"
import { getCNATermListUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useCNATermList = (datasetName, workflow) => {
    const { data, error, isLoading, mutate } = useSWR(
        getCNATermListUrl(datasetName, workflow),
        fetcher
    )

    return {
        terms: data,
        isTermsLoading: isLoading,
        isTermsError: error,
        mutate
    }
}
