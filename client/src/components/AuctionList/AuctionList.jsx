import Sidebar from "./Sidebar.jsx";
import Sortbar from "./Sortbar.jsx";
import AuctionCard from "../AuctionCard.jsx";
import Pagination from "./Pagination.jsx";
import { useEffect, useState } from 'react';
import { useAuctionStore } from "../../stores/useAuction.store.js";
import { useCategoryStore } from "../../stores/useCategory.store.js";
import { useSearchParams } from "react-router";
import AuctionListHeader from "./AuctionListHeader.jsx";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const sortBy = searchParams.get("sortBy");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search");
  const [openCategoryId, setOpenCategoryId] = useState(null);

  const { categories, getCategories } = useCategoryStore();
  useEffect(() => {
    setSortBy(sortBy);
    setCategory(categoryId);
    setPage(page);
    setSearchQuery(searchQuery);
    getAuctions(page);
    getCategories();

    if (categoryId && categories.length > 0) {
      // 1. Check if the ID belongs to a main parent
      const isParent = categories.find(c => c._id === categoryId);
      
      if (isParent) {
        setOpenCategoryId(categoryId);
      } else {
        // 2. If not, search for the parent who owns this child
        const parentOfChild = categories.find(parent => 
          parent.children && parent.children.some(child => child._id === categoryId)
        );
        
        if (parentOfChild) {
          setOpenCategoryId(parentOfChild._id);
        }
      }
    }
  }, [categoryId, sortBy, page, searchQuery]);

  const handleCategoryToggle = (id) => {
    // If clicking the already open one, close it. Otherwise, open the new one.
    setOpenCategoryId(prev => prev === id ? null : id);
  };

  // --- NEW: Handle "All Auctions" Click ---
  const handleAllAuctions = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("categoryId"); // Remove filter
    newParams.set("page", "1");
    setSearchParams(newParams);
    setOpenCategoryId(null); // Close all accordions
  };

  return (
    <main className="container mx-auto px-4 py-8 pt-24 flex flex-col lg:flex-row gap-8">
        <aside className="w-64 bg-[#1F2125] p-6 rounded-2xl min-h-[500px]">
          <div className="space-y-1">
            {/* 1. The "All Auctions" Static Option */}
                <div 
                    onClick={handleAllAuctions}
                    className={`flex items-center gap-3 py-2 cursor-pointer transition-colors duration-200 mb-4 pb-4 border-b border-gray-700
                        ${!categoryId ? "text-orange-500" : "text-gray-300 hover:text-white"}`}
                >
                    {/* <LayoutGrid size={20} /> */}
                    <span className="font-lato font-bold text-lg tracking-wide">All Auctions</span>
                </div>
                {/* 2. The Categories List */}
                {categories.map((category) => (
                    <Sidebar 
                        key={category._id} 
                        category={category}
                        // Pass controlled props
                        isOpen={openCategoryId === category._id}
                        onToggle={handleCategoryToggle}
                    />
                ))}
          {/* {categories.map((category, index) => (
            <Sidebar key={index} category={category} />
          ))} */}
          </div>
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
    </>
  )
}

export default AuctionList