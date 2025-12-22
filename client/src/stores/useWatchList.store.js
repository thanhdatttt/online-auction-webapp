import { create } from "zustand";
import { watchListService } from "../services/watchlist.service.js";
import { toast } from "sonner";

export const useWatchListStore = create((set, get) => ({
  items: [],
  favoriteIds: new Set(),
  loading: false,
  page: 1,
  limit: 9,
  total: 0,

  // search and sort filter
  searchQuery: "",
  sortBy: "newest",

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSortBy: (sortOption) => {
    set({ sortBy: sortOption });
  },

  fetchFavoriteIds: async () => {
    try {
      set({loading: true});

      const res = await watchListService.fetchFavoriteIds();  
      set({
        favoriteIds: new Set(res.favoriteIds),
      });
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      set({loading: false});
    }
  },

  fetchFavorites: async(page=1, limit=9) => {
    try {
      set({loading: true});

      const {searchQuery, sortBy} = get();
      const res = await watchListService.fetchFavorites(page, limit, searchQuery, sortBy);

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
      const res = await watchListService.addToFavorite(auctionId);

      set((state) => {
        const updated = new Set(state.favoriteIds);
        updated.add(auctionId);
        return {
          items: res.auctions,
          total: res.auctions.length,
          favoriteIds: updated,
        }
      });
      toast.success("Added to watch list");
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

      set((state) => {
        const updated = new Set(state.favoriteIds);
        updated.delete(auctionId);
        return {
          items: res.auctions,
          total: res.auctions.length,
          favoriteIds: updated,
        }
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

  // clear store when logout
  clearState: () => {
    set({
      items: [],
      favoriteIds: new Set(),
      page: 1,
      limit: 9,
      total: 0,
    });
  },
}));