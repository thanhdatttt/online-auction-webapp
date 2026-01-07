import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Pencil, UploadCloud, Trash2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useCategoryStore } from '../../stores/useCategory.store';

// 1. Validation Schema (Modified for Edit)
// Image is optional here because user might keep the existing one
const editCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  parentId: z.string().optional(),
  description: z.string().optional(),
  image: z.any(),
  image_url: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
  const hasNewFile = data.image && data.image.length > 0;
  const hasExistingUrl = !!data.image_url;

  if (!hasNewFile && !hasExistingUrl) {
    ctx.addIssue({
      message: "An image is required. Please upload one.",
      path: ["image"], // Point error to the file input
    });
    return; // Stop further checks if missing
  }});

export default function EditCategoryModal({ isOpen, onClose, onSave, categoryToEdit }) {
  // 2. Access Store (Assuming you have an update action)
  const { getCategories, updateCategory } = useCategoryStore();
  const categories = useCategoryStore((state) => state.categories);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 3. Setup React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: '',
      parentId: '',
      description: '',
      image: null,
      image_url: ''
    }
  });

  const imageFile = watch("image");

  useEffect(() => {
    if (isOpen && categoryToEdit) {
      getCategories();

      setValue('name', categoryToEdit.name);
      setValue('description', categoryToEdit.description || '');
      setValue('parentId', categoryToEdit.parentId || '');
      
      setValue('image_url', categoryToEdit.image_url);
      setPreviewUrl(categoryToEdit.image_url);
      
      setValue('image', null);
    }
  }, [isOpen, categoryToEdit, getCategories, setValue]);

  // 5. Handle New Image Selection for Preview
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
      
      return () => URL.revokeObjectURL(newUrl);
    }
  }, [imageFile]);

  // Handle removing the image (Clears both new file and preview)
  const handleRemoveImage = () => {
    setValue('image', null);
    setValue('image_url', null);
    setPreviewUrl(null); 
  };

  // 6. Submit Handler
  const onSubmit = async (data) => {
    try {
      const rawImage = data.image;
      
      const cleanData = {
        name: data.name,
        description: data.description,
        parentId: data.parentId === "" ? null : data.parentId,
      };

      // Determine if we are sending a new file or just updating text
      const newFile = rawImage && rawImage.length > 0 ? rawImage[0] : null;
      
      const success = await updateCategory(categoryToEdit._id, cleanData, newFile);
      
      console.log(success);
      
      toast.success("Category updated successfully");
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#FDFBF7] rounded-xl shadow-2xl w-full max-w-lg border border-[#e0dad0] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e0dad0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
              <Pencil className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2a2a35]">Edit Category</h2>
              <p className="text-sm text-gray-500">Update category details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-1 hover:bg-black/5 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
            
            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2a2a35]">Category Image</label>
              
              {!previewUrl ? (
                // UPLOAD STATE (Only shows if they removed the existing image)
                <div className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors
                  ${errors.image ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-[#EA8C1E] hover:bg-amber-50"}`}>
                  
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    {...register("image")}
                  />
                  
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                    <UploadCloud className="text-[#EA8C1E]" size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                </div>
              ) : (
                // PREVIEW STATE (Shows current or new image)
                <div className="relative rounded-xl overflow-hidden border border-gray-200 group h-48 w-full">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  
                  {/* Overlay with Remove Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold cursor-pointer shadow-lg flex items-center gap-2 hover:bg-red-50"
                    >
                      <Trash2 size={18} /> Remove Image
                    </button>
                  </div>
                </div>
              )}

              {errors.image && <p className="text-red-500 text-xs mt-1 font-medium">{errors.image.message}</p>}
            </div>

            {/* Name & Parent Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#2a2a35]">Name <span className="text-red-500">*</span></label>
                  <input
                      type="text"
                      {...register("name")}
                      className={`w-full px-4 py-2.5 bg-white border rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-[#EA8C1E] transition-all
                        ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#2a2a35]">Parent Category</label>
                  <div className="relative">
                      <select
                          {...register("parentId")}
                          className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-[#EA8C1E] transition-all cursor-pointer"
                      >
                          <option value="">None (Top Level)</option>
                          {categories
                            // Prevent selecting itself as its own parent to avoid infinite loops
                            .filter(cat => cat._id !== categoryToEdit?._id) 
                            .map((cat) => (
                              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                                  {cat.name}
                              </option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2a2a35]">Description</label>
              <textarea
                  rows="3"
                  {...register("description")}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-[#EA8C1E] transition-all resize-none"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-[#e0dad0] bg-[#FDFBF7] rounded-b-xl">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 px-4 py-2.5 cursor-pointer bg-light hover:bg-decor border border-gray-300 text-gray-700 rounded-lg font-semibold transition-colors shadow-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 cursor-pointer bg-[#EA8C1E] text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}