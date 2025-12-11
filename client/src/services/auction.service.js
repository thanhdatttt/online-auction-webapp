import api from "../utils/axios.js";

export const auctionService = {
  placeBid: async (bidMaxAmount, auctionId) => {
    try {
      const res = await api.post(`/auctions/${auctionId}/bid`, {
        bidMaxAmount,
      });

      return res.data;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  buyNow: async (auctionId) => {
    try {
      const res = await api.post(`/auctions/${auctionId}/buyout`);
      return res.data;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  question: async (auctionId, question) => {
    try {
      const res = await api.post(`/auctions/${auctionId}/comment`, {
        question,
      });
      return res;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  answer: async (auctionId, questionId, answer) => {
    try {
      const res = await api.post(
        `/auctions/${auctionId}/comment/${questionId}`,
        {
          answer,
        }
      );
      return res;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  reject: async (auctionId, bidderId) => {
    try {
      const res = await api.post(`/auctions/${auctionId}/reject-bidder`, {
        bidderId,
      });
      return res;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  getAuctions: async ({ page = 1, limit = 9, sort, search, categoryId }) => {
    try {
      const res = await api.get("/guest/auctions", {
        params: {page, limit, sort, search, categoryId}
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
