import { Controller } from "react-hook-form";
import DateTimeInput from "./DateTimeInput";
import { useEffect, useMemo } from "react";
import { useCategoryStore } from "../../stores/useCategory.store";
import { ChevronDown } from "lucide-react";
import { useAuctionConfigStore } from "../../stores/useAuctionConfig.store";

const AuctionDetails = ({ register, control, errors, watch, setValue }) => {
  const inputs = [
    { name: "startPrice", label: "Starting Price" },
    { name: "buyNowPrice", label: "Buy Now Price (Optional)" },
    { name: "gapPrice", label: "Bid Increment" },
  ];

  const categories = useCategoryStore((state) => state.categories);
  const auctionConfig = useAuctionConfigStore((state) => state.auctionConfig);
  const { getCategories } = useCategoryStore();
  const { getAuctionConfig, msToMinutes } = useAuctionConfigStore();

  useEffect(() => {
    getCategories();
    getAuctionConfig();
  }, []);

  const selectedCategoryId = watch("categoryId");

  const availableSubCategories = useMemo(() => {
    if (!selectedCategoryId) return [];

    const category = categories.find((c) => c._id === selectedCategoryId);

    return category?.children || [];
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    setValue("subCategoryId", "");
  }, [selectedCategoryId, setValue]);

  console.log(categories);

  return (
    <div className="space-y-6">
      <div className="bg-[#EBE5D9] p-6 rounded-lg shadow-sm border border-[#dcd6ca]">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Auction Information
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Main Category */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Category
            </label>
            <div className="relative">
              <select
                {...register("categoryId")} // This saves the ID (e.g., "cat_1")
                className={`w-full p-2.5 pr-8 rounded border appearance-none focus:outline-none bg-[#FDFBF7]
                  ${
                    errors.categoryId
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#EA8C1E]"
                  }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3 text-gray-500 pointer-events-none"
              />
            </div>
            {errors.categoryId && (
              <p className="text-red-600 text-xs mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Sub Category (Populated from 'children') */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Subcategory
            </label>
            <div className="relative">
              <select
                {...register("subCategoryId")} // This saves the ID (e.g., "sub_1")
                disabled={!selectedCategoryId}
                className={`w-full p-2.5 pr-8 rounded border appearance-none focus:outline-none 
                  ${
                    !selectedCategoryId
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-[#FDFBF7]"
                  }
                  ${
                    errors.subCategoryId
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#EA8C1E]"
                  }`}
              >
                <option value="">Select Subcategory</option>
                {availableSubCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3 text-gray-500 pointer-events-none"
              />
            </div>
            {errors.subCategoryId && (
              <p className="text-red-600 text-xs mt-1">
                {errors.subCategoryId.message}
              </p>
            )}
          </div>

          {inputs.map((field) => (
            <div key={field.name} className="col-span-1">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register(field.name)}
                  className={`w-full p-2.5 pr-12 rounded border focus:outline-none bg-[#FDFBF7]
                    ${
                      errors[field.name]
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#EA8C1E]"
                    }`}
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm font-medium">
                  VND
                </span>
              </div>
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name].message}
                </p>
              )}
            </div>
          ))}

          <DateTimeInput
            control={control} // Pass control, not register
            name="endTime"
            label="End Time"
            error={errors.endTime}
          />
        </div>
      </div>

      {/* Auto Extension (Controlled Toggle) */}
      <div className="bg-[#EBE5D9] p-6 rounded-lg shadow-sm border border-[#dcd6ca]">
        <Controller
          name="autoExtension"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div
              className="flex items-center gap-3 mb-2 cursor-pointer"
              onClick={() => onChange(!value)}
            >
              <h3 className="text-xl font-bold text-gray-800">
                Automatic Extension
              </h3>
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  value ? "bg-[#EA8C1E]" : "bg-gray-400"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    value ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
          )}
        />
        <p className="text-sm text-gray-500 mt-2">
          If a new bid is placed within{" "}
          {msToMinutes(auctionConfig.extendThreshold)} minutes, the auction
          automatically extends another{" "}
          {msToMinutes(auctionConfig.extendDuration)} minutes.
        </p>
      </div>

      {/* --- [MỚI] Allow Unrated Bidder Section --- */}
      <div className="bg-[#EBE5D9] p-6 rounded-lg shadow-sm border border-[#dcd6ca]">
        <Controller
          name="allowUnratedBidder"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div
              className="flex items-center gap-3 mb-2 cursor-pointer"
              onClick={() => onChange(!value)}
            >
              <h3 className="text-xl font-bold text-gray-800">
                Allow Unrated Bidders
              </h3>
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  value ? "bg-[#EA8C1E]" : "bg-gray-400"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    value ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
          )}
        />
        <p className="text-sm text-gray-500 mt-2">
          If enabled, bidders with no ratings (new users) will be allowed to
          place bids on this auction.
        </p>
      </div>
    </div>
  );
};

export default AuctionDetails;
