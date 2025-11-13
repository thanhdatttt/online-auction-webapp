import axios from "axios";

// set up for calling apis
const api = axios.create({
    // get the url with correct mode
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5000/api" : "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;