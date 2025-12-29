import AuctionCard from "./AuctionCard";

const dummyAuction = {
  _id: "auction_dummy_001",
  isNew: true,
  startTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h trước
  endTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),   // 2h nữa
  currentPrice: 12500000,
  bids: 12,
  winnerId: {
    _id: "user_01",
    username: "john_doe",
  },
  product: {
    name: "Vintage Rolex Submariner",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
};

const CardTest = () => {
  return (
    <div className="max-w-sm">
      <AuctionCard auction={dummyAuction} />
    </div>
  );
};

export default CardTest;
