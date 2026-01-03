import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react';
import ImageUploader from './ImageUploader';
import AuctionDetails from './AuctionDetails';
import ProductDescription from './ProductDescription';
import { useAuctionStore } from '../../stores/useAuction.store';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod";

const parseCurrency = (val) => {
  if (typeof val === 'number') return val;
  return Number(val.replace(/\./g, ''));
};

const auctionSchema = z.object({
  productName: z.string().min(5, "Product name must be at least 5 characters"),
  
  // Description can be HTML string
  description: z.string().min(20, "Please provide a detailed description"),
  
  // Custom validation for file array
  images: z
    .array(z.any())
    .min(3, "You must upload at least three image")
    .max(5, "You can only upload up to 5 images"),

  categoryId: z.string().min(1, "Please select a category"),
  subCategoryId: z.string().min(1, "Please select a subcategory"),

  startPrice: z.string().refine((val) => parseCurrency(val) > 0, {
    message: "Starting price must be greater than 0",
  }),

  buyNowPrice: z.string().optional(),

  gapPrice: z.string().refine((val) => parseCurrency(val) > 0, {
    message: "Bid increment must be valid",
  }),

  endTime: z.date({
    required_error: "Please select an end date",
    invalid_type_error: "That's not a valid date!",
  }).refine((date) => date > new Date(), {
    message: "End time must be in the future",
  }),

  autoExtension: z.boolean().default(true),
}).refine((data) => {
  // complex cross-field validation
  if (!data.buyNowPrice) return true;
  return parseCurrency(data.buyNowPrice) > parseCurrency(data.startPrice);
}, {
  message: "Buy Now price must be higher than Starting price",
  path: ["buyNowPrice"],
});

const CreateAuction = () => {
  const navigate = useNavigate();
  const { createAuction, loading } = useAuctionStore();

  // 1. Setup React Hook Form
  const { 
    register, 
    handleSubmit, 
    control, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      productName: '',
      categoryId: '',
      subCategoryId: '',
      startPrice: '',
      buyNowPrice: '',
      gapPrice: '',
      endTime: '',
      autoExtension: true,
      images: [],
      description: ''
    }
  });

  const onSubmit = async (data) => {
    console.log("Submitted");
    const rawFiles = data.images.map(img => img.fileObject);

    const cleanData = {
      ...data,
    };

    const success = await createAuction(cleanData, rawFiles);
    
    if (success) {
      alert("Auction Created Successfully!");
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen font-lato text-gray-800">

      <main className="max-w-6xl mx-auto px-4 py-8 pt-24">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1E1E24]">Create New Auction</h2>
            <Link to="/home" className="flex items-center text-gray-500 text-sm mt-1 hover:text-[#EA8C1E] transition">
              <ChevronLeft size={16} /> Back
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* --- Image & Name Section --- */}
            {/* We use Controller for Images because it's a complex custom interaction */}
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <ImageUploader 
                  // pass current value (array of images)
                  images={field.value} 
                  // pass update function (React Hook Form's onChange)
                  onChange={field.onChange}
                  error={errors.images?.message}
                  
                  // Product Name is simple, so we just pass the 'register' prop
                  productNameProps={register('productName')}
                  productNameError={errors.productName?.message}
                />
              )}
            />

            {/* --- Details Section --- */}
            <AuctionDetails 
              register={register} 
              control={control} // Needed for the Switch/Toggle if we use Controller
              errors={errors}
              watch={watch}
              setValue={setValue}
            />

          </div>

          {/* --- Description Section --- */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <ProductDescription 
                description={field.value} 
                setDescription={field.onChange}
                error={errors.description?.message}
              />
            )}
          />

          <div className="mt-8 flex justify-center">
            <button 
              type="submit"
              disabled={loading}
              className={`bg-[#EA8C1E] text-white text-lg font-bold py-3 px-16 rounded shadow-md transition 
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d67e15] hover:-translate-y-0.5'}`}
            >
              {loading ? 'Validating & Creating...' : 'Create Auction'}
            </button>
          </div>
          
        </form>
      </main>
    </div>
  );
};

export default CreateAuction;