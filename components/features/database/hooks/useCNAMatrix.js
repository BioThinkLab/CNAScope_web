import useSWR from "swr"
import { getCNAMatrixUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useCNAMatrix = (datasetName, workflow) => {
    const { data, error, isLoading, mutate } = useSWR(
        getCNAMatrixUrl(datasetName, workflow),
        fetcher
    )

    return {
        matrix: data,
        isMatrixLoading: isLoading,
        isMatrixError: error,
        mutate
    }
}
