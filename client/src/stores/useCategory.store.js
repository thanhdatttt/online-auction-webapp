import { create } from "zustand";
import { toast } from "sonner";
import { categoryService } from "../services/category.service.js";
import { uploadService } from "@/services/upload.service.js";

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
      const signatureData = await uploadService.getCategorySignature();
      const image_url = await uploadService.uploadImage(imageFile, signatureData);

      const payload = {
        ...formData,
        image_url,
      };
      console.log(payload);
      
      const response = await categoryService.createCategory(payload);
      
    } catch (err) {
      console.log(err);
      toast.error("Load categories failed, please try again");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

}));
