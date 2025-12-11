import { useWatchListStore } from "../../../stores/useWatchList.store.js";
import { useEffect, useState } from "react";
import ListHeader from "../ListHeader.jsx";
import ListGrid from "../ListGrid.jsx";
import Pagination from "../Pagination.jsx";
import Divider from "../Divider.jsx";

const WatchListSection = () => {
  // states
  const [currentPage, setCurrentPage] = useState(1);
  const {items, fetchFavorites, loading, limit, total} = useWatchListStore();

  // load favorite list
  useEffect(() => {
    const loadFavorites = async () => {
       await fetchFavorites(currentPage, limit);
    }

    loadFavorites();
  }, [currentPage]);

  // total pages
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-5xl mb-6">Watch List</h1>
      <Divider/>

      {items.length > 0 ? 
      (<>
        <ListHeader/>
        <ListGrid items={items} loading={loading}/>
        <div className="flex justify-center mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
        </div>
      </>) :
      (<div className="flex items-center justify-center">
        <p className="text-center text-2xl font-bold">No auctions in watch list</p>
      </div>)
      }   
    </div>
  );
}

export default WatchListSection;