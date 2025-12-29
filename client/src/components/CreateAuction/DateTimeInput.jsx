import React from 'react';
import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

// Custom CSS to make react-datepicker match your Tailwind theme
// You can put this in your index.css or a style tag
const customDatePickerStyles = `
  .react-datepicker-wrapper { width: 100%; }
  .react-datepicker__input-container { width: 100%; }
  .react-datepicker { border: 1px solid #dcd6ca; font-family: sans-serif; }
  .react-datepicker__header { bg-[#EBE5D9]; border-bottom: 1px solid #dcd6ca; }
  .react-datepicker__time-container { border-left: 1px solid #dcd6ca; }
`;

const DateTimeInput = ({ control, name, label, error }) => {
  return (
    <div className="col-span-1">
      <style>{customDatePickerStyles}</style>
      <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
      
      <div className="relative">
        {/* The Icon */}
        <div className="absolute left-3 top-2.5 text-gray-500 z-10 pointer-events-none">
          <Calendar size={18} />
        </div>

        {/* The Controller Wrapper */}
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              selected={value ? new Date(value) : null}
              onChange={(date) => onChange(date)} // Sends JS Date Object to Hook Form
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MM/dd/yyyy - HH:mm"
              placeholderText="Select end date & time"
              className={`w-full p-2.5 pl-10 rounded border focus:outline-none bg-[#FDFBF7] transition-colors cursor-pointer
                ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EA8C1E]'}`}
              
              // Helper to prevent picking past dates
              minDate={new Date()}
            />
          )}
        />
      </div>
      
      {error && <p className="text-red-600 text-xs mt-1 font-medium">{error.message}</p>}
    </div>
  );
};

export default DateTimeInput;