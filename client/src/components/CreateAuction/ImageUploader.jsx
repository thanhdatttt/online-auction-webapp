import React, { useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';

const ImageUploader = ({ images, onChange, error, productNameProps, productNameError }) => {

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview objects
    const newImages = files.map(file => ({
      fileObject: file,
      previewUrl: URL.createObjectURL(file),
    }));

    // Update React Hook Form state
    onChange([...images, ...newImages]);
  };

  const removeImage = (indexToRemove) => {
    // Cleanup URL
    URL.revokeObjectURL(images[indexToRemove].previewUrl);
    // Update Form
    const updated = images.filter((_, index) => index !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="bg-[#EBE5D9] p-6 rounded-lg shadow-sm border border-[#dcd6ca]">
      
      {/* Product Name (Registered Input) */}
      <div className="mb-6">
        <label className="block text-lg font-bold text-gray-800 mb-2">Product Name</label>
        <input 
          type="text" 
          {...productNameProps} // Spreads name, onBlur, onChange, ref
          className={`w-full p-3 rounded border focus:outline-none bg-[#FDFBF7]
            ${productNameError ? 'border-red-500' : 'border-gray-300 focus:border-[#EA8C1E]'}`}
        />
        {productNameError && <p className="text-red-500 text-sm mt-1">{productNameError}</p>}
      </div>

      {/* Image Area */}
      <div>
        <label className="block text-lg font-bold text-gray-800 mb-3">Upload Photos</label>
        
        {/* Error Message for Images */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex gap-4 mb-4 overflow-x-auto pb-2 min-h-[120px]">
           {images.length > 0 ? (
             images.map((img, idx) => (
               <div key={idx} className="relative w-32 h-24 shrink-0 bg-gray-200 rounded border border-gray-300 overflow-hidden">
                 <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover"/>
                 <button 
                   type="button" // Important: prevents submitting the form
                   onClick={() => removeImage(idx)}
                   className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-0.5 text-red-500"
                 >
                   <X size={14} />
                 </button>
               </div>
             ))
           ) : (
             <div className="w-full h-24 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded bg-[#FDFBF7]">
               No images selected
             </div>
           )}
        </div>

        <div className="flex gap-4">
          <label className="flex-1 cursor-pointer bg-[#2D2D35] hover:bg-[#3E3E48] text-white py-3 rounded text-center font-semibold shadow-sm transition flex items-center justify-center gap-2">
            <UploadCloud size={18} />
            Upload
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <button 
            type="button"
            onClick={() => onChange([])}
            className="flex-1 bg-[#FDFBF7] border border-gray-300 py-3 rounded font-semibold shadow-sm"
          >
            Remove All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;