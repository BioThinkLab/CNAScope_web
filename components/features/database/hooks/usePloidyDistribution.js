import useSWR from "swr"
import { getPloidyDistributionUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const usePloidyDistribution = (datasetName, workflow) => {
    const { data, error, isLoading, mutate } = useSWR(
        getPloidyDistributionUrl(datasetName, workflow),
        fetcher
    )

    return {
        distributions: data,
        isDistributionsLoading: isLoading,
        isDistributionsError: error,
        mutate
    }
}
