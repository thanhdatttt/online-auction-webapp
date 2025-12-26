import React from "react";
import { useAuctionStore } from "../../../stores/useAuction.store";
import { ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react"; // Import thêm icon AlertCircle nếu cần
import { useState } from "react";
import { useRatingStore } from "../../../stores/useRating.store";
import { toast } from "sonner";
import { Link } from "react-router";

const AuctionCreatedCard = ({ item, rating }) => {
  const { formatTime } = useAuctionStore();

  const [rateType, setRateType] = useState(rating ? rating.rateType : null);
  const [reviewContent, setReviewContent] = useState(
    rating ? rating.reviewContent : "" // Sửa null thành string rỗng để tránh lỗi uncontrolled input
  );
  const [isRated, setIsRated] = useState(Boolean(rating));
  const { handleSubmitRating, validateRating } = useRatingStore();
  const [showModal, setShowModal] = useState(false);

  // 1. Logic kiểm tra trạng thái
  const isEnded = new Date(item.endTime) < new Date();
  const hasWinner = Boolean(item.winnerId);

  // Chỉ cho phép đánh giá khi: Đã kết thúc VÀ Có người thắng VÀ Chưa đánh giá
  const allowRating = isEnded && hasWinner;

  const handleRateType = (value) => {
    if (isRated || !allowRating) return; // Chặn click nếu chưa được phép

    if (!rateType) setRateType(value);
    else {
      if (value === rateType) setRateType(null);
      else setRateType(value);
    }
  };

  const handleShowModal = (value) => {
    if (!allowRating) return; // Chặn mở modal

    const validateMsg = validateRating({ reviewContent, rateType });
    if (validateMsg) {
      toast.error(validateMsg);
      return;
    }
    setShowModal(value);
  };

  const confirm = (data) => {
    handleSubmitRating(data);
    setShowModal(false);
    setIsRated(true);
  };

  return (
    <>
      {/* --- MODAL SECTION (Giữ nguyên, chỉ hiển thị khi showModal = true) --- */}
      {showModal && (
        <div>
          <div
            id="popup-modal"
            tabIndex={-1}
            className="flex justify-center items-center rounded-md bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-4xl">
              <div className="relative bg-neutral-primary-soft p-4 md:p-6">
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="absolute top-3 end-2.5 text-body bg-transparent hover:bg-neutral-tertiary hover:bg-decor rounded-2xl hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <svg
                    className="mx-auto mb-4 text-fg-disabled w-12 h-12"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <h3 className="mb-6 text-body leading-relaxed">
                    {rateType === "uprate" ? (
                      <>
                        Do you want to give a positive rating to the winner{" "}
                        <span className="font-semibold text-primary">
                          {item.sellerId?.firstName} {item.sellerId?.lastName}
                        </span>
                        ?
                      </>
                    ) : (
                      <>
                        Do you want to give a negative rating to the winner{" "}
                        <span className="font-semibold text-red-600">
                          {item.sellerId?.firstName} {item.sellerId?.lastName}
                        </span>
                        ?
                        <br />
                        <span className="mt-2 block text-sm font-medium text-red-600">
                          This action may affect the winner’s ability to
                          participate in future auctions.
                        </span>
                      </>
                    )}
                  </h3>

                  <div className="flex items-center space-x-4 justify-center">
                    <button
                      onClick={() =>
                        confirm({
                          ratedUserId: item.winnerId._id,
                          auctionId: item._id,
                          reviewContent: reviewContent,
                          rateType: rateType,
                        })
                      }
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-400 hover:text-black rounded-2xl box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      type="button"
                      className="text-gray-300 bg-dark hover:bg-dark/80 hover:text-black rounded-2xl shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CARD --- */}
      <div
        key={item._id}
        className="border border-black bg-light flex h-48 group hover:shadow-md transition-shadow"
      >
        {/* Image Section */}
        <div className="w-64 h-full bg-gray-200 flex-shrink-0 relative overflow-hidden border-r border-transparent">
          <Link to={`/auctions/${item._id}`}>
            <img
              src={item.product.images[0].url}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          {/* Header: Name + Icons */}
          <div className="flex justify-between items-start">
            <div className="pr-4">
              <Link to={`/auctions/${item._id}`}>
                <h3 className="text-lg font-medium text-gray-800 leading-tight line-clamp-2">
                  {item.product.name}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                End On: {formatTime(item.endTime)}
              </p>
              {/* Hiển thị Winner hoặc trạng thái */}
              <p className="text-xs font-medium mt-1">
                Winner:{" "}
                {hasWinner ? (
                  <span className="text-primary">
                    {item.winnerId?.firstName + " " + item.winnerId?.lastName}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">
                    {isEnded ? "No Winner" : "Determining..."}
                  </span>
                )}
              </p>
            </div>

            {/* Icons */}
            <div
              className={`flex gap-3 items-center flex-shrink-0 select-none ${
                !allowRating ? "opacity-40 grayscale" : ""
              }`}
            >
              <ThumbsUp
                className={`w-6 h-6 transition-colors ${
                  !allowRating || isRated
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } ${
                  (rating && rating.rateType === "uprate") ||
                  (rateType && rateType === "uprate")
                    ? "fill-green-700 text-green-700"
                    : `text-black${
                        !isRated && allowRating ? " hover:text-green-700" : ""
                      }`
                }`}
                strokeWidth={1.5}
                onClick={() => handleRateType("uprate")}
              />
              <span className="text-xl font-light text-black">/</span>
              <ThumbsDown
                className={`w-6 h-6 transition-colors ${
                  !allowRating || isRated
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } ${
                  (rating && rating.rateType === "downrate") ||
                  (rateType && rateType === "downrate")
                    ? "fill-red-700 text-red-700"
                    : `text-black${
                        !isRated && allowRating ? " hover:text-red-700" : ""
                      }`
                }`}
                strokeWidth={1.5}
                onClick={() => handleRateType("downrate")}
              />
            </div>
          </div>

          {/* Body: Input or Review Text */}
          <div className="mt-2 w-full">
            <div className="flex flex-col items-end gap-2 w-full">
              {/* Logic hiển thị Textarea */}
              <textarea
                placeholder={
                  !isEnded
                    ? "Available after auction ends..."
                    : !hasWinner
                    ? "No winner to rate."
                    : "Give your thoughts here..."
                }
                className={`w-full bg-transparent text-gray-600 text-sm italic outline-none resize-none h-12 placeholder:text-gray-400 focus:placeholder:text-gray-300 ${
                  !allowRating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onChange={(e) => setReviewContent(e.target.value)}
                value={reviewContent || ""}
                disabled={isRated || !allowRating}
              ></textarea>

              <button
                className={
                  isRated
                    ? "bg-grayinput text-gray-600 px-6 py-1.5 text-sm rounded-md font-medium transition-colors cursor-default"
                    : allowRating
                    ? "bg-primary hover:bg-accent hover:text-dark text-white px-6 py-1.5 text-sm rounded-md font-medium transition-colors"
                    : "bg-grayinput text-gray-600 px-6 py-1.5 text-sm rounded-md font-medium cursor-not-allowed"
                }
                onClick={() => handleShowModal(true)}
                disabled={isRated || !allowRating}
              >
                {isRated
                  ? "Rated"
                  : !isEnded
                  ? "Ongoing"
                  : !hasWinner
                  ? "No Winner"
                  : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionCreatedCard;
