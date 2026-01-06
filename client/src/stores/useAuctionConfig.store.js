import { create } from "zustand";
import { toast } from "sonner";
import { auctionConfigService } from "../services/auctionconfig.service.js";
export const useAuctionConfigStore = create((set, get) => ({
  loading: false,
  auctionConfig: {},

  getAuctionConfig: async () => {
    try {
      set({ loading: true });

      const response = await auctionConfigService.getAuctionConfig();
      set({
        auctionConfig: response.data,
      });
    } catch (err) {
      console.log(err);
      toast.error("Load auction config failed, please try again");
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  msToMinutes: (ms) => {
    return ms / 60000;
  },
}));
