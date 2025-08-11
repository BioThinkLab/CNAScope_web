import useSWR from "swr"
import { getCNATreeUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useCNATree = (datasetName, workflow) => {
    const { data, error, isLoading, mutate } = useSWR(
        getCNATreeUrl(datasetName, workflow),
        fetcher
    )

    return {
        tree: data,
        isTreeLoading: isLoading,
        isTreeError: error,
        mutate
    }
}
