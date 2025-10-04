import useSWR from "swr"
import { getFocalCNAOptionsUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useFocalCNAOptions = (datasetName) => {
    const { data, error, isLoading, mutate } = useSWR(
        getFocalCNAOptionsUrl(datasetName),
        fetcher
    )

    return {
        focalOptions: data || [],
        isFocalOptionsLoading: isLoading,
        isFocalOptionsError: error,
        mutate,
    }
}

export default useFocalCNAOptions
