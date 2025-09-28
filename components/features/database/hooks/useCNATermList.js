import useSWR from "swr"
import { getCNATermListUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useCNATermList = (datasetName, workflow, binSize) => {
    const { data, error, isLoading, mutate } = useSWR(
        getCNATermListUrl(datasetName, workflow, binSize),
        fetcher
    )

    return {
        terms: data,
        isTermsLoading: isLoading,
        isTermsError: error,
        mutate
    }
}
