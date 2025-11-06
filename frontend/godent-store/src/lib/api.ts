import axios from "axios";
import { toast } from "react-toastify";

const url = "http://localhost:3000";

const api = axios.create({
  baseURL: url,
  withCredentials: true, // include cookies (refresh token)
});

// attaching access token from localstorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor which handles 401 and refresh token
api.interceptors.response.use(
  (response) => response, // pass through success
  async (error) => {
    const originalRequest = error.config;

    // If request failed with 401 and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const refreshResponse = await axios.post(
          `${url}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Store new token
        localStorage.setItem("token", newAccessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Update original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed:", err);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        toast.error("Session expired. Please log in again.");
        if (window.location.pathname !== "/auth/login") {
          window.location.href = "/auth/login"; // force logout
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
