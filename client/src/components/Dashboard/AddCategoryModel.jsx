import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, FolderPlus, UploadCloud, Trash2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useCategoryStore } from '../../stores/useCategory.store';

// 1. Define Validation Schema with Zod
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z.any().refine((files) => files?.length === 1, "Category image is required"),
  parentId: z.string().optional(),
  description: z.string().optional(),
});

export default function AddCategoryModel({ isOpen, onClose, onSave }) {
  // 2. Access Store
  const { getCategories, createCategory } = useCategoryStore();
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
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      image: '',
      parentId: '',
      description: ''
    }
  });

  // Watch image URL for live preview
  const imageFile = watch("image");

  // 4. Fetch categories for dropdown when modal opens
  useEffect(() => {
    if (isOpen) {
      getCategories(); 
      reset(); // Reset form when opening
      setPreviewUrl(null);
    }
  }, [isOpen, getCategories, reset]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
      
      // Cleanup to prevent memory leaks
      return () => URL.revokeObjectURL(newUrl);
    }
  }, [imageFile]);

  const handleRemoveImage = () => {
    setValue('image', null); // Clear form value
    setPreviewUrl(null);     // Clear preview
  };

  // 5. Submit Handler
  const onSubmit = async (data) => {
    try {
      const rawImage = data.image;
    
      const cleanData = {
        ...data,
        parentId: data.parentId === "" ? null : data.parentId
      };

      const success = await createCategory(cleanData, rawImage[0]);
      
      console.log(success);
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-light rounded-xl shadow-2xl w-full max-w-lg border border-[#e0dad0] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e0dad0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center border border-amber-200">
              <FolderPlus className="text-[#EA8C1E]" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2a2a35]">Create New Category</h2>
              <p className="text-sm text-gray-500">Add a new category to your auction</p>
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
              <label className="block text-sm font-semibold text-[#2a2a35]">Category Image <span className="text-red-500">*</span></label>
              
              {!previewUrl ? (
                // 1. UPLOAD STATE
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
                // 2. PREVIEW STATE
                <div className="relative rounded-xl overflow-hidden border border-gray-200 group h-48 w-full">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  
                  {/* Overlay with Remove Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-white text-red-500 px-4 py-2 cursor-pointer rounded-lg font-bold shadow-lg flex items-center gap-2 hover:bg-red-50"
                    >
                      <Trash2 size={18} /> Remove Image
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.image && <p className="text-red-500 text-xs mt-1 font-medium">{errors.image.message}</p>}
            </div>

            {/* Name & Parent Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Category Name */}
              <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#2a2a35]">Name <span className="text-red-500">*</span></label>
                  <input
                      type="text"
                      placeholder="e.g. Vintage Watches"
                      {...register("name")}
                      className={`w-full px-4 py-2.5 bg-white border rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-[#EA8C1E] transition-all
                        ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Parent Category Dropdown */}
              <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#2a2a35]">Parent Category</label>
                  <div className="relative">
                      <select
                          {...register("parentId")}
                          className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-[#EA8C1E] transition-all cursor-pointer"
                      >
                          <option value="">None (Top Level)</option>
                          {categories.map((cat) => (
                              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                                  {cat.name}
                              </option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2a2a35]">Description</label>
              <textarea
                  rows="3"
                  placeholder="Describe this category..."
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
              className="flex-1 px-4 py-2.5 bg-light hover:bg-decor cursor-pointer border border-gray-300 text-gray-700 rounded-lg font-semibold transition-colors shadow-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#EA8C1E] cursor-pointer text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}