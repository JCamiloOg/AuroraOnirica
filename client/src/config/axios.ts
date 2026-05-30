import axios from "axios";
import { API_URL } from "./config";
import i18n from "./i18n";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    config.headers["accept-language"] = i18n.language;
    return config;
});