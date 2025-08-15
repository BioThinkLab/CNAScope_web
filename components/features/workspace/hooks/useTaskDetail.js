import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { buildQueryTaskUrl } from "@/lib/api/analysis"

export const useTaskDetail = (taskId) => {
    const { data, error, isLoading, mutate } = useSWR(
        buildQueryTaskUrl(taskId),
        fetcher
    )

    return {
        task: data,
        isTaskLoading: isLoading,
        isTaskError: error,
        mutate
    }
}
