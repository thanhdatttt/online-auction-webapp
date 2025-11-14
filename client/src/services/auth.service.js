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
    },

    signup: async (data) => {
        try {
            const res = await api.post("/auth/register", data);
            return res.data;
        } catch (err) {
            throw err;
        }
    },
    verify_otp: async (data) => {
        try {
            const res = await api.post("/auth/verify-otp", data);
            return res.data;
        } catch (err) {
            throw err;
        }
    },
    create_user: async (data, registerToken) => {
        try {
            const res = await api.post("/auth/create-user", data, {
                headers: {
                    Authorization: `Bearer ${registerToken}`,
                },
            });
        } catch (err) {
            throw err;
        }
    },
    continue_with_google: async () => {
        try {
            const res = await api.get("/auth/google/url");
            const { url } = res.data;
            console.log(url);
        if (url) {
            window.location.href = url;
        } else {
            throw new Error("Something went wrong. Can not get Google URL.");
        }
        } catch (err) {
            throw err;
        }
    },
};
