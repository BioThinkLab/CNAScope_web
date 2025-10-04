import useSWR from "swr"
import { getConsensusGene } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useConsensusGene = (datasetName) => {
    const { data, error, isLoading, mutate } = useSWR(
        getConsensusGene(datasetName),
        fetcher
    )

    return {
        consensusGene: data,
        isConsensusGeneLoading: isLoading,
        isConsensusGeneError: error,
        mutate
    }
}
