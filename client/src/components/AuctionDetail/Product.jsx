import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { useAuctionStore } from "../../stores/useAuction.store";
import { useWatchListStore } from "../../stores/useWatchList.store";
import { useAuthStore } from "../../stores/useAuth.store";
import { toast } from "sonner";
import DOMPurify from "dompurify";

const Product = ({ p, postedOn, auctionId }) => {
  const [curImg, setCurImg] = useState(0);
  const updateCurImg = (value) => {
    setCurImg(value);
  };

  const { formatTime } = useAuctionStore();

  // --- LOGIC HEART ---
  const { user } = useAuthStore();
  const { favoriteIds, addToFavorite, removeFromFavorite, loading } =
    useWatchListStore();

  const isFavorited = favoriteIds.has(auctionId);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to add to watch list");
      return;
    }
    if (loading) return;

    if (isFavorited) {
      await removeFromFavorite(auctionId);
    } else {
      await addToFavorite(auctionId);
    }
  };
  // -------------------

  if (!p) return null;

  const cleanHTML = DOMPurify.sanitize(p.description);

  return (
    <>
      {/* TITLE HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
            {p.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Posted on {formatTime(postedOn)}
          </p>
        </div>

        {/* BUTTON HEART - STYLE UPDATED TO MATCH AUCTION CARD */}
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className={`
              p-2.5 rounded-full border transition-all duration-300 shadow-sm active:scale-90
              ${
                isFavorited
                  ? "bg-rose-500/10 border-rose-500/50 text-rose-500" // Style Active giống AuctionCard (Rose)
                  : "bg-light border-gray-500 text-gray-400 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-600" // Style Inactive cho nền trắng
              }
            `}
        >
          <Heart
            size={24} // Tăng nhẹ size vì đây là trang chi tiết
            className={`transition-all duration-300 ${
              isFavorited ? "fill-current" : ""
            }`}
          />
        </button>
      </div>

      {/* GALLERY SECTION */}
      <div className="mt-6 flex gap-4 h-[350px] md:h-[450px]">
        {/* MAIN IMAGE */}
        <div className="flex-1 bg-light rounded-sm overflow-hidden border border-gray-300 relative group">
          {p.images && p.images.length > 0 && (
            <img
              src={p.images[curImg]?.url}
              className="w-full h-full object-contain"
              alt="Main item"
            />
          )}
        </div>

        {/* THUMBNAILS */}
        <div className="flex flex-col gap-3 w-24 h-full justify-center">
          <div className="h-15">
            {curImg > 0 && (
              <div
                className="flex items-center justify-center w-full h-15 cursor-pointer hover:bg-decor select-none"
                onClick={() => updateCurImg(curImg - 1)}
              >
                <ChevronUp size={25} />
              </div>
            )}
          </div>
          {p.images &&
            Array.from(
              {
                length: Math.min(
                  3,
                  p.images.length - Math.floor(curImg / 3) * 3
                ),
              },
              (_, i) => (
                <div
                  className={
                    curImg === Math.floor(curImg / 3) * 3 + i
                      ? "w-full h-20 rounded-sm overflow-hidden cursor-pointer scale-110 border-2 border-black"
                      : "w-full h-20 rounded-sm overflow-hidden cursor-pointer hover:scale-105"
                  }
                  key={i}
                >
                  <img
                    src={p.images[Math.floor(curImg / 3) * 3 + i]?.url}
                    className={
                      Math.floor(curImg / 3) * 3 + i === curImg
                        ? "w-full h-full object-cover opacity-100 outline-none rounded-sm"
                        : "w-full h-full object-cover opacity-60 rounded-sm hover:opacity-80"
                    }
                    alt="Thumbnail"
                    onClick={() => updateCurImg(Math.floor(curImg / 3) * 3 + i)}
                  />
                </div>
              )
            )}
          <div className="h-15">
            {p.images && curImg < p.images.length - 1 && (
              <div
                className="flex items-center justify-center w-full h-15 cursor-pointer hover:bg-decor select-none"
                onClick={() => updateCurImg(curImg + 1)}
              >
                <ChevronDown size={25} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-8 border-b border-gray-300 pb-8 w-full overflow-hidden">
        <h3 className="text-lg font-bold mb-3">Product Details</h3>
        <div className="text-sm md:text-base text-gray-700 space-y-2 leading-relaxed font-sans border-t border-gray-300 pt-3">
          <div
            className="prose prose-sm max-w-none text-gray-700 font-lato break-words [&_img]:max-w-full [&_img]:h-auto [&_iframe]:max-w-full"
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
          />
        </div>
      </div>
    </>
  );
};

export default Product;
