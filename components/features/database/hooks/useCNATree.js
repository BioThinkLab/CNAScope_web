import useSWR from "swr"
import { getCNATreeUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useCNATree = (datasetName, workflow, binSize) => {
    const { data, error, isLoading, mutate } = useSWR(
        getCNATreeUrl(datasetName, workflow, binSize),
        fetcher
    )

    return {
        tree: data,
        isTreeLoading: isLoading,
        isTreeError: error,
        mutate
    }
}
