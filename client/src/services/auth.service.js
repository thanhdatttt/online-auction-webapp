import api from "../utils/axios.js";

// auth apis
export const authService = {
    login: async ({ username, password }) => {
        try {
            const res = await api.post("/auth/login", { username, password });
            return res.data;
        } catch (err) {
            throw err;
        }
    },
}