import { create } from "zustand";
import { auctionService } from "../services/auction.service";
import { toast } from "sonner";
import { intervalToDuration, isPast } from "date-fns";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

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
    totalPages: 0,
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
    }));
  },

  getAuctions: async (pageNumber) => {
    try {
      set({ loading: true });

      const { limit } = get().pagination;
      const { searchQuery, sortBy, categoryId } = get();
      const response = await auctionService.getAuctions({
        page: pageNumber,
        limit,
        sort: sortBy,
        search: searchQuery,
        categoryId: categoryId,
      });
      console.log(response);
      set({
        auctions: response.auctions,
        pagination: {
          page: pageNumber,
          limit: limit,
          total: response.pagination.totalItems,
          totalPages: Math.ceil(response.pagination.totalItems / limit),
        },
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

  maskFirstHalf: function (str) {
    if (!str) return "";
    const len = str.length;
    const half = Math.floor(len / 2);
    const masked = "*".repeat(half) + str.slice(half);
    return masked;
  },

  formatTime: (rawTime) => {
    try {
      const interval = 30;

      dayjs.extend(relativeTime);
      dayjs.locale("en-custom", {
        ...dayjs.Ls.en,
        relativeTime: {
          future: "%s later",
          past: "%s ago",
          s: "a few seconds",
          m: "a minute",
          mm: "%d minutes",
          h: "an hour",
          hh: "%d hours",
          d: "a day",
          dd: "%d days",
          M: "a month",
          MM: "%d months",
          y: "a year",
          yy: "%d years",
        },
      });

      dayjs.locale("en-custom");

      if (
        dayjs(rawTime).isAfter(dayjs().subtract(interval, "day")) &&
        dayjs(rawTime).isBefore(dayjs().add(interval, "day"))
      )
        return dayjs(rawTime).fromNow();
      else return dayjs(rawTime).format("DD/MM/YYYY HH:mm:ss");
    } catch (err) {
      throw err;
    }
  },
  formatPrice: (rawPrice) => {
    try {
      return new Intl.NumberFormat("de-DE").format(rawPrice) + " VND";
    } catch (err) {
      throw err;
    }
  },
  placeBid: async (bidMaxAmount, auctionId) => {
    try {
      const data = await auctionService.placeBid(bidMaxAmount, auctionId);
      return data;
    } catch (err) {
      throw err;
    }
  },
  validateBid: (
    bidMaxAmount,
    userId,
    newWinnerId,
    newHighestPrice,
    newCurrentPrice,
    auction
  ) => {
    if (!bidMaxAmount) return `Please enter your bid amount.`;
    if (bidMaxAmount < 0)
      return `Place bid failed. Bid amount must be a positive value.`;
    if (!newCurrentPrice || bidMaxAmount < newCurrentPrice + auction.gapPrice) {
      const minValidBid = newCurrentPrice + auction.gapPrice;
      return `Place bid failed. Min valid bid amount must be ${get().formatPrice(
        minValidBid
      )}`;
    }
    if (auction.buyNowPrice && bidMaxAmount >= auction.buyNowPrice)
      return `The amount you entered meets or exceeds the buyout price. To secure this item immediately, please click "Buyout".`;

    if (
      userId === newWinnerId &&
      newHighestPrice &&
      bidMaxAmount <= newHighestPrice
    )
      return `You are the current winner. Your new bid must exceed your previous maximum bid of ${get().formatPrice(
        newHighestPrice
      )}`;

    if (bidMaxAmount % auction.gapPrice !== 0)
      return `Place bid failed. Bid amount must be a multiple of the gap price.`;

    const basePrice = auction.currentPrice
      ? auction.currentPrice
      : auction.startPrice;

    if (basePrice && bidMaxAmount > basePrice + auction.gapPrice * 30) {
      return `Place bid failed. Your bid max amount greater than the current bid and 30 times gap price.`;
    }

    return null;
  },
  handlePlaceBid: async (
    bidMaxAmount,
    userId,
    newWinnerId,
    newHighestPrice,
    newCurrentPrice,
    auction
  ) => {
    const validateMsg = get().validateBid(
      bidMaxAmount,
      userId,
      newWinnerId,
      newHighestPrice,
      newCurrentPrice,
      auction
    );
    console.log(validateMsg);
    if (validateMsg) {
      toast.error(validateMsg);
      return;
    }
    const toastId = toast.loading("Placing bid...");
    try {
      const data = await get().placeBid(bidMaxAmount, auction._id);
      toast.success("Place bid successfully.", { id: toastId });
    } catch (err) {
      const errBackend = err.response?.data?.message || err.message;
      if (errBackend) toast.error(errBackend, { id: toastId });
    }
  },
  buyNow: async (auctionId) => {
    try {
      const data = await auctionService.buyNow(auctionId);
      return data;
    } catch (err) {
      throw err;
    }
  },
  handleBuyNow: async (auctionId) => {
    const toastId = toast.loading("Trying to buyout....");
    try {
      const data = await get().buyNow(auctionId);
      toast.success("Buy now successfully.", { id: toastId });
    } catch (err) {
      const errBackend = err.response?.data?.message || err.message;
      if (errBackend) toast.error(errBackend, { id: toastId });
    }
  },
  question: async (auctionId, question) => {
    try {
      const data = await auctionService.question(auctionId, question);
      return data;
    } catch (err) {
      throw err;
    }
  },
  validateQuestion: (question) => {
    if (!question || question.length === 0) return `Please enter the question.`;
    if (question.length > 150)
      return `The question must not exceed 150 characters.`;
  },
  handleQuestion: async (auctionId, question) => {
    const validateMsg = get().validateQuestion(question);

    if (validateMsg) {
      toast.error(validateMsg);
      return;
    }

    const toastId = toast.loading("Sending a question...");
    try {
      const data = await get().question(auctionId, question);
      toast.success("Send a question successfully.", { id: toastId });
      return data;
    } catch (err) {
      const errBackend = err.response?.data?.message || err.message;
      if (errBackend) toast.error(errBackend, { id: toastId });
    }
  },
  answer: async (auctionId, questionId, answer) => {
    try {
      const data = await auctionService.answer(auctionId, questionId, answer);
      return data;
    } catch (err) {
      throw err;
    }
  },
  validateAnswer: (answer) => {
    if (!answer || answer.length === 0) return `Please enter the answer.`;
    if (answer.length > 150)
      return `The answer must not exceed 150 characters.`;
  },
  handleAnswer: async (auctionId, questionId, answer) => {
    const validateMsg = get().validateAnswer(answer);

    if (validateMsg) {
      toast.error(validateMsg);
      return;
    }

    const toastId = toast.loading("Sending a answer...");
    try {
      const data = await get().answer(auctionId, questionId, answer);
      toast.success("Send a answer successfully.", { id: toastId });
      return data;
    } catch (err) {
      const errBackend = err.response?.data?.message || err.message;
      if (errBackend) toast.error(errBackend, { id: toastId });
    }
  },
  reject: async (auctionId, bidderId) => {
    try {
      const data = await auctionService.reject(auctionId, bidderId);
      return data;
    } catch (err) {
      throw err;
    }
  },
  handleRejectBidder: async (auctionId, bidderId) => {
    const toastId = toast.loading("Rejecting bidder...");
    try {
      const data = await get().reject(auctionId, bidderId);
      toast.success("Rejected bidder successfully.", { id: toastId });
      return data;
    } catch (err) {
      const errBackend = err.response?.data?.message || err.message;
      if (errBackend) toast.error(errBackend, { id: toastId });
    }
  },
}));
