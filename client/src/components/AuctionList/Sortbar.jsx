import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuctionStore } from '../../stores/useAuction.store';
import { useSearchParams } from 'react-router';

const Sortbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sortBy = useAuctionStore((state) => state.sortBy);
  const [searchParams, setSearchParams] = useSearchParams();
    
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Ending Soon', value: 'ending_soon' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
  ];
  const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Newest';  
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    setIsOpen(false);
    searchParams.set("sortBy", value);
    setSearchParams(searchParams);
  };

  return (
    <div className="relative font-lora z-20 min-w-40">
      <button
        onClick={toggleDropdown}
        className="bg-[#f5eee3] border-2 border-[#2a2a35] rounded-xl px-4 py-2 flex items-center justify-between w-full font-semibold text-[#2a2a35] focus:outline-none hover:bg-[#e4dccf] transition-colors"
      >
        <span className="truncate mr-2">{currentLabel}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-[#f5eee3] border-2 border-[#2a2a35] rounded-xl overflow-hidden shadow-lg z-30">
          <ul className="flex flex-col">
            {sortOptions.map((option) => {
              const isActive = sortBy === option.value || (!sortBy && option.value === 'newest');
              return (
                <li key={option.value}>
                  <button
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left px-4 py-3 font-semibold transition-colors text-sm ${
                      sortBy === option.value
                        ? 'bg-[#d9822b] text-[#f5eee3]' // Active State
                        : 'text-[#2a2a35] hover:bg-[#e4dccf]'
                    }`}
                  >
                    {option.label}
                  </button>
                </li> 
              )
            })}
          </ul>
        </div>
      )}
    </div>
);
}

export default Sortbar