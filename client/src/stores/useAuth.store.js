import { create } from "zustand";
import { authService } from "../services/auth.service.js";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  registerToken: null,
  registeredEmail: null,
  user: null,
  loading: false,

  login: async (username, password) => {
    try {
      // loading user login
      set({ loading: true });

      // call login api
      const data = await authService.login({ username, password });
      set({ accessToken: data.accessToken });
      set({ user: data.user });
    } catch (err) {
      throw err;
    } finally {
      // finish loading user login
      set({ loading: false });
    }
  },

  signup: async (email) => {
    try {
      // loading sending register request
      set({ loading: true });
      // store it for step 2
      set({ registeredEmail: email });
      // call register api
      const data = await authService.signup({ email });
    } catch (err) {
      throw err;
    } finally {
      // finish loading user login
      set({ loading: false });
    }
  },
  verify_otp: async (otp) => {
    try {
      set({ loading: true });

      const { registeredEmail } = get();

      if (!registeredEmail)
        throw new Error("Something went wrong. Your email is missing.");
      const data = await authService.verify_otp({
        email: registeredEmail,
        otp,
      });
      // store for step 3
      set({ registerToken: data.token });
    } catch (err) {
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  create_user: async (username, password, firstName, lastName, address) => {
    try {
      set({ loading: true });
      const { registerToken } = get();

      if (!registerToken)
        throw new Error(
          "Something went wrong. Your register token is missing."
        );
      const data = await authService.create_user(
        {
          username,
          password,
          firstName,
          lastName,
          address,
        },
        registerToken
      );
      set({
        accessToken: data.accessToken,
        user: data.user,
        registerToken: null,
        registeredEmail: null,
      });
    } catch (err) {
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  continue_with_google: async () => {
    try {
      await authService.continue_with_google();
    } catch (err) {
    } finally {
      set({ loading: false });
    }
  },
}));
