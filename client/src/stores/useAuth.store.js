import { create } from "zustand";
import { authService } from "../services/auth.service.js";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  registerToken: null,
  registeredEmail: null,
  user: null,
  loading: false,

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user: user }),

  // call apis
  // auth apis
  login: async ({ username, password, captcha }) => {
    try {
      // loading user login
      set({ loading: true });

      // call login api
      const data = await authService.login({ username, password, captcha });
      set({ accessToken: data.accessToken });

      console.log(data.accessToken);

      // fetch user
      await get().fetchMe();
      toast.success("Login successfully");
    } catch (err) {
      console.log(err);
      toast.error("Login failed, please try again");
      throw err;
    } finally {
      // finish loading user login
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      get().clearState();
      const data = await authService.logout();
      toast.success("Logout successfully");
    } catch (err) {
      console.log(err);
      toast.error("Logout failed, please try again");
      throw err;
    }
  },

  signup: async ({ email, captcha }) => {
    try {
      // loading sending register request

      set({ loading: true });
      // store it for step 2
      set({ registeredEmail: email });
      // call register api
      const data = await authService.signup({ email, captcha });
    } catch (err) {
      console.log(err);
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
      console.log(err);
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
      toast.success("Registered successfully");
    } catch (err) {
      console.log(err);
      toast.error("Register failed, try again!");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  continue_with_google: async () => {
    try {
      set({ loading: true });
      await authService.continue_with_google();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });

      const user = await authService.fetchMe();
      set({ user: user });
      console.log(user);
    } catch (err) {
      set({ user: null, accessToken: null });
      console.log(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe } = get();
      const accessToken = await authService.refresh();

      set({ accessToken: accessToken });

      if (!user) {
        await fetchMe();
      }
    } catch (err) {
      get().clearState();
      console.log(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  forgot_password: async ({ email }) => {
    try {
      set({ loading: true });
      const data = await authService.forgot_password({ email });
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  reset_password: async ({ newPassword }) => {
    try {
      set({loading: true});

      const res = await authService.reset_password({newPassword});
      toast.success("Reset password successfully");
    } catch (err) {
      console.log(err);
      toast.error("Reset password failed");
      throw err;
    } finally {
      set({loading: false});
    }
  }
}));
