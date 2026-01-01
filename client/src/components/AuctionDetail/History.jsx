import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { socket } from "../../utils/socket";
import Error from "../Error.jsx";
import api from "../../utils/axios.js";
import { ChevronDown, ChevronUp, Ban } from "lucide-react";
import { useAuctionStore } from "../../stores/useAuction.store.js";

const History = ({ isSeller, isBidder, isGuest, userId, endTime }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { maskFirstHalf, formatTime, formatPrice, handleRejectBidder } =
    useAuctionStore();

  const [showModal, setShowModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  const [showScrollBar, setShowScrollBar] = useState(false);
  const [bidderId, setBidderId] = useState(null);
  const [rejectedBidderIds, setRejectedBidderIds] = useState([]);
  const listRef = useRef(null);
  const isOnGoing = new Date() < new Date(endTime);

  const handleScrollBar = (value) => {
    setShowScrollBar(value);
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get(`/guest/auctions/${id}/history`);
        if (!isMounted) return;

        setHistory(res.data.history);
        setRejectedBidderIds(res.data.rejectedBidderIds);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (userId && rejectedBidderIds.length > 0) {
      if (rejectedBidderIds.includes(userId)) {
        setShowBanModal(true);
      }
    }
  }, [rejectedBidderIds, userId]);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("joinAuction", id);

    const onHistoryUpdate = (newBids) => {
      setHistory((prev) => [...newBids, ...prev]);
    };

    const onRejectUpdate = (rejectedId) => {
      setHistory((prev) =>
        prev.map((i) =>
          i.bidderId?._id === rejectedId ? { ...i, isActive: false } : i
        )
      );

      setRejectedBidderIds((prev) => {
        if (prev.includes(rejectedId)) return prev;
        return [...prev, rejectedId];
      });

      if (userId && rejectedId === userId) {
        setShowBanModal(true);
      }
    };

    socket.on("historyUpdate", onHistoryUpdate);
    socket.on("rejectUpdate", onRejectUpdate);

    return () => {
      socket.emit("leaveAuction", id);
      socket.off("historyUpdate", onHistoryUpdate);
      socket.off("rejectUpdate", onRejectUpdate);
    };
  }, [id, userId]);

  const handleShowModal = (value, userIdToReject = null) => {
    setShowModal(value);
    setBidderId(userIdToReject);
  };

  const confirm = async () => {
    await handleRejectBidder(id, bidderId);
    setShowModal(false);
    setBidderId(null);
  };

  return (
    <div className="mt-8">
      {/* MODAL CONFIRM REJECT (SELLER) */}
      {showModal && (
        <div>
          <div className="flex justify-center items-center rounded-md bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-4xl">
              <div className="relative bg-neutral-primary-soft p-4 md:p-6">
                <button
                  onClick={() => handleShowModal(false)}
                  type="button"
                  className="absolute top-3 end-2.5 text-body bg-transparent hover:bg-neutral-tertiary hover:bg-decor rounded-2xl hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                >
                  <span className="sr-only">Close modal</span>
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <svg
                    className="mx-auto mb-4 text-gray-400 w-12 h-12"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <h3 className="mb-6 text-body">
                    Are you sure you want to reject this bidder?
                  </h3>
                  <div className="flex items-center space-x-4 justify-center">
                    <button
                      onClick={() => confirm()}
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      onClick={() => handleShowModal(false)}
                      className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
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

      {/* MODAL BANNED (BIDDER) */}
      {showBanModal && (
        <div>
          <div className="flex justify-center items-center rounded-md bg-black/60 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm">
            <div className="relative p-4 w-full max-w-md max-h-full bg-accent rounded-2xl shadow-2xl">
              <div className="relative p-4 md:p-6 text-center">
                <div className="mx-auto mb-4 text-red-600 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Ban size={32} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Access Revoked
                </h3>
                <p className="mb-6 text-gray-500">
                  You have been rejected by the seller. You can no longer place
                  bids on this auction.
                </p>
                <button
                  onClick={() => {
                    setShowBanModal(false);
                  }}
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full cursor-pointer"
                >
                  I Understand
                </button>
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
                          h.bidderId?.firstName + " " + h.bidderId?.lastName
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
                              h.bidderId?.firstName + " " + h.bidderId?.lastName
                            )}
                      </span>
                      {userId === h.bidderId?._id && (
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
                  {isSeller && (
                    <div
                      className={
                        !h.isActive
                          ? "flex justify-between bg-gray-400 line-through p-2 border-b border-gray-100"
                          : isOnGoing
                          ? "flex justify-between bg-decor p-2 border-b border-gray-100 hover:bg-red-400 cursor-pointer"
                          : "flex justify-between bg-decor p-2 border-b border-gray-100"
                      }
                      onClick={() => {
                        if (!h.isActive || !isOnGoing) return;
                        handleShowModal(true, h.bidderId?._id);
                      }}
                    >
                      <span className="text-gray-600">
                        {maskFirstHalf(
                          h.bidderId?.firstName + " " + h.bidderId?.lastName
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
