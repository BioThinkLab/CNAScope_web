import useSWR from "swr"
import { getSpatialTopCNVarianceUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"
import * as d3 from "d3"

export const useSpatialTopCNVariance = (datasetName, workflow, binSize) => {
    const { data, error, isLoading, mutate } = useSWR(
        getSpatialTopCNVarianceUrl(datasetName, workflow, binSize),
        fetcher
    )

    let spatialTopCNVariances = []
    if (data) {
        try {
            spatialTopCNVariances = d3.csvParse(data, d3.autoType)
        } catch (err) {
            console.error('Error parsing CSV:', err)
        }
    }

    return {
        spatialTopCNVariances,
        isSpatialTopCNVariancesLoading: isLoading,
        isSpatialTopCNVariancesError: error,
        mutate
    }
}
