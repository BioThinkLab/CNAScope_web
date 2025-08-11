import useSWR from "swr"
import { getCNANewickUrl } from "@/lib/api/dataset"
import { fetcher } from "@/lib/api/fetcher"

export const useCNANewick = (datasetName, workflow) => {
    const { data, error, isLoading, mutate } = useSWR(
        getCNANewickUrl(datasetName, workflow),
        fetcher
    )

    return {
        newick: data,
        isNewickLoading: isLoading,
        isNewickError: error,
        mutate
    }
}
