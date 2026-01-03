import { create } from "zustand";
import { toast } from "sonner";
import { categoryService } from "../services/category.service.js";

export const useCategoryStore = create((set, get) => ({
  loading: false,
  categories: [],

  getCategories: async () => {
    try {
      set({ loading: true });
      
      const response = await categoryService.getCategories();
      set({ 
        categories: response.categories, 
      });
    } catch (err) {
      console.log(err);
      toast.error("Load categories failed, please try again");
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  createCategories: async (formData, imageFile) => {
    set({ loading: true });
    try {
      const signatureData = await uploadService.getSignature();
      const imageUrl = await Promise.all(uploadService.uploadImage(imageFile, signatureData));

      const payload = {
        ...formData,
        imageUrl,
      };
      
      const response = await categoryService.createCategory(payload);
      set({ 
        categories: response.categories, 
      });
      
    } catch (err) {
      console.log(err);
      toast.error("Load categories failed, please try again");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

}));
