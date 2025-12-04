import React from "react";

const ProductCard = () => {
  return (
    <div className="relative group rounded-md overflow-hidden cursor-pointer shadow-md aspect-[4/5]">
      <img
        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        alt="Similar"
      />
      {/* OVERLAY CONTENT */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3 text-white">
        <h4 className="font-bold text-sm leading-tight mb-1">
          Fuji GS645 Professional Wide 60
        </h4>
        <p className="text-xs text-gray-300 mb-2">Current Bid</p>
        <p className="text-[#EFA00B] font-bold text-lg mb-2">10.350.000 VND</p>

        <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2">
          <span>3.000.000</span>
          <span>End in: 11/10/2025</span>
        </div>
        <button className="w-full bg-[#EFA00B] text-black font-bold py-1.5 rounded text-sm hover:bg-yellow-500">
          Bid
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
