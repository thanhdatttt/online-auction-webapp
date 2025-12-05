import api from "../utils/axios.js";

// get auction apis
export const auctionService = {
  getAuctions: async ({ page = 1, limit = 9 }) => {
    try {
      const res = await api.get("/auctions/", {
        params: {page, limit}
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};