import { listService } from "../services/list.service.js";
import { create } from "zustand";
import { toast } from "sonner";

export const useActiveBidStore = create((set, get) => ({
  activeBids: [],
  page: 1,
  limit: 9,
  total: 0,
  loading: false,

  fetchActiveBids: async(page=1, limit=9) => {
    try {
      set({loading: true});
      const res = await listService.getActiveBids(page, limit);

      set({
        activeBids: res.auctions,
        page: res.page,
        limit: res.limit,
        total: res.total,
      });

    } catch (err) {
      console.log(err);
      toast.error("Failed to load active bids");
      throw err;
    } finally {
      set({loading: false});
    }
  }
}));