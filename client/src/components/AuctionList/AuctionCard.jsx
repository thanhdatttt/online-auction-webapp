import useTimeStore from '../../stores/useTime.store';
import { getFormattedTimeDiff, getRelativeTime } from '../../services/time.service';

const AuctionCard = ({ auction }) => {
  const now = useTimeStore((state) => state.now);

  const endTime = getFormattedTimeDiff(auction.endTime, now);
  const startTime = getRelativeTime(auction.startTime, now);

  return (
    <div className="bg-dark rounded-lg overflow-hidden shadow-[0_4px_4px_#2a2a35] relative group">
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
        <h3 className="text-white text-lg font-extrabold font-lato truncate mb-3">{auction.product.name}</h3>
        <div className="flex justify-between font-semibold font-lato text-[11px] text-[#d1ae8d] mb-1">
          <span>CURRENT BID</span>
          <span>HIGHEST BIDDER</span>
        </div>
        <div className="flex justify-between text-base font-semibold font-lato text-yellow-500 mb-3">
          <span>{auction.currentPrice}</span>
          <span>{auction.winnerId?.username}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[13px] font-lato font-semibold text-white">
            Posted <br /><span className="text-base text-lighter"> {startTime}</span>
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1.5 px-4 rounded focus:outline-none transition-colors">
            Bid
          </button>
        </div>
        <div className="flex items-center justify-between text-[13px] text-white border-t border-gray-700 pt-3">
          <div className="flex items-center">
            {/* <Gavel size={14} className="mr-1" /> */}
            {auction.bids}
          </div>
          {endTime == -1 && (<div>ENDED</div>)}
          {!endTime && (<div>ENDING</div>)}
          {endTime != -1 && endTime && (<div >END IN <span className="text-red-400 text-base">{endTime}</span></div>)}
          
        </div>
      </div>
    </div>
  );
};

export default AuctionCard