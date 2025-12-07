import ProductCard from "../../ProductCard.jsx";
import Loading from "../../Loading.jsx";

const WatchListGrid = ({items, loading}) => {
  // if being loading
  if (loading)
    return <Loading/>;

  // if list is empty
  if (!items || items.length === 0)
    return <p className="text-center mt-10">No items in watch list</p>;

  return (
    <div className="grid grid-cols-3 gap-6">
      {items.map((auction) => (
        <ProductCard key={auction._id} auction={auction} />
      ))}
    </div>
  );
}

export default WatchListGrid;