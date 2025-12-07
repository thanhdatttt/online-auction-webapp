import { create } from "zustand";
import { watchListService } from "../services/watchlist.service.js";
import { toast } from "sonner";

export const useWatchListStore = create((set, get) => ({
  items: [],
  loading: false,
  page: 1,
  limit: 9,
  total: 0,

  fetchFavorites: async(page=1, limit=9) => {
    try {
      set({loading: true});
      const res = await watchListService.fetchFavorites(page, limit);

      set({
        items: res.auctions,
        page: res.page,
        limit: res.limit,
        total: res.total,
      })
    } catch(err) {
        console.log(err);
        toast.error("Failed to load watch list");
        throw err;
    } finally {
        set({loading: false});
    }
  },

  addToFavorite: async(auctionId) => {
    try {
      set({loading: true});
      console.log(typeof(auctionId));
      const res = await watchListService.addToFavorite(auctionId);

      set({
        items: res.auctions,
        total: res.auctions.length,
      });
      toast.success("Added to watch list")
    } catch(err) {
      console.log(err);
      toast.error("Add to watch list failed");
      throw err;
    } finally {
      set({loading: false});
    }
  },

  removeFromFavorite: async(auctionId) => {
    try {
      set({loading: true});
      const res = await watchListService.removeFromFavorite(auctionId);

      set({
        items: res.auctions,
        total: res.auctions.length,
      });
      toast.success("Removed from watch list");
    } catch(err) {
      console.log(err);
      toast.error("Remove failed");
      throw err;
    } finally {
      set({loading: false});
    }
  },

  checkFavorite: async(auctionId) => {
    try {
      const res = await watchListService.checkFavorite(auctionId);

      return res.isFavorite;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  // clear store when logout
  clearState: () => {
    set({
      items: [],
      page: 1,
      total: 0,
    });
  },
}));