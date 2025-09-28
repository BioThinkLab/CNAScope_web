import useSWR from "swr"
import { getCNAMetaUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useCNAMeta = (datasetName, workflow, binSize) => {
    const { data, error, isLoading, mutate } = useSWR(
        getCNAMetaUrl(datasetName, workflow, binSize),
        fetcher
    )

    return {
        meta: data,
        isMetaLoading: isLoading,
        isMetaError: error,
        mutate
    }
}
