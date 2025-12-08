import { create } from "zustand";
import { auctionService } from "../services/auction.service.js";
import { toast } from "sonner";
import { intervalToDuration, isPast } from 'date-fns';

export const useAuctionStore = create((set, get) => ({
  loading: false,
  auctions: [],

  // Filters
  searchQuery: "",
  sortBy: "newest", // Default
  categoryId: null,

  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  },

  // Actions
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSortBy: (sortOption) => {
    set({ sortBy: sortOption });
    // get().getAuctions(); 
  },

  setCategory: (categoryId) => {
    set({ categoryId: categoryId });
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }))
  },

  getAuctions: async (pageNumber) => {
    try {
      set({ loading: true });

      const { limit } = get().pagination;
      const { searchQuery, sortBy, categoryId } = get();
      const response = await auctionService.getAuctions({ page: pageNumber, limit, sort: sortBy, search: searchQuery, categoryId: categoryId });
      console.log(response);
      set({ 
        auctions: response.auctions, 
        pagination: {
          page: pageNumber,
          limit: limit,
          total: response.pagination.totalItems,
          totalPages: Math.ceil(response.pagination.totalItems / limit)
        }
      });
      toast.success("Load auctions successfully");
    } catch (err) {
      console.log(err);
      toast.error("Load auctions failed, please try again");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

}));
