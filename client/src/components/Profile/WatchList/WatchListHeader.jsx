import { FiSearch } from "react-icons/fi";
import { useSearchParams } from 'react-router';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from "react";

const sortOptions = [
  { label: "Ending Soon", value: "ending_soon" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const WatchListHeader = () => {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "newest";
  const [search, setSearch] = useState(searchParams.get("searchQuery") || "");

  const currentLabel =
    sortOptions.find(o => o.value === sortBy)?.label || "Sort By";

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        searchParams.set("searchQuery", search);
      } else {
        searchParams.delete("searchQuery");
      }
      searchParams.set("page", 1);
      setSearchParams(searchParams);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (value) => {
    setOpen(false);
    searchParams.set("sortBy", value);
    setSearchParams(searchParams);
  };

  return (
    <div className="flex items-center justify-between my-4 gap-4">
      {/* search bar */}
      <div className="flex-1 relative w-80">
        <input
          type="text"
          placeholder="Search auctions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 pl-10 border rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-primary"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-500" size={20} />
      </div>

      {/* sort bar */}
      <div className="relative font-lora z-20 min-w-40">
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#f5eee3] border-2 border-[#2a2a35] rounded-xl px-4 py-2 flex items-center justify-between w-full font-semibold text-[#2a2a35] focus:outline-none hover:bg-[#e4dccf] transition-colors"
        >
          <span className="truncate mr-2">{currentLabel}</span>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-2 w-full bg-[#f5eee3] border-2 border-[#2a2a35] rounded-xl overflow-hidden shadow-lg z-30">
            <ul className="flex flex-col">
              {sortOptions.map((option) => (
                <li key={option.value}>
                  <button
                    onClick={() => handleSort(option.value)}
                    className={`w-full text-left px-4 py-3 font-semibold transition-colors text-sm ${
                      sortBy === option.value
                        ? 'bg-[#d9822b] text-[#f5eee3]' // Active State
                        : 'text-[#2a2a35] hover:bg-[#e4dccf]'
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchListHeader;