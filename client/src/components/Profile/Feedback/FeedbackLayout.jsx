import React, { useState, useEffect } from "react";
import FeedbackCard from "./FeedbackCard";
import api from "../../../utils/axios";
import Loading from "../../Loading";
import Error from "../../Error";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination";
import { useMemo } from "react";

const FeedbackLayout = ({userId}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const limit = searchParams.get("limit") || 9;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ total: 0, totalPositive: 0 });
  const [totalPages, setTotalPages] = useState(0);

  const queryString = useMemo(() => {
    const str = new URLSearchParams();

    if (page) str.set("page", page);
    if (limit) str.set("limit", limit);
    return str.toString();
  }, [page, limit]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const endpoint = userId 
            ? `/users/${userId}/feedbacks?${queryString}`
            : `/users/me/feedbacks?${queryString}`;
            
            const res = await api.get(endpoint);

        setFeedbacks(res.data.ratings);
        setStats({
          total: res.data.total,
          totalPositive: res.data.totalPositive,
        });
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load feedbacks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, userId]);

  const onPageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    if (!newPage) next.delete("page");
    else next.set("page", newPage);
    setSearchParams(next);
  };

  // --- LOGIC MỚI: Kiểm tra Seller mới ---
  const isNewSeller = stats.total === 0;

  const positivePercentage =
    stats.total > 0 ? Math.round((stats.totalPositive / stats.total) * 100) : 0;

  let colorClass = "text-[#22C55E]";

  if (isNewSeller) {
    colorClass = "text-gray-500";
  } else if (positivePercentage < 50) {
    colorClass = "text-red-500";
  } else if (positivePercentage < 80) {
    colorClass = "text-amber-500";
  }

  return (
    <div className="w-full font-lato text-[#1a1a1a] bg-light p-8 min-h-screen">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-normal text-[#1a1a1a] mb-2">Feedbacks</h1>

        <div className="text-[32px] font-medium items-center flex gap-2">
          {isNewSeller ? (
            <span className={`${colorClass} font-bold text-2xl`}>
              No ratings yet
            </span>
          ) : (
            <>
              <span className={`${colorClass} font-bold`}>
                +{positivePercentage}%
              </span>
              <span className="text-[#1a1a1a]">Positive Feedback</span>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#D1D5DB] mb-8 w-full opacity-60"></div>

      {/* Content Area - GIỮ NGUYÊN */}
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Error message={error} />
      ) : (
        <>
          {feedbacks.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              {userId ? "This user hasn't received any feedback yet." : "You haven't received any feedback yet."}
            </div>
          )}

          <div className="space-y-4">
            {feedbacks.map((item) => (
              <FeedbackCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 0 && (
            <div className="mt-12 flex justify-center items-center gap-3">
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={onPageChange}
              ></Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackLayout;
