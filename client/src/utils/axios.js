import axios from "axios";
import { useAuthStore } from "../stores/useAuth.store.js";

// set up for calling apis
const api = axios.create({
  // get the url with correct mode
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const {accessToken} = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }
);

export default api;
