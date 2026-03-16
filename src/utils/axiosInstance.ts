import axios from "axios";
import { getToken, clearToken } from "./auth";

const api = axios.create({
  baseURL: "https://itm8-pmo-system-api-dtb5fxa6cxbmagez.swedencentral-01.azurewebsites.net/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;