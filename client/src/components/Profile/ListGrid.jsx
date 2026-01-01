import AuctionCard from "../AuctionCard.jsx";

const ListGrid = ({items}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((auction) => (
        <AuctionCard key={auction._id} auction={auction} />
      ))}
    </div>
  );
}

export default ListGrid;