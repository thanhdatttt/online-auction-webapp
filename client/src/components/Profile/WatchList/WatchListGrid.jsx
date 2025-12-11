import ProductCard from "../../ProductCard.jsx";
import Loading from "../../Loading.jsx";

const WatchListGrid = ({items, loading}) => {
  // if being loading
  if (loading)
    return <Loading/>;

  return (
    <div className="grid grid-cols-3 gap-6">
      {items.map((auction) => (
        <ProductCard key={auction._id} auction={auction} />
      ))}
    </div>
  );
}

export default WatchListGrid;