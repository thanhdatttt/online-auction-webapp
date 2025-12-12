import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useAuctionStore } from "../../stores/useAuction.store";
const Product = ({ p, postedOn }) => {
  const [curImg, setCurImg] = useState(0);
  const updateCurImg = (value) => {
    setCurImg(value);
  };

  const { formatTime } = useAuctionStore();

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
        <button className="border border-black rounded-full p-2 hover:bg-gray-100">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* GALLERY SECTION */}
      <div className="mt-6 flex gap-4 h-[350px] md:h-[450px]">
        {/* MAIN IMAGE */}
        <div className="flex-1 bg-gray-200 rounded-sm overflow-hidden border border-gray-300 relative group">
          <img
            src={p.images[curImg].url}
            className="w-full h-full object-cover"
            alt="Main item"
          />
          {/* Image overlay gradient if needed */}
        </div>

        {/* THUMBNAILS (Vertical Stack) */}
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
          {Array.from(
            {
              length: Math.min(3, p.images.length - Math.floor(curImg / 3) * 3),
            },
            (_, i) => (
              <div
                className={
                  curImg === Math.floor(curImg / 3) * 3 + i
                    ? "w-full h-20 rounded-sm overflow-hidden cursor-pointer scale-110"
                    : "w-full h-20 rounded-sm overflow-hidden cursor-pointer hover:scale-105"
                }
                key={i}
              >
                <img
                  src={p.images[Math.floor(curImg / 3) * 3 + i].url}
                  className={
                    Math.floor(curImg / 3) * 3 + i === curImg
                      ? "w-full h-full object-cover opacity-100 outline-none rounded-sm"
                      : "w-full h-full object-cover opacity-60 rounded-sm hover:opacity-80"
                  }
                  alt="Can not load the image."
                  onClick={() => updateCurImg(Math.floor(curImg / 3) * 3 + i)}
                />
              </div>
            )
          )}
          <div className="h-15">
            {curImg < p.images.length - 1 && (
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

      {/* PRODUCT DETAILS TEXT */}
      <div className="mt-8 border-b border-gray-300 pb-8">
        <h3 className="text-lg font-bold mb-3">Product Details</h3>
        <div className="text-sm md:text-base text-gray-700 space-y-2 leading-relaxed font-sans border-t border-gray-300 pt-3">
          <p>{p.description}</p>
        </div>
      </div>
    </>
  );
};

export default Product;
