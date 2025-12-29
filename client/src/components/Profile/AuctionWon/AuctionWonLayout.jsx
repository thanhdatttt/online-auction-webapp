import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import Pagination from "../Pagination";
import Divider from "../Divider";
import { useAuthStore } from "../../../stores/useAuth.store";
import api from "../../../utils/axios";
import Error from "../../Error";
import Loading from "../../Loading";
import AuctionWonCard from "./AuctionWonCard";

export const AuctionWonLayout = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- States ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 9);
  const searchQuery = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(searchQuery);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (searchTerm === searchQuery) return;

    const timeoutId = setTimeout(() => {
      const next = new URLSearchParams(searchParams);

      if (searchTerm.trim()) {
        next.set("q", searchTerm.trim());
      } else {
        next.delete("q");
      }

      next.set("page", 1);
      setSearchParams(next);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchParams, searchQuery]);

  const queryString = useMemo(() => {
    const str = new URLSearchParams();
    str.set("page", page);
    str.set("limit", limit);
    if (searchQuery) {
      str.set("q", searchQuery);
    }
    return str.toString();
  }, [page, limit, searchQuery]);

  // --- Fetch Data ---
  useEffect(() => {
    let isMounted = true;

    const loadWonAuctions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Gọi API với query string mới nhất
        const res = await api.get(`/users/me/won-auctions?${queryString}`);

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

    loadWonAuctions();

    return () => {
      isMounted = false;
    };
  }, [queryString]);

  // --- Handlers ---
  const onPageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    if (newPage) next.set("page", newPage);
    else next.delete("page");
    setSearchParams(next);
  };

  // Chỉ chặn reload form, việc search đã được useEffect xử lý
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full font-lato text-[#333]">
      {/* Title */}
      <h1 className="text-4xl font-normal text-[#1a1a1a] mb-6">Auction Won</h1>

      {/* Divider */}
      <Divider></Divider>

      {/* Search Bar */}
      <div className="flex justify-between items-center mt-6 mb-8 border-b border-gray-200 pb-3">
        <form onSubmit={handleFormSubmit} className="relative mb-2 md:mb-1">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            // Update state ngay lập tức để kích hoạt debounce
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
      </div>

      {/* List Items */}
      <div className="space-y-6">
        {isLoading && <Loading></Loading>}
        {error && <Error message={error}></Error>}

        {!isLoading && !error && wonAuctions.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No auctions found.
          </div>
        )}

        {!error &&
          wonAuctions.map((item) => (
            <AuctionWonCard
              key={item._id}
              rating={ratings.find((x) => x.auctionId === item._id)}
              item={item}
            ></AuctionWonCard>
          ))}
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
