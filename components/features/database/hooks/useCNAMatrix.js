import useSWR from "swr"
import { getCNAMatrixUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useCNAMatrix = (datasetName, workflow, binSize) => {
    const { data, error, isLoading, mutate } = useSWR(
        getCNAMatrixUrl(datasetName, workflow, binSize),
        fetcher
    )

    return {
        matrix: data,
        isMatrixLoading: isLoading,
        isMatrixError: error,
        mutate
    }
}
