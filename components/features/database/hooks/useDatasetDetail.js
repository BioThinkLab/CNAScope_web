import useSWR from "swr"
import { getDatasetDetailUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useDatasetDetail = (datasetName) => {
    const { data, error, isLoading, mutate } = useSWR(
        datasetName ? getDatasetDetailUrl(datasetName) : null,
        fetcher
    )

    return {
        dataset: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}
