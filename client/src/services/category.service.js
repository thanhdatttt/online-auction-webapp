import api from "../utils/axios.js";

// get category apis
export const categoryService = {
  getCategories: async () => {
    try {
      const res = await api.get("/guest/categories");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createCategory: async (data) => {
    try{
      const res = await api.post("/admin/categories", {
        ...data
      });
      return res.data;
    } catch (err){
      console.log(err);
      throw err;
    }
  },
  updateCategory: async (id, data) => {
    try{
      const res = await api.put(`/admin/categories/${id}`, {
        ...data
      });
      return res.data;
    } catch (err){
      console.log(err);
      throw err;
    }
  },
};