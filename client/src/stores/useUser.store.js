import { create } from "zustand";
import { useAuthStore } from "./useAuth.store.js"; 
import { uploadService } from "../services/upload.service.js";
import { userService } from "../services/user.service.js";
import { toast } from "sonner";

export const useUserStore = create((set, get) => ({
  loading: false,

  changeEmail: async ({newEmail, password}) => {
    try {
      set({loading: true});

      const res = await userService.changeEmail({newEmail, password});

      // update email to user state
      const { user, setUser } = useAuthStore.getState();
      setUser({ ...user, email: res.email });
      toast.success("Change email successfully");
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
      toast.success("Change address successfully");
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({loading: false});
    }
  },

  changeAvatar: async (file) => {
    try {
      set({loading: true});

      const signData = await uploadService.getAvatarSignature();
      const newAvatar_url = await uploadService.uploadImage(file, signData);
      const res = await userService.changeAvatar({newAvatar_url});

      const {user, setUser} = useAuthStore.getState();
      setUser({...user, avatar_url: res.newAvatar_url});
      toast.success("Change avatar successfully");
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
      toast.success("Change name successfully");
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
      toast.success("Change birth successfully");
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
      toast.success("Change password successfully");
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({loading: false});
    }
  },

  requestUpdateRole: async () => {
    try {
      set({loading: true});

      const res = await userService.requestUpdateRole();

      toast.success("Request role update successfully");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Request failed");
      throw err;
    } finally {
      set({loading: false});
    }
  }
}));