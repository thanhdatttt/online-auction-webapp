import api from "../utils/axios.js";
import { uploadService } from "./upload.service.js";

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

  changeAvatar: async (data) => {
    try {
      const res = await api.patch("/users/me/avatar", data);
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
  },

  requestUpdateRole: async () => {
    try {
      const res = await api.post("/users/me/requestRole");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};