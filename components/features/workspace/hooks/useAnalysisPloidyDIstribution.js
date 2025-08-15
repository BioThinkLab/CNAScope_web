import useSWR from "swr"
import { getPloidyDistributionUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"
import { getAnalysisPloidyDistributionUrl } from "@/lib/api/analysis"

export const useAnalysisPloidyDIstribution = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        getAnalysisPloidyDistributionUrl(taskId),
        fetcher
    )

    return {
        distributions: data,
        isDistributionsLoading: isLoading,
        isDistributionsError: error,
        mutate
    }
}
