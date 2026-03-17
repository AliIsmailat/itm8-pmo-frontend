import axios from "axios";
import { getToken } from "./auth";
import { msalInstance, loginRequest } from "./msalConfig";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Acquire Entra ID id_token silently to pass EasyAuth gate.
    // EasyAuth accepts id_tokens when aud matches the registered client ID.
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      try {
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        if (response.idToken) {
          config.headers.Authorization = `Bearer ${response.idToken}`;
        }
      } catch {
        // Silent acquisition failed — MsalAuthGuard will handle re-auth
      }
    }

    // App-level JWT for controller [Authorize] attributes.
    // Sent as separate header so it doesn't overwrite the Entra ID token.
    const appToken = getToken();
    if (appToken) {
      config.headers["X-App-Token"] = appToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized — check Entra ID or app JWT.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;