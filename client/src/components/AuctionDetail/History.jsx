import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { socket } from "../../utils/socket";
import Error from "../Error.jsx";
import api from "../../utils/axios.js";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuctionStore } from "../../stores/useAuction.store.js";
const History = ({ isSeller, isBidder, isGuest, userId, endTime }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [history, setHistory] = useState([]);

  const [error, setError] = useState(null);

  const { id } = useParams();

  const { maskFirstHalf, formatTime, formatPrice, handleRejectBidder } =
    useAuctionStore();

  const [showModal, setShowModal] = useState(false);

  const [showScrollBar, setShowScrollBar] = useState(false);

  const [bidderId, setBidderId] = useState(null);

  const [rejectedBidderIds, setRejectedBidderIds] = useState([]);

  const listRef = useRef(null);

  const isOnGoing = new Date() < new Date(endTime);

  console.log(isOnGoing);

  const handleScrollBar = (value) => {
    setShowScrollBar(value);
    listRef.current.scrollTop = 0;
  };

  useEffect(() => {
    let isMounted = true;

    const loadNewHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await api.get(`/guest/auctions/${id}/history`);

        if (isMounted) {
          setHistory(res.data.history);
          setRejectedBidderIds(res.data.rejectedBidderIds);
        }

        if (!socket.connected) socket.connect();

        socket.on("historyUpdate", (newHistory) => {
          if (isMounted) {
            console.log(newHistory);
            setHistory((prev) => [...newHistory, ...prev]);
          }
        });
        socket.on("rejectUpdate", (newBidderId) => {
          if (isMounted) {
            setHistory((prev) =>
              prev.map((i) => {
                return newBidderId === i.bidderId._id
                  ? { ...i, isActive: false }
                  : i;
              })
            );
            setRejectedBidderIds((prev) => [...prev, newBidderId]);
          }
        });
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadNewHistory();

    return () => {
      isMounted = false;
      socket.off("historyUpdate");
    };
  }, [id]);

  const handleShowModal = (value, userId = null) => {
    setShowModal(value);
    setBidderId(userId);
  };

  const confirm = () => {
    const res = handleRejectBidder(id, bidderId);
    setShowModal(false);
  };

  console.log(history);

  return (
    <div className="mt-8">
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
                  data-modal-hide="popup-modal"
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
                    Are you sure you want to reject this bidder ?
                  </h3>
                  <div className="flex items-center space-x-4 justify-center">
                    <button
                      onClick={() => confirm()}
                      data-modal-hide="popup-modal"
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-400 hover:text-black rounded-2xl box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      onClick={() => handleShowModal(false)}
                      data-modal-hide="popup-modal"
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

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-700">Bidding History</h3>
      </div>
      {isSeller && isOnGoing && (
        <h3 className="text-sm font-bold text-dark mb-3">
          Click on any entry below to reject that bidder.
        </h3>
      )}
      {isLoading && <p>is loading....</p>}
      {error && (
        <div>
          <Error message={error}></Error>
        </div>
      )}
      {!isLoading && !error && (
        <>
          <div
            ref={listRef}
            className={
              showScrollBar
                ? "overflow-y-auto custom-scroll h-96"
                : "overflow-hidden h-47 pr-4"
            }
          >
            {history &&
              history.map((h) => (
                <div
                  key={h._id}
                  className="bg-decor rounded border border-gray-100 text-xs"
                >
                  {/* guest */}
                  {isGuest && (
                    <div
                      className={
                        h.isActive
                          ? "flex justify-between bg-decor p-2 border-b border-gray-100"
                          : "flex justify-between bg-gray-400 line-through p-2 border-b border-gray-100"
                      }
                    >
                      <span className="text-gray-600">
                        {maskFirstHalf(
                          h.bidderId.firstName + " " + h.bidderId.lastName
                        )}
                      </span>
                      <div className="text-right">
                        <span className="block text-gray-500 text-[10px]">
                          {formatTime(h.bidTime)}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(h.bidEntryAmount)}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* bidder */}
                  {isBidder && (
                    <div
                      className={
                        !h.isActive
                          ? "flex justify-between bg-gray-400 line-through p-2 border-b border-gray-100"
                          : userId === h.bidderId?._id
                          ? "flex justify-between bg-accent p-2 border-b border-gray-100"
                          : "flex justify-between bg-decor p-2 border-b border-gray-100"
                      }
                    >
                      <span className="text-gray-600">
                        {userId === h.bidderId?._id
                          ? "You"
                          : maskFirstHalf(
                              h.bidderId.firstName + " " + h.bidderId.lastName
                            )}
                      </span>
                      {userId === h.bidderId._id && (
                        <div className="text-center">
                          <span className="block text-gray-500 text-[10px]">
                            Max
                          </span>
                          <span className="font-semibold">
                            {formatPrice(h.bidMaxAmount)}
                          </span>
                        </div>
                      )}
                      <div className="text-right">
                        <span className="block text-gray-500 text-[10px]">
                          {formatTime(h.bidTime)}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(h.bidEntryAmount)}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* seller */}
                  {isSeller && (
                    <div
                      className={
                        !h.isActive
                          ? "flex justify-between bg-gray-400 line-through p-2 border-b border-gray-100"
                          : isOnGoing
                          ? "flex justify-between bg-decor p-2 border-b border-gray-100 hover:bg-red-400"
                          : "flex justify-between bg-decor p-2 border-b border-gray-100"
                      }
                      onClick={() => {
                        if (!h.isActive) return;
                        handleShowModal(isOnGoing, h.bidderId._id);
                      }}
                    >
                      <span className="text-gray-600">
                        {maskFirstHalf(
                          h.bidderId.firstName + " " + h.bidderId.lastName
                        )}
                      </span>
                      <div className="text-right">
                        <span className="block text-gray-500 text-[10px]">
                          {formatTime(h.bidTime)}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(h.bidEntryAmount)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
      {history.length > 4 && (
        <button
          onClick={() => handleScrollBar(!showScrollBar)}
          className="text-primary text-xs font-bold mt-2 flex items-center gap-1 hover:text-primary/65"
        >
          {showScrollBar ? (
            <>
              Close <ChevronUp size={12} />
            </>
          ) : (
            <>
              See all bids <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default History;
