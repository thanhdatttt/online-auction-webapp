import axios from "axios";
import { useAuthStore } from "../stores/useAuth.store.js";

// set up for calling apis
const api = axios.create({
  // get the url with correct mode
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// attach token to header
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// auto call refresh api when token is expired
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originRequest = error.config;

    // apis that does not need to check token is expired
    if (
      originRequest.url.includes("/auth/login") ||
      originRequest.url.includes("/auth/register") ||
      originRequest.url.includes("/auth/create-user") ||
      originRequest.url.includes("/auth/verify-otp") ||
      originRequest.url.includes("/auth/refresh") ||
      originRequest.url.includes("/auth/google/url") ||
      originRequest.url.includes("/auth/google/callback")
    ) {
      return Promise.reject(error);
    }

    originRequest._retry = originRequest._retry | 0;

    // apis need to check token is expired or invalid
    if (error.response.status === 401 && !originRequest._retry < 4) {
      originRequest._retry += 1;
      try {
        // get token by refresh and store in state
        const res = await api.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);

        // attach new accesstoken to request header
        originRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // continue that request
        return api(originRequest);
      } catch (err) {
        console.log(err);
        useAuthStore.getState().clearState();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
