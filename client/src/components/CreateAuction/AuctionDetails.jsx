import { Controller } from 'react-hook-form';
import DateTimeInput from './DateTimeInput';

const AuctionDetails = ({ register, control, errors }) => {

  const inputs = [
    { name: 'startPrice', label: 'Starting Price' },
    { name: 'buyNowPrice', label: 'Buy Now Price (Optional)' },
    { name: 'gapPrice', label: 'Bid Increment' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#EBE5D9] p-6 rounded-lg shadow-sm border border-[#dcd6ca]">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Auction Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {inputs.map((field) => (
            <div key={field.name} className="col-span-1">
              <label className="block text-sm font-semibold mb-1 text-gray-700">{field.label}</label>
              <div className="relative">
                <input 
                  type="text"
                  {...register(field.name)}
                  className={`w-full p-2.5 pr-12 rounded border focus:outline-none bg-[#FDFBF7]
                    ${errors[field.name] ? 'border-red-500' : 'border-gray-300 focus:border-[#EA8C1E]'}`}
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm font-medium">VND</span>
              </div>
              {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>}
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
            <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => onChange(!value)}>
              <h3 className="text-xl font-bold text-gray-800">Automatic Extension</h3>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-[#EA8C1E]' : 'bg-gray-400'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          )}
        />
        <p className="text-sm text-gray-500 mt-2">
           If a new bid is placed within 5 minutes, the auction automatically extends another 10 minutes.
        </p>
      </div>
    </div>
  );
};

export default AuctionDetails;