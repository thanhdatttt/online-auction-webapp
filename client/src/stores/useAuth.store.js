import {create} from "zustand";
import { authService } from "../services/auth.service.js";

export const useAuthStore = create((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({accessToken: null, user: null, loading: false});
    },

    // call apis
    login: async (username, password) => {
        try {
            // loading user login
            set({loading: true});

            // call login api
            const data = await authService.login({username, password});
            console.log(data);
            set({accessToken: data.accessToken});
        } catch (err) {
            console.log(err);
        } finally {
            // finish loading user login
            set({loading: false});
        }
    },

    logout: async () => {
        try {
            get().clearState();
            const data  = await authService.logout();
            console.log(data);
        } catch(err) {
            console.log(err);
        }
    }
}));