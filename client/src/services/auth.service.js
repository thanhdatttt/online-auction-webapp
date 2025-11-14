import api from "../utils/axios.js";

// auth apis
export const authService = {
    login: async ({ username, password }) => {
        try {
            const res = await api.post("/auth/login", { username, password });
            return res.data;
        } catch (err) {
            console.log(err);
        }
    },

    logout: async () => {
        try {
            const res = await api.post("/auth/logout", {}, {withCredentials: true});
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
}