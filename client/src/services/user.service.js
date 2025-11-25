import api from "../utils/axios.js";

// get user info api
export const userService =  {
  changeEmail: async (data) => {
    try {
      const res = await api.patch("/users/me/email", data);
      return res.data;
      } catch (err) {
        console.log(err);
    }
  },

  changeAddress: async (data) => {
    try {
      const res = await api.patch("/users/me/address", data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },

  changeName: async (data) => {
    try {
      const res = await api.patch("/users/me/fullname", data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
};