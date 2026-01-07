import useTimeStore from "../stores/useTime.store.js";
import {
  getFormattedTimeDiff,
  getRelativeTime,
  getRelativeTimeNoFormat,
} from "../services/time.service.js";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWatchListStore } from "../stores/useWatchList.store.js";
import { useAuctionStore } from "../stores/useAuction.store.js";
import { useAuthStore } from "../stores/useAuth.store.js";
import { useAuctionConfigStore } from "@/stores/useAuctionConfig.store.js";

const AuctionCard = ({ auction }) => {
  // navigate
  const navigate = useNavigate();
  // time
  const now = useTimeStore((state) => state.now);
  const endTime = getFormattedTimeDiff(auction.endTime, now);
  const startTime = getRelativeTime(auction.startTime, now);

  const newProductTime =
    useAuctionConfigStore((state) => state.auctionConfig.newProductTime) / 1000;
  const isNew =
    getRelativeTimeNoFormat(auction.startTime, now) <= newProductTime;

  // favorite
  const favoriteIds = useWatchListStore((state) => state.favoriteIds);
  const { addToFavorite, removeFromFavorite } = useWatchListStore();
  const isFavorite = favoriteIds.has(auction._id);

  const { formatPrice, maskFirstHalf, formatCompactNumber } = useAuctionStore();

  const user = useAuthStore((state) => state.user);
  const isGuest = user === null;
  const isWinner = !isGuest ? user?._id === auction.winnerId : false;

  console.log(isWinner);

  // add favorite / remove favorite
  const toogleFavorite = async (e) => {
    e.stopPropagation();

    if (isFavorite) {
      await removeFromFavorite(auction._id);
    } else {
      await addToFavorite(auction._id);
    }
  };

  return (
    <div className="group bg-slate-900 rounded-4xl overflow-hidden shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/5 relative">
      {/* Top Badges */}
      {endTime != -1 && endTime && isNew && (
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
          <div className="pointer-events-auto">
            <span className="bg-amber-500/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              NEW
            </span>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={auction.product.images[0].url}
          alt={auction.product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
        />
        <div
          onClick={() => navigate(`/auctions/${auction._id}`)}
          className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 cursor-pointer"
        />

        {/* Favorite Button */}
        <button
          onClick={toogleFavorite}
          className={`absolute top-6 right-6 p-2.5 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer border active:scale-90 shadow-xl
            ${
              isFavorite
                ? "bg-rose-500/20 border-rose-500/50 text-rose-500 opacity-100"
                : "bg-black/40 border-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60"
            }`}
        >
          <Heart size={20} className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <Link to={`/auctions/${auction._id}`}>
          <h3 className="text-white font-serif font-bold text-2xl truncate mb-4 group-hover:text-primary transition-colors cursor-pointer">
            {auction.product.name}
          </h3>
        </Link>

        <div className="flex gap-6 mb-6">
          {/* Column 1: Bid Info */}
          <div className="w-1/2 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
                CURRENT BID
              </p>
              <p className="text-2xl font-bold text-white tracking-tight leading-none">
                {auction.currentPrice ? (
                  <span>
                    {formatCompactNumber(auction.currentPrice) + " VND"}
                  </span>
                ) : (
                  <span>None</span>
                )}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
                POSTED
              </p>
              <p className="text-sm font-medium text-slate-300">{startTime}</p>
            </div>
          </div>

          {/* Column 2: Highest Bidder & Action */}
          <div className="w-1/2 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
                HIGHEST BIDDER
              </p>
              <p className="text-lg font-bold text-slate-100 truncate">
                {isWinner
                  ? "You"
                  : maskFirstHalf(
                      auction.winnerId?.firstName +
                        " " +
                        auction.winnerId?.lastName
                    )}
                {/* {auction.winnerId && <span>{auction.winnerId.username}</span>} */}
                {!auction.winnerId && <span>None</span>}
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate(`/auctions/${auction._id}`)}
                className="w-full bg-primary hover:bg-accent text-slate-950 font-black py-3.5 rounded-2xl transition-all active:scale-[0.98] text-xs uppercase tracking-widest shadow-xl shadow-amber-500/10 cursor-pointer"
              >
                Place Bid
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center text-slate-400">
            <span className="text-xs font-bold tracking-widest uppercase">
              {auction.bidCount} BIDS
            </span>
          </div>

          <div className="flex items-center">
            {endTime == -1 && (
              <span className="text-sm font-bold text-slate-500 mr-2 uppercase tracking-widest">
                ENDED
              </span>
            )}
            {!endTime && (
              <span className="text-sm font-bold text-slate-500 mr-2 uppercase tracking-widest">
                ENDING
              </span>
            )}
            {endTime != -1 && endTime && (
              <div>
                <span className="text-sm font-bold text-slate-500 mr-2 uppercase tracking-widest">
                  ENDS IN
                </span>
                <span
                  className={`text-sm font-black tracking-tight ${
                    endTime === -1 ? "text-slate-500" : "text-primary"
                  }`}
                >
                  {endTime}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
