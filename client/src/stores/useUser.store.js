import { create } from "zustand";
import { useAuthStore } from "./useAuth.store.js"; 
import { userService } from "../services/user.service.js";

export const useUserStore = create((set, get) => ({
  loading: false,

  changeEmail: async ({newEmail, password}) => {
    try {
      set({loading: true});

      const res = await userService.changeEmail({newEmail, password});

      // update email to user state
      const { user, setUser } = useAuthStore.getState();
      setUser({ ...user, email: res.email });
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({loading: false});
    }
  },

  changeAddress: async ({newAddress}) => {
    try {
      set({loading: true});

      const res = await userService.changeAddress({newAddress});
      
      // update address to user state
      const {user, setUser} = useAuthStore.getState();
      setUser({...user, address: res.address});
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({loading: false});
    }
  },

  changeName: async ({newFirstName, newLastName}) => {
    try {
      set({loading: true});

      const res = await userService.changeName({newFirstName, newLastName});

      // update fullname to user state
      const {user, setUser} = useAuthStore.getState();
      setUser({...user, firstName: res.firstName, lastName: res.lastName});
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({loading: false});
    }
  },

  changeBirth: async ({newBirth}) => {
    try {
      set({loading: true});

      const res = await userService.changeBirth({newBirth});

      // update birth date to user state
      const {user, setUser} = useAuthStore.getState();
      setUser({...user, birth: res.birth});
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({loading: false});
    }
  },

  changePassword: async ({oldPassword, newPassword}) => {
    try {
      set({loading: true});

      const res = await userService.changePassword({oldPassword, newPassword});
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({loading: false});
    }
  }
}));