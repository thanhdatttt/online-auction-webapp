import { ThumbsUp, ChevronDown, Crown } from "lucide-react";
import { FaRegCircleUser } from "react-icons/fa6";
const RightSideBar = () => {
  return (
    <div className="bg-light border-0 border-dark shadow-sm rounded-sm overflow-hidden sticky top-20">
      {/* BEIGE HEADER */}
      <div className="border-b border-decor">
        <div className="h-12 bg-decor py-2">
          <p className="text-[20px] text-[#D1AE8D] tracking-wider uppercase pl-10">
            Ending In
          </p>
        </div>
        <div className="flex items-center justify-center h-15">
          <h2 className="text-[30px] text-[#D1AE8D] text- mt-1">11/20/2025</h2>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="mb-6">
          <p className="text-xs text-dark uppercase tracking-widest mb-2">
            Current Bid
          </p>
          <p className="text-3xl font-medium text-dark mb-4">
            10.000.000.000 VND
          </p>
          <p className="text-xs text-dark mt-1 mb-2">BUY NOW</p>
          <p className="text-3xl font-medium text-dark">30.000.000.000 VND</p>
        </div>

        {/* SELLER INFO */}
        <div className="flex items-center gap-3 mb-6">
          <FaRegCircleUser className="w-10 h-10"></FaRegCircleUser>
          <div>
            <p className="text-[16px] text-dark">
              Posted by <span className="font-bold text-sm">Dreckiez</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[16px] px-1 rounded flex items-center gap-0.5">
                <ThumbsUp size={15} /> 98%
              </span>
            </div>
          </div>
        </div>

        {/* QUICK BIDS */}
        <div className="flex justify-between gap-2 mb-3">
          <button className="flex-1 border border-gray-300 rounded-full py-1 text-[10px] sm:text-xs text-gray-600 hover:border-black transition-colors">
            11.000.000.000 VND
          </button>
          <button className="flex-1 border border-gray-300 rounded-full py-1 text-[10px] sm:text-xs text-gray-600 hover:border-black transition-colors">
            12.000.000.000 VND
          </button>
        </div>

        {/* INPUT BID */}
        <div className="h-15">
          <input
            type="text"
            placeholder="10.000.000.000 VND or higher"
            className="bg-grayinput rounded-sm p-3 mb-3 hover:bg-grayinput/80 focus:ring-dark focus:ring focus:bg-grayinput/80 outline-none w-full text-sm pl-3 text-gray-600 placeholder-[#000000]/30"
          />
        </div>

        <button className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-3 rounded-sm shadow-sm transition-colors uppercase tracking-wide">
          Place Bid
        </button>

        <div className="h-23 border-y border-dark mt-6">
          <p className="text-dark/70 text-[16px] mt-2">
            CURRENT WINNING BIDDER
          </p>
          <div className="flex items-center justify-center mt-3 gap-2 w-full">
            <Crown></Crown>
            <p className="text-[20px]">Onii-chan Baka Hentiaaaa</p>
          </div>
        </div>

        {/* BIDDING HISTORY */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-700">Bidding History</h3>
          </div>

          <div className="bg-decor rounded border border-gray-100 text-xs">
            {/* Row 1 */}
            <div className="flex justify-between bg-decor p-2 border-b border-gray-100">
              <span className="text-gray-600">****Diddy (90%)</span>
              <div className="text-right">
                <span className="block text-gray-500 text-[10px]">
                  27/10/2025 10:43
                </span>
                <span className="font-semibold">10.000.000.000 VND</span>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex justify-between p-2 border-b border-gray-100 bg-decor">
              <span className="text-gray-600">****Trump (85%)</span>
              <div className="text-right">
                <span className="block text-gray-500 text-[10px]">
                  27/10/2025 10:43
                </span>
                <span className="font-semibold">9.000.000.000 VND</span>
              </div>
            </div>
            {/* Row 3 */}
            <div className="flex justify-between p-2 border-b border-gray-100 bg-decor">
              <span className="text-gray-600">****Elon (80%)</span>
              <div className="text-right">
                <span className="block text-gray-500 text-[10px]">
                  27/10/2025 10:43
                </span>
                <span className="font-semibold">8.000.000.000 VND</span>
              </div>
            </div>
            {/* Row 4 */}
            <div className="flex justify-between p-2 bg-decor">
              <span className="text-gray-600">****JACK (89%)</span>
              <div className="text-right">
                <span className="block text-gray-500 text-[10px]">
                  27/10/2025 10:43
                </span>
                <span className="font-semibold">5.000.000.000 VND</span>
              </div>
            </div>
          </div>
          <button className="text-[#EFA00B] text-xs font-bold mt-2 flex items-center gap-1">
            See all bids <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
