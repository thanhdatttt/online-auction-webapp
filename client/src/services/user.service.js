import api from "../utils/axios.js";

// update user info api
export const userService =  {
  changeEmail: async (data) => {
    try {
      const res = await api.patch("/users/me/email", data);
      return res.data;
      } catch (err) {
        console.log(err);
        throw err;
    }
  },

  changeAddress: async (data) => {
    try {
      const res = await api.patch("/users/me/address", data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  changeName: async (data) => {
    try {
      const res = await api.patch("/users/me/fullname", data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  changeBirth: async (data) => {
    try {
      const res = await api.patch("/users/me/birth", data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  changePassword: async (data) => {
    try {
      const res = await api.patch("/users/me/password", data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};