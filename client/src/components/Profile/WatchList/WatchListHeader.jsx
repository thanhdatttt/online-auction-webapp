import { FiSearch } from "react-icons/fi";


const WatchListHeader = () => {
  return (
    <div className="flex items-center justify-between my-4 gap-4">
      <div className="flex-1 relative w-80">
        <input
          type="text"
          placeholder="Search auctions"
          className="w-full px-4 py-2 pl-10 border rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-primary"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-500" size={20} />
      </div>

      <select className="px-4 py-2 border rounded-lg bg-gray-100">
        <option>Sort By</option>
        <option>Recently Added</option>
        <option>Ending Soon</option>
        <option>Highest Bid</option>
      </select>
    </div>
  );
}

export default WatchListHeader;