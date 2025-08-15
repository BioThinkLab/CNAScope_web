import axios from "axios"
import { API_BASE } from "@/lib/api/config"

const api = axios.create({
    baseURL: API_BASE,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api
