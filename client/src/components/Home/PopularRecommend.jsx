import AuctionCard from '../AuctionCard.jsx';
import CardTest from "../CardTest.jsx";

const PopularRecommend = ({ auctions }) => {
  return (
    <section className="py-16 bg-accent">
      <div className="max-w-[1800px] mx-auto px-6 relative">
        {/* Decorative Outer Border */}
        <div className="border-[3px] border-rose-500 rounded-[3rem] pt-16 pb-12 px-8 bg-[#e6e2d3] relative">
          
          {/* Popular Picks Badge */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-rose-500 px-10 py-3 rounded-full shadow-xl z-20 whitespace-nowrap">
            <h2 className="text-white text-3xl md:text-4xl font-serif font-black italic tracking-tight">Popular Picks</h2>
          </div>

          {/* Grid of Cards - Responsive columns: 1 (mobile), 2 (tablet), 3 (laptop), 5 (PC) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction._id} auction={auction}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopularRecommend;