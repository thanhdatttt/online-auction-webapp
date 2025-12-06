import WatchListHeader from "./WatchListHeader.jsx";
import WatchListGrid from "./WatchListGrid.jsx";
import Pagination from "./Pagination.jsx";
import Divider from "../Divider.jsx";

const WatchListSection = () => {
  return (
    <div>
      <h1 className="text-5xl mb-6">Watch List</h1>
      <Divider/>

      <WatchListHeader/>
      <WatchListGrid/>

      <div className="flex justify-center mt-8">
        <Pagination currentPage={1} totalPages={10} onPageChange={() => console.log("page change")}/>
      </div>
    </div>
  );
}

export default WatchListSection;