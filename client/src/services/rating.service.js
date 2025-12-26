import api from "../utils/axios.js";

export const ratingService = {
  submitRating: async (data) => {
    try {
      const res = await api.post("/ratings", data);
      return res;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
};
