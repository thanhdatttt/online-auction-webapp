import {create} from "zustand";
import { authService } from "../services/auth.service.js";

export const useAuthStore = create((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    login: async (username, password) => {
        try {
            // loading user login
            set({loading: true});

            // call login api
            const data = await authService.login({username, password});
            set({accessToken: data.accessToken});
        } catch (err) {
            throw err;
        } finally {
            // finish loading user login
            set({loading: false});
        }
    }
}));