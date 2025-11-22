import api from "../utils/axios.js";

// auth apis
export const authService = {
  login: async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  logout: async () => {
    try {
      const res = await api.post("/auth/logout", {}, { withCredentials: true });
      return res.data;
    } catch (err) {
      throw err;
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
      return res.data;
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
