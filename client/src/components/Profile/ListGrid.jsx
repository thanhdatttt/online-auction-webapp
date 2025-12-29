import AuctionCard from "../AuctionCard.jsx";
import Loading from "../Loading.jsx";

const ListGrid = ({items, loading}) => {
  // if being loading
  if (loading)
    return <Loading/>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((auction) => (
        <AuctionCard key={auction._id} auction={auction} />
      ))}
    </div>
  );
}

export default ListGrid;