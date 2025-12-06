import ProductCard from "../../ProductCard.jsx";

const WatchListGrid = () => {
  const sampleItems = Array(9).fill(null);

  return (
    <div className="grid grid-cols-3 gap-6">
      {sampleItems.map((_, index) => (
        <ProductCard key={index} />
      ))}
    </div>
  );
}

export default WatchListGrid;