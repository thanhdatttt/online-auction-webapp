const AuctionCard = ({ auction }) => {
  return (
    <div className="bg-[#2a2a35] rounded-lg overflow-hidden shadow-lg relative group">
      {auction.isNew && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          NEW
        </span>
      )}
      <div className="relative">
        <img src={auction.product.images[0].url} alt={auction.title} className="w-full h-48 object-cover" />
        <button className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
          {/* <Heart size={16} /> */}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-white text-sm font-medium truncate mb-3">{auction.title}</h3>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>CURRENT BID</span>
          <span>HIGHEST BIDDER</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-yellow-500 mb-3">
          <span>{auction.currentPrice}</span>
          <span>{auction.highestBidder}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-gray-400">
            Posted <br /> {auction.posted}
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1.5 px-4 rounded focus:outline-none transition-colors">
            Bid
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-700 pt-3">
          <div className="flex items-center">
            {/* <Gavel size={14} className="mr-1" /> */}
            {auction.bids}
          </div>
          <div>END IN <span className="text-red-400">{auction.endTime}</span></div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard