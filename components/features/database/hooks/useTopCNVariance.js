import useSWR from "swr"
import { getTopCNVarianceUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"
import * as d3 from "d3"

export const useTopCNVariance = (datasetName, workflow, binSize) => {
    const { data, error, isLoading, mutate } = useSWR(
        getTopCNVarianceUrl(datasetName, workflow, binSize),
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
