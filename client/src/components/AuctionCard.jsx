import useTimeStore from '../stores/useTime.store.js';
import { getFormattedTimeDiff, getRelativeTime } from '../services/time.service.js';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatchListStore } from '../stores/useWatchList.store.js';
import { useState } from 'react';

const AuctionCard = ({ auction }) => {
  // time
  const now = useTimeStore((state) => state.now);
  const endTime = getFormattedTimeDiff(auction.endTime, now);
  const startTime = getRelativeTime(auction.startTime, now);

  // favorite
  const [isFavorite, setIsFavorite] = useState(false);
  const {addToFavorite, removeFromFavorite, checkFavorite} = useWatchListStore();

  // check favorite
  const check = async () => {
    try {
      const isFav = await checkFavorite(auction._id);
      setIsFavorite(isFav);
    } catch (err) {
      console.log(err);
    }
  }
  check();

  // add favorite / remove favorite
  const toogleFavorite = async(e) => {
    e.stopPropagation(); 

    if (isFavorite) {
      await removeFromFavorite(auction._id);     
      setIsFavorite(false);
    } else {
      await addToFavorite(auction._id);
      setIsFavorite(true);
    }
  }

  return (
    <div className="bg-dark rounded-lg overflow-hidden shadow-[0_4px_4px_#2a2a35] relative group hover:-translate-y-1">
      {auction.isNew && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          NEW
        </span>
      )}
      <div className="relative">
        <img src={auction.product.images[0].url} alt={auction.title} className="w-full h-48 object-cover" />
        <button
        onClick={toogleFavorite}
        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition z-40 cursor-pointer">
          <Heart size={20}  className={isFavorite
          ? "fill-red-500 text-red-500"
          : "text-white hover:text-red-300"} />
        </button>
      </div>
      <div className="p-4">
        <Link to={`/auctions/${auction._id}`} className="hover:underline">
          <h3 className="text-white text-lg font-extrabold font-lato truncate mb-3">{auction.product.name}</h3>
        </Link>
        <div className="flex justify-between">
          <div className="w-2/3">
            <div className="font-semibold font-lato text-[11px] text-[#d1ae8d] mb-1">
              CURRENT BID
            </div>
            <div className="text-base font-semibold font-lato text-yellow-500 mb-3">
              {auction.currentPrice} VND
            </div>
            <div className="text-[13px] font-lato font-semibold text-white mb-4">
            Posted <br /><span className="text-base text-lighter"> {startTime}</span>
            </div>
          </div>
          <div className="w-1/3">
            <div className="font-semibold font-lato text-[11px] text-[#d1ae8d] mb-1">
              HIGHEST BIDDER
            </div>
            <div className="text-base font-semibold font-lato text-yellow-500 mb-3">
              {auction.winnerId && <span>{auction.winnerId.username}</span>}
              {!auction.winnerId && <span>Be the first!</span>}
            </div>
            <div className="flex items-center">
              <Link to={`/auctions/${auction._id}`} className="bg-yellow-500 w-full text-center hover:bg-yellow-600 text-black font-bold py-1.5 rounded-lg focus:outline-none transition-colors mb-4 mt-2">
                Bid
              </Link>
            </div>
          </div>
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