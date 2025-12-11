import api from "../utils/axios.js";

// active bids and won auctions
export const listService = {
  getActiveBids: async(page=1, limit=9) => {
    try {
      const res = await api.get("/users/me/active-bids", {
        params: {page, limit},
      });

      return res.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
  },

  getWonAuctions: async(page=1, limit=9) => {
    try {
      const res = await api.get("/users/me/won-auctions", {
        params: {page, limit},
      })

      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};