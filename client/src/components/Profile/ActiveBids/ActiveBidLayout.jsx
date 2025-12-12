import { useActiveBidStore } from "../../../stores/useActiveBid.store.js";
import { useState, useEffect } from "react";
import Pagination from "../Pagination.jsx";
import ListGrid from "../ListGrid.jsx";
import ListHeader from "../ListHeader.jsx";
import Divider from "../Divider.jsx";

const ActiveBidLayout = () => {
  // states
  const [currentPage, setCurrentPage] = useState(1);
  const {activeBids, fetchActiveBids, loading, limit, total} = useActiveBidStore();

  // loading active bids
  useEffect(() => {
    const loadActiveBids = async() => {
      await fetchActiveBids(currentPage, limit);
    }

    loadActiveBids();
  }, [currentPage]);

  // total pages
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-5xl mb-6">Active Bids</h1>
      <Divider/>

      {activeBids.length > 0 ?
      (<>
        <ListHeader />
        <ListGrid items={activeBids} loading={loading}/>
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