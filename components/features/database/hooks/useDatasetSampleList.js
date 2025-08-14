import useSWR from "swr"
import { getDatasetSamplesURL } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useDatasetSampleList = (datasetName) => {
    const { data, error, isLoading, mutate } = useSWR(
        datasetName ? getDatasetSamplesURL(datasetName) : null,
        fetcher
    )

    return {
        samples: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}
