import { useNavigate } from "react-router-dom";
import { useAuctionStore } from "../../stores/useAuction.store";

const Hero = ({ auction }) => {
  const navigate = useNavigate();

  const { formatCompactNumber } = useAuctionStore();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-lighter">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* left content */}
        <div className="space-y-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-primary text-lg font-bold tracking-widest uppercase">
            <span className="mr-2">✨</span> Welcome to Auctiz
          </div>

          <h1 className="text-6xl lg:text-7xl font-serif font-bold text-slate-900 leading-[1.1]">
            Bid <span className="text-primary italic">Smart</span>
            <br />
            Big{" "}
            <span className="relative">
              Win
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 1 100 5"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  fill="transparent"
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            Join thousands of collectors and connoisseurs in the most trusted
            online auction platform. Discover hidden treasures and timeless
            masterpieces.
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate(`/auctions`)}
              className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-amber-200 hover:bg-accent hover:text-black hover:-translate-y-1 transition-all flex items-center justify-center group cursor-pointer"
            >
              Start Bidding
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
            <button
              onClick={() => navigate("/instructions")}
              className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:border-amber-600 transition-all cursor-pointer"
            >
              How it works
            </button>
          </div>
        </div>

        {/* right content */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-amber-600/10 rounded-4xl blur-2xl group-hover:bg-amber-600/20 transition-all duration-700" />
          <div className="relative aspect-4/5 overflow-hidden rounded-4xl shadow-2xl">
            <img
              src={auction.product.images[0].url}
              alt={auction.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-6 right-6 left-6 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50">
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-xl font-bold text-rose-500 uppercase tracking-widest
                   border-2 border-rose-500 px-3 py-1 rounded-lg"
                >
                  NEW
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-slate-900">
                {auction.product.name}
              </h3>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-xl text-slate-500 font-lora">
                    Current Bid
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {auction.currentPrice ? (
                      <span>
                        {formatCompactNumber(auction.currentPrice) + " VND"}
                      </span>
                    ) : (
                      <span>None</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/auctions/${auction._id}`)}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-accent hover:text-black transition-colors uppercase tracking-tight"
                >
                  Place Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
