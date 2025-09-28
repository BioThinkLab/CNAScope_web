import useSWR from "swr"
import { getCNAGeneListUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useCNAGeneList = (datasetName, workflow, binSize) => {
    const { data, error, isLoading, mutate } = useSWR(
        getCNAGeneListUrl(datasetName, workflow, binSize),
        fetcher
    )

    return {
        genes: data,
        isGenesLoading: isLoading,
        isGenesError: error,
        mutate
    }
}
