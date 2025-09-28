import useSWR from "swr"
import { getFocalCNAInfoUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useFocalCNAInfo = (datasetName, workflow, binSize) => {
    const { data, error, isLoading, mutate } = useSWR(
        getFocalCNAInfoUrl(datasetName, workflow, binSize),
        fetcher
    )

    return {
        focalInfo: data || [],
        isFocalInfoLoading: isLoading,
        isFocalInfoError: error,
        mutate,
    }
}
