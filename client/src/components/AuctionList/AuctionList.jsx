import Sidebar from "./Sidebar.jsx";
import Sortbar from "./Sortbar.jsx";
import AuctionCard from "../AuctionCard.jsx";
import Pagination from "./Pagination.jsx";
import { useEffect } from 'react';
import { useAuctionStore } from "../../stores/useAuction.store.js";
import { useCategoryStore } from "../../stores/useCategory.store.js";
import { useSearchParams } from "react-router";

const AuctionList = () => {
const auctions = useAuctionStore((state) => state.auctions);
const loading = useAuctionStore((state) => state.loading);
  const {
    setCategory,
    setSortBy,
    setPage,
    setSearchQuery,
    pagination,
    getAuctions,
  } = useAuctionStore();
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const sortBy = searchParams.get("sortBy");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search");

  const { categories, getCategories } = useCategoryStore();
  useEffect(() => {
    setSortBy(sortBy);
    setCategory(categoryId);
    setPage(page);
    setSearchQuery(searchQuery);
    getAuctions(page);
    getCategories();
  }, [categoryId, sortBy, page, searchQuery]);

  return (
    <main className="container mx-auto px-4 py-8 pt-24 flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/5 bg-dark p-5 rounded-lg h-fit">
          {categories.map((category, index) => (
            <Sidebar key={index} category={category} />
          ))}
        </aside>

        <section className="lg:w-3/4">
          <div className="flex justify-end mb-4">
            <Sortbar />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[13px] gap-y-[23px]">
            {auctions.map((auction, index) => (
              <AuctionCard key={index} auction={auction} />
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />
          </div>
        </section>
      </main>
  )
}

export default AuctionList