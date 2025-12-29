import { useActiveBidStore } from "../../../stores/useActiveBid.store.js";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import Pagination from "../Pagination.jsx";
import ListGrid from "../ListGrid.jsx";
import ActiveBidHeader from "./ActiveBidHeader.jsx";
import Divider from "../Divider.jsx";
import Loading from "../../Loading.jsx";

const ActiveBidLayout = () => {
  // states
  const [currentPage, setCurrentPage] = useState(1);
  const {activeBids, fetchActiveBids, setSearchQuery, setSortBy, loading, limit, total} = useActiveBidStore();
  const [searchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy");
  const searchQuery = searchParams.get("searchQuery");

  // loading active bids
  useEffect(() => {
    const loadActiveBids = async() => {
      setSearchQuery(searchQuery);
      setSortBy(sortBy);
      await fetchActiveBids(currentPage, limit);
    }

    loadActiveBids();
  }, [currentPage, sortBy, searchQuery]);

  // total pages
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-5xl mb-6">Active Bids</h1>
      <Divider/>

      <ActiveBidHeader />
      {loading ? <Loading/> :
        activeBids.length > 0 ?
        (<>
          <ListGrid items={activeBids} />
          <div className="flex justify-center mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
          </div>
        </>) :
        (<div className="flex items-center justify-center">
          <p className="text-center text-2xl font-bold">No auctions was bidded</p>
        </div>)
      }
    </div>
  );
}

export default ActiveBidLayout;