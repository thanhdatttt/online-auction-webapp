import api from "../utils/axios.js";

// get category apis
export const categoryService = {
  getCategories: async () => {
    try {
      const res = await api.get("/categories");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};