import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL

export const api = axios.create({
    baseURL: backendUrl,
    withCredentials:true
})