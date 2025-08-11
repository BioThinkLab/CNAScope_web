import api from "@/lib/api/axios"

export const fetcher = async (url) => {
    try {
        const res = await api.get(url)

        return res.data
    } catch (error) {
        const err = new Error('An error occurred while fetching the data.')
        err.info = error.response?.data || {}
        err.status = error.response?.status
        throw err
    }
}
