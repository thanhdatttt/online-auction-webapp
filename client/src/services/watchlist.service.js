import api from "../utils/axios.js";

// watch list api
export const watchListService = {
  fetchFavoriteIds: async() => {
    try {
      const res = await api.get("/favorites/favoriteIds");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  fetchFavorites: async (page=1, limit=9) => {
    try {
      const res = await api.get("/favorites", {
        params: {page, limit},
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  addToFavorite: async (data) => {
    try {
      const res = await api.post(`/favorites/${data}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  removeFromFavorite: async (data) => {
    try {
      const res = await api.put(`/favorites/${data}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};