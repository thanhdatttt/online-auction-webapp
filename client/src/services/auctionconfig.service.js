import api from "../utils/axios.js";

// get category apis
export const auctionConfigService = {
  getAuctionConfig: async () => {
    try {
      const res = await api.get("/auctions/auction-config");
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};
