import React from "react";
import {Heart} from "lucide-react";

const ProductCard = () => {
  return (
    <div className="relative group rounded-md overflow-hidden cursor-pointer shadow-md aspect-4/5">
      <img
        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        alt="Similar"
      />
      <button className="absolute top-3 left-3 p-2 bg-gray-600 bg-opacity-50 hover:bg-opacity-75 rounded-full transition">
        <Heart size={20} className={"fill-red-500 text-red-500"} />
      </button>
      {/* OVERLAY CONTENT */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3 text-white">
        <h4 className="font-bold text-lg leading-tight mb-1">
          Fuji GS645 Professional Wide 60
        </h4>
        <p className="text-md text-gray-300 mb-2">Current Bid</p>
        <p className="text-[#EFA00B] font-bold text-xl mb-2">10.350.000 VND</p>

        <div className="flex justify-between items-center text-lg text-gray-400 mb-2">
          <span>3.000.000</span>
          <span>End in: <span className="text-red-500 font-bold">11/10/2025</span> 
          </span>
        </div>
        <button className="w-full bg-[#EFA00B] text-black font-bold py-1.5 rounded text-sm hover:bg-yellow-500">
          Bid
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
