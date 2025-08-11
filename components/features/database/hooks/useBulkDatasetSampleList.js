import useSWR from "swr"
import { getBulkDatasetSamplesURL } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useBulkDatasetSampleList = (datasetName) => {
    const { data, error, isLoading, mutate } = useSWR(
        datasetName ? getBulkDatasetSamplesURL(datasetName) : null,
        fetcher
    )

    return {
        samples: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}
