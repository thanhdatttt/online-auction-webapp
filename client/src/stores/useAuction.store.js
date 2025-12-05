import { create } from "zustand";
import { auctionService } from "../services/auction.service.js";
import { toast } from "sonner";

export const useAuctionStore = create((set, get) => ({
  loading: false,
  auctions: [],

  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  },

  getAuctions: async (pageNumber) => {
    try {
      set({ loading: true });

      const { limit } = get().pagination;
      
      const response = await auctionService.getAuctions({ page: pageNumber, limit });
      set({ 
        auctions: response.auctions, 
        pagination: {
          page: pageNumber,
          limit: limit,
          total: response.total,
          totalPages: Math.ceil(response.total / limit)
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

  nextPage: () => {
    const { page, totalPages } = get().pagination;
    if (page < totalPages) {
      get().fetchProducts(page + 1);
    }
  },

  prevPage: () => {
    const { page } = get().pagination;
    if (page > 1) {
      get().fetchProducts(page - 1);
    }
  }

}));
