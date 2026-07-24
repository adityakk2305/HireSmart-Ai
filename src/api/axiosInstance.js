import axios from "axios";
import { toast } from "react-toastify";
import {
  clearStoredAuth,
  getStoredAccessToken,
  setStoredAuth
} from "../features/auth/authStorage.js";

const skipRefreshPaths = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/reset-password"
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

let refreshPromise = null;

const shouldSkipRefresh = (config = {}) =>
  config.skipAuthRefresh ||
  skipRefreshPaths.some((path) => {
    const url = config.url || "";
    return url.includes(path);
  });

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest)
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = api
            .post("/auth/refresh-token", undefined, { skipAuthRefresh: true })
            .then((response) => response.data.data)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const refreshed = await refreshPromise;
        setStoredAuth(refreshed);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearStoredAuth();
        window.dispatchEvent(new Event("hiresmart:auth-expired"));
        return Promise.reject(refreshError);
      }
    }

    const message =
      error.response?.data?.message || error.message || "Unable to complete the request.";

    if (!shouldSkipRefresh(originalRequest) && !toast.isActive(message)) {
      toast.error(message, { toastId: message });
    }

    return Promise.reject(error);
  }
);

export default api;
