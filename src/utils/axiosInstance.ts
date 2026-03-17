import axios from "axios";
import { getToken } from "./auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // App-level JWT for controller [Authorize] attributes
    const appToken = getToken();
    if (appToken) {
      config.headers.Authorization = `Bearer ${appToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized — check app JWT.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;