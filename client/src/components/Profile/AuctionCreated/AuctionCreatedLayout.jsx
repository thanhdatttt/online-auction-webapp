import React, { useMemo, useState, useEffect } from "react";
import Pagination from "../Pagination";
import Divider from "../Divider";
import { useAuthStore } from "../../../stores/useAuth.store";
import api from "../../../utils/axios";
import Error from "../../Error";
import Loading from "../../Loading";
import AuctionCreatedCard from "./AuctionCreatedCard";
import { useSearchParams } from "react-router-dom";
import { SearchIcon } from "lucide-react";

const AuctionCreatedLayout = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const status = searchParams.get("status") || "ended";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 9);
  const q = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(q);

  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  useEffect(() => {
    if (searchTerm === q) return;

    const delayDebounceFn = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (searchTerm.trim()) {
        next.set("q", searchTerm.trim());
      } else {
        next.delete("q");
      }
      next.set("page", 1);
      setSearchParams(next);
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams, q]);

  const queryString = useMemo(() => {
    const str = new URLSearchParams();
    str.set("page", page);
    str.set("limit", limit);
    str.set("status", status);
    if (q) str.set("q", q);
    return str.toString();
  }, [page, limit, status, q]);

  useEffect(() => {
    let isMounted = true;
    const loadCreatedAuctions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get(`/users/me/created-auctions?${queryString}`);
        if (isMounted) {
          setWonAuctions(res.data.auctions);
          setRatings(res.data.ratings);
          setTotalPages(res.data.totalPages);
          setTotal(res.data.total);
        }
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadCreatedAuctions();
    return () => {
      isMounted = false;
    };
  }, [queryString]);

  const onPageChange = (page) => {
    const next = new URLSearchParams(searchParams);
    if (page) next.set("page", page);
    else next.delete("page");
    setSearchParams(next);
  };

  const onFilterChange = (newStatus) => {
    const next = new URLSearchParams(searchParams);
    next.set("status", newStatus);
    next.set("page", 1);
    setSearchParams(next);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full font-lato text-[#333]">
      {/* Title */}
      <h1 className="text-4xl font-normal text-[#1a1a1a] mb-6">
        Auction Created
      </h1>

      {/* Divider */}
      <Divider></Divider>

      {/* --- Filter Tabs & Search Bar Container --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 border-b border-gray-200 pb-3 gap-4">
        {/* Search Input */}
        <form onSubmit={handleFormSubmit} className="relative mb-2 md:mb-1">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black w-full md:w-64 transition-colors"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <SearchIcon />
          </button>
        </form>

        {/* Filter Buttons */}
        <div className="flex items-center gap-8 overflow-x-auto">
          {/* TAB: ONGOING */}
          <button
            onClick={() => onFilterChange("ongoing")}
            className={`pb-2 text-sm font-medium transition-all whitespace-nowrap ${
              status === "ongoing"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Ongoing
          </button>

          {/* TAB: ENDED */}
          <button
            onClick={() => onFilterChange("ended")}
            className={`pb-2 text-sm font-medium transition-all whitespace-nowrap ${
              status === "ended"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Ended
          </button>

          {/* TAB: SUCCESSFUL (Mới thêm) */}
          <button
            onClick={() => onFilterChange("successful")}
            className={`pb-2 text-sm font-medium transition-all whitespace-nowrap ${
              status === "successful"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Successful
          </button>
        </div>
      </div>

      {/* List Items */}
      <div className="space-y-6 mt-6">
        {isLoading && <Loading></Loading>}
        {error && <Error message={error}></Error>}
        {!error &&
          wonAuctions.map((item) => (
            <AuctionCreatedCard
              key={item._id}
              rating={ratings.find((x) => x.auctionId === item._id)}
              item={item}
            ></AuctionCreatedCard>
          ))}

        {/* Empty State message */}
        {!isLoading && !error && wonAuctions.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No auctions found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="mt-12 flex justify-center items-center gap-3">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={onPageChange}
          ></Pagination>
        </div>
      )}
    </div>
  );
};

export default AuctionCreatedLayout;
