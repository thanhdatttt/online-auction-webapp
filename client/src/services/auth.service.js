import api from "../utils/axios.js";

// get auth apis
export const authService = {
  login: async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  logout: async () => {
    try {
      const res = await api.post("/auth/logout", {}, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  signup: async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  verify_otp: async (data) => {
    try {
      const res = await api.post("/auth/verify-otp", data);
      return res.data;
    } catch (err) {
      console.log(err);
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
      console.log(err);
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
      console.log(err);
      throw err;
    }
  },

  fetchMe: async () => {
    try {
      const res = await api.get("/users/me", {withCredentials: true});
      return res.data.user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  refresh: async () => {
    try {
      // remember to add credential for sending cookies
      const res = await api.post("/auth/refresh");
      return res.data.accessToken;
    } catch(err) {
      console.log(err);
      throw err;
    }
  },

  forgot_password: async (data) => {
    try {
      const res = await api.post("/auth/forgot-password", data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  reset_password: async (data) => {
    try {
      const res = await api.post("/auth/reset-password", data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
