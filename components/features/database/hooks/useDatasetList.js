import useSWR from "swr"
import { getDatasetListUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useDatasetList = () => {
    const { data, error, isLoading, mutate } = useSWR(
        getDatasetListUrl(),
        fetcher
    )

    return {
        datasets: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}
