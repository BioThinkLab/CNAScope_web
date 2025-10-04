import useSWR from "swr"
import { getPathwayEnrichmentOptionsUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const usePathwayEnrichmentOptions = (datasetName) => {
    const { data, error, isLoading, mutate } = useSWR(
        getPathwayEnrichmentOptionsUrl(datasetName),
        fetcher
    )

    return {
        options: data,
        isOptionsLoading: isLoading,
        isOptionsError: error,
        mutate
    }
}
