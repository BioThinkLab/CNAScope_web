import useSWR from "swr"
import { getConsensusFocalGene } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useConsensusFocalGene = (datasetName) => {
    const { data, error, isLoading, mutate } = useSWR(
        getConsensusFocalGene(datasetName),
        fetcher
    )

    return {
        consensusFocalGene: data,
        isConsensusFocalGeneLoading: isLoading,
        isConsensusFocalGeneError: error,
        mutate
    }
}
