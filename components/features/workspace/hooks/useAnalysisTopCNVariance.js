import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import * as d3 from "d3"
import { getAnalysisTopCNVarianceUrl } from "@/lib/api/analysis"

export const useAnalysisTopCNVariance = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        getAnalysisTopCNVarianceUrl(taskId),
        fetcher
    )

    let topCNVariances = []
    if (data) {
        try {
            topCNVariances = d3.csvParse(data, d3.autoType)
        } catch (err) {
            console.error('Error parsing CSV:', err)
        }
    }

    return {
        topCNVariances,
        isTopCNVariancesLoading: isLoading,
        isTopCNVariancesError: error,
        mutate
    }
}
