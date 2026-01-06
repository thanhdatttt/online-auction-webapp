import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuctionStore } from "../../../stores/useAuction.store";
import { Link } from "react-router";

const FeedbackCard = ({ item }) => {
  const { formatTime } = useAuctionStore();
  return (
    <div className="flex flex-col sm:flex-row border border-black bg-light w-full h-auto sm:h-40">
      <div className="w-full sm:w-64 h-40 sm:h-full flex-shrink-0 border-b sm:border-b-0 sm:border-r border-black relative">
        <Link to={`/auctions/${item.auctionId._id}`}>
          <img
            src={item.auctionId?.product?.images[0]?.url}
            alt={item.auctionId?.product?.name}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <Link to={`/auctions/${item.auctionId._id}`}>
            <h3 className="font-normal text-[#1a1a1a] text-sm line-clamp-1">
              {item.auctionId?.product?.name}
            </h3>
          </Link>

          <div className="flex gap-3 text-[#1a1a1a] items-center">
            <ThumbsUp
              size={18}
              strokeWidth={1.5}
              className={`${
                item.rateType === "uprate"
                  ? "text-green-600 fill-green-600"
                  : "text-black"
              }`}
            />
            <span className="text-gray-300 text-lg font-light">/</span>
            <ThumbsDown
              size={18}
              strokeWidth={1.5}
              className={`${
                item.rateType === "downrate"
                  ? "text-red-500 fill-red-500"
                  : "text-black"
              }`}
            />
          </div>
        </div>

        {/* Meta Info */}
        <p className="text-[11px] text-gray-500 mt-1 mb-2 font-medium">
          From:{" "}
          <span className="text-gray-700">
            {item.raterId.firstName + " " + item.raterId.lastName}
          </span>{" "}
          - Rated on {formatTime(item.createdAt)}
        </p>

        {/* Review Text */}
        <p className="text-xs text-[#333] leading-relaxed line-clamp-3">
          "{item.reviewContent}"
        </p>
      </div>
    </div>
  );
};

export default FeedbackCard;
