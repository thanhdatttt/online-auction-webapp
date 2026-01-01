import { ThumbsUp, Crown } from "lucide-react";
import { FaRegCircleUser } from "react-icons/fa6";
import "dayjs/locale/vi";
import { useAuctionStore } from "../../stores/useAuction.store";
import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { useAuthStore } from "../../stores/useAuth.store";
import { useNavigate } from "react-router";
import History from "./History";

const RightSideBar = ({
  auction,
  seller,
  currentPrice,
  dataWinner,
  endTime,
  isAllowed,
}) => {
  const newCurrentPrice = currentPrice
    ? currentPrice
    : auction.currentPrice
    ? auction.currentPrice
    : auction.startPrice;

  const [showModal, setShowModal] = useState(false);

  const [showBidModal, setShowBidModal] = useState(false);

  const newEndTime = endTime;
  const newWinner = dataWinner.winner;
  const newHighestPrice = dataWinner.highestPrice;

  const calculateTimeLeft = () => {
    if (!newEndTime) return null;
    const difference = new Date(newEndTime) - new Date();

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [newEndTime]);

  const isOnGoing = timeLeft !== null;

  const user = useAuthStore((state) => state.user);
  const isGuest = user === null;
  const isSeller = !isGuest ? user?._id === seller?._id : false;
  const isBidder = !isGuest ? user?._id !== seller?._id : false;
  const isWinner = isBidder ? user?._id === newWinner?._id : false;

  const navigate = useNavigate();

  const {
    formatTime,
    formatPrice,
    handlePlaceBid,
    handleBuyNow,
    maskFirstHalf,
  } = useAuctionStore();

  const [bidMaxAmount, setBidMaxAmount] = useState("");

  const handleShowModal = (value) => {
    setShowModal(value);
  };

  const confirm = () => {
    handleBuyNow(auction?._id);
    setShowModal(false);
  };

  const handleShowBidModal = (value) => {
    if (!bidMaxAmount || bidMaxAmount === "") return;
    setShowBidModal(value);
  };

  const confirmPlaceBid = async () => {
    await handlePlaceBid(
      bidMaxAmount,
      user._id,
      newWinner ? newWinner._id : null,
      newHighestPrice,
      newCurrentPrice,
      auction
    );
    setBidMaxAmount("");
    setShowBidModal(false);
  };

  const formatCountdown = (t) => {
    if (!t) return "";
    const { days, hours, minutes, seconds } = t;
    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");

    if (days > 0) return `${days}d ${h}h ${m}m ${s}s`;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="bg-light border border-dark shadow-sm rounded-sm overflow-hidden sticky top-20">
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
                  onClick={() => handleShowModal(false)}
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
                  <h3 className="mb-6 text-body">
                    Are you sure you want to buyout this product?
                  </h3>
                  <div className="flex items-center space-x-4 justify-center">
                    <button
                      onClick={() => confirm()}
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-400 hover:text-black rounded-2xl box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      onClick={() => handleShowModal(false)}
                      type="button"
                      className="text-gray-300 bg-dark hover:bg-dark/80 hover:text-black rounded-2xl hover:bg-neutral-tertiary-medium hover:text-heading shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
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
      {showBidModal && (
        <div>
          <div
            id="bid-popup-modal"
            tabIndex={-1}
            className="flex justify-center items-center rounded-md bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-4xl">
              <div className="relative bg-neutral-primary-soft p-4 md:p-6">
                <button
                  onClick={() => setShowBidModal(false)}
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
                    className="mx-auto mb-4 text-blue-500 w-12 h-12"
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
                  <h3 className="mb-2 text-body font-bold text-lg">
                    Confirm your bid
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Are you sure you want to place a bid of <br />
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(Number(bidMaxAmount)) + " VND"}
                    </span>{" "}
                    ?
                  </p>
                  <div className="flex items-center space-x-4 justify-center">
                    <button
                      onClick={() => confirmPlaceBid()}
                      type="button"
                      className="text-white bg-primary hover:bg-primary/80 rounded-2xl box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                      Confirm Bid
                    </button>
                    <button
                      onClick={() => setShowBidModal(false)}
                      type="button"
                      className="text-gray-300 bg-dark hover:bg-dark/80 hover:text-black rounded-2xl hover:bg-neutral-tertiary-medium hover:text-heading shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="border-b border-decor">
        <div className="h-12 bg-decor py-2">
          <p className="text-[20px] text-[#D1AE8D] tracking-wider uppercase pl-10">
            {isOnGoing ? "Ending In" : "Ended At"}
          </p>
        </div>
        <div className="flex items-center justify-center h-15">
          <h2
            className={`mt-1 ${
              isOnGoing
                ? "text-[30px] text-[#D1AE8D]"
                : "text-[22px] text-red-500 font-bold"
            }`}
          >
            {isOnGoing ? formatCountdown(timeLeft) : formatTime(newEndTime)}
          </h2>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="mb-6">
          {isOnGoing ? (
            <>
              <p className="text-xs text-dark uppercase tracking-widest mb-2">
                Current Bid
              </p>
              <p className="text-3xl font-medium text-dark mb-4">
                {formatPrice(newCurrentPrice) + " VND"}
              </p>
              <p className="text-xs text-dark mt-1 mb-2">BUY NOW</p>
              <div className="flex justify-between">
                <p className="text-3xl font-medium text-dark">
                  {auction.buyNowPrice
                    ? formatPrice(auction.buyNowPrice) + " VND"
                    : "No buyout price."}
                </p>
                {isBidder && auction.buyNowPrice && (
                  <button
                    onClick={() => handleShowModal(true)}
                    disabled={!isOnGoing}
                    className="h-10 px-2 bg-primary hover:bg-accent/80 hover:text-black text-white font-medium rounded-sm shadow-sm transition-colors uppercase tracking-wide ml-5 text-[14px]"
                  >
                    Buyout
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-xl text-dark uppercase tracking-widest mb-2 text-center">
                Final price
              </p>
              <p className="text-3xl font-medium text-dark mb-4 text-center">
                {newWinner
                  ? formatPrice(newCurrentPrice) + " VND"
                  : "There is no bids."}
              </p>
            </>
          )}
        </div>

        {/* SELLER INFO */}
        <div className="flex items-center gap-3 mb-6">
          {seller?.avatar_url ? (
            <img
              src={seller?.avatar_url}
              alt="Seller avatar"
              className="w-10 h-10 rounded-full object-cover border border-black"
            />
          ) : (
            <FaRegCircleUser className="w-10 h-10" />
          )}
          <div>
            <p className="text-[16px] text-dark">
              Posted by{" "}
              <span
                className={
                  isSeller
                    ? "font-bold text-sm text-accent"
                    : "font-bold text-sm"
                }
              >
                {isBidder && seller.firstName + " " + seller.lastName}
                {isSeller && "You"}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[16px] px-1 rounded flex items-center gap-0.5">
                <ThumbsUp size={15} /> 98%
              </span>
            </div>
          </div>
        </div>

        {/* QUICK BIDS */}
        <div className="flex justify-between gap-2 mb-3 h-7">
          {isBidder &&
            isOnGoing &&
            (!auction.buyNowPrice ||
              newCurrentPrice + 2 * auction.gapPrice < auction.buyNowPrice) && (
              <button
                onClick={() =>
                  setBidMaxAmount(newCurrentPrice + 2 * auction.gapPrice)
                }
                className="flex-1 border cursor-pointer border-gray-300 rounded-full py-1 text-[10px] sm:text-xs text-gray-600 hover:border-black transition-colors"
              >
                {formatPrice(newCurrentPrice + 2 * auction.gapPrice) + " VND"}
              </button>
            )}
          {isBidder &&
            isOnGoing &&
            (!auction.buyNowPrice ||
              newCurrentPrice + 3 * auction.gapPrice < auction.buyNowPrice) && (
              <button
                onClick={() =>
                  setBidMaxAmount(newCurrentPrice + 3 * auction.gapPrice)
                }
                className="flex-1 border cursor-pointer border-gray-300 rounded-full py-1 text-[10px] sm:text-xs text-gray-600 hover:border-black transition-colors"
              >
                {formatPrice(newCurrentPrice + 3 * auction.gapPrice) + " VND"}
              </button>
            )}
        </div>

        {/* INPUT BID */}
        {isGuest && (
          <>
            <div className="h-15">
              <input
                type="text"
                disabled={true}
                value={isOnGoing ? bidMaxAmount : ""}
                placeholder={
                  isOnGoing
                    ? "Please sign in to place bid."
                    : "This auction is already closed."
                }
                className={
                  isOnGoing
                    ? "bg-grayinput rounded-sm p-3 mb-3 hover:bg-grayinput/80 focus:ring-dark focus:ring focus:bg-grayinput/80 outline-none w-full text-sm pl-3 text-gray-600 placeholder-[#000000]/30"
                    : "bg-grayinput rounded-sm p-3 mb-3 outline-none w-full text-sm pl-3 text-gray-600 placeholder-[#000000]/30"
                }
              />
            </div>

            <button
              onClick={() => navigate("/signin")}
              disabled={!isOnGoing}
              className={
                isOnGoing
                  ? "w-full bg-primary hover:bg-accent/80 hover:text-black text-white font-medium py-3 rounded-sm shadow-sm transition-colors uppercase tracking-wide"
                  : "w-full bg-gray-400 text-gray-700 font-medium py-3 rounded-sm shadow-sm transition-colors uppercase tracking-wide"
              }
            >
              {isOnGoing ? "Sign in" : "Place bid"}
            </button>
          </>
        )}

        {isBidder && (
          <>
            <div className="h-15">
              <NumericFormat
                value={isOnGoing ? bidMaxAmount : ""}
                onValueChange={(values) => {
                  setBidMaxAmount(values.value);
                }}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                disabled={!isOnGoing}
                placeholder={
                  isOnGoing
                    ? !auction.buyNowPrice ||
                      newCurrentPrice + auction.gapPrice < auction.buyNowPrice
                      ? `${
                          formatPrice(newCurrentPrice + auction.gapPrice) +
                          " VND"
                        } or higher.`
                      : "You can buyout this product."
                    : "This auction is already closed."
                }
                className={
                  isOnGoing
                    ? "bg-grayinput rounded-sm p-3 mb-3 hover:bg-grayinput/80 focus:ring-dark focus:ring focus:bg-grayinput/80 outline-none w-full text-sm pl-3 text-gray-600 placeholder-[#000000]/30"
                    : "bg-grayinput rounded-sm p-3 mb-3 outline-none w-full text-sm pl-3 text-gray-600 placeholder-[#000000]/30"
                }
              />
            </div>

            {isAllowed && (
              <button
                onClick={() => handleShowBidModal(true)}
                disabled={!isOnGoing}
                className={
                  isOnGoing
                    ? "w-full bg-primary cursor-pointer hover:bg-accent/80 hover:text-black text-white font-medium py-3 rounded-sm shadow-sm transition-colors uppercase tracking-wide"
                    : "w-full bg-gray-400 text-gray-700 font-medium py-3 rounded-sm shadow-sm transition-colors uppercase tracking-wide"
                }
              >
                Place Bid
              </button>
            )}
            {!isAllowed && (
              <button
                disabled={false}
                className={
                  "w-full bg-gray-400 text-gray-700 font-medium py-3 rounded-sm shadow-sm transition-colors uppercase tracking-wide"
                }
              >
                Not enough rating to place a bid
              </button>
            )}
          </>
        )}

        <div className="h-23 border-y border-dark mt-6">
          <p className="text-dark/70 text-[16px] mt-2">
            {isOnGoing ? "CURRENT WINNING BIDDER" : "WINNING BIDDER"}
          </p>
          <div className="flex items-center justify-center mt-3 gap-2 w-full">
            {newWinner && (
              <>
                <Crown></Crown>
                <p
                  className={
                    isWinner
                      ? "text-amber-700 font-extrabold text-[20px]"
                      : "text-[20px]"
                  }
                >
                  {isWinner
                    ? "You"
                    : maskFirstHalf(
                        newWinner.firstName + " " + newWinner.lastName
                      )}
                </p>
              </>
            )}
            {!newWinner && (
              <p>
                {isOnGoing
                  ? "No one has placed a bid yet. Be the first!"
                  : "There is no winner."}
              </p>
            )}
          </div>
        </div>

        <History
          isSeller={isSeller}
          isBidder={isBidder}
          isGuest={isGuest}
          userId={!isGuest ? user._id : null}
          endTime={newEndTime}
        ></History>
      </div>
    </div>
  );
};

export default RightSideBar;
