import React from "react";
import {
  Heart,
  Search,
  User,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ChevronRight,
} from "lucide-react";

export default function AuctionDetailPage() {
  return (
    <div className="min-h-screen text-gray-800 bg-[#F8F5F2] font-sans pb-20">
      {/* ---------------- HEADER ---------------- */}
      <header className="w-full bg-[#1A1A1A] text-white h-16 flex justify-between items-center px-4 md:px-8 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {/* Logo placeholder */}
            <span className="text-2xl font-serif font-bold tracking-wide">
              Auctiz
            </span>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden md:flex relative w-[400px]">
            <input
              type="text"
              placeholder="Search items"
              className="w-full pl-4 pr-10 py-1.5 rounded-sm text-gray-800 outline-none bg-gray-100"
            />
            <Search className="absolute right-2 top-1.5 text-gray-500 w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <span className="cursor-pointer hover:text-gray-300 hidden sm:block">
            Categories
          </span>
          <span className="cursor-pointer hover:text-gray-300 hidden sm:block">
            Watch List
          </span>

          <button className="bg-[#EFA00B] hover:bg-[#d9900a] text-black px-6 py-1.5 rounded font-bold transition-colors">
            Bids
          </button>

          <div className="p-1 bg-white rounded-full text-black">
            <User className="w-5 h-5" />
          </div>
        </div>
      </header>

      {/* ---------------- MAIN CONTENT WRAPPER ---------------- */}
      <div className="max-w-[1200px] mx-auto mt-6 px-4">
        {/* Breadcrumb */}
        <div className="text-gray-500 text-sm mb-4 flex items-center cursor-pointer hover:underline">
          <span className="mr-1">Back</span> <ChevronRight size={14} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* --------------- LEFT CONTENT (70%) --------------- */}
          <div className="flex-1 w-full lg:max-w-[65%]">
            {/* TITLE HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
                  Nikon Nikonos V + 2,8/35mm | Underwater Analogue camera
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Posted on 10/29/2025
                </p>
              </div>
              <button className="border border-black rounded-full p-2 hover:bg-gray-100">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* GALLERY SECTION */}
            <div className="mt-6 flex gap-4 h-[350px] md:h-[450px]">
              {/* MAIN IMAGE */}
              <div className="flex-1 bg-gray-200 rounded-sm overflow-hidden border border-gray-300 relative group">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="Main item"
                />
                {/* Image overlay gradient if needed */}
              </div>

              {/* THUMBNAILS (Vertical Stack) */}
              <div className="hidden sm:flex flex-col gap-3 w-24">
                <div className="w-full h-20 bg-gray-300 rounded-sm overflow-hidden border border-gray-400 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-100"
                    alt=""
                  />
                </div>
                <div className="w-full h-20 bg-gray-300 rounded-sm overflow-hidden cursor-pointer opacity-70 hover:opacity-100">
                  <img
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="w-full h-20 bg-gray-300 rounded-sm overflow-hidden cursor-pointer opacity-70 hover:opacity-100">
                  <img
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex items-center justify-center w-full h-8 bg-white border border-gray-300 cursor-pointer hover:bg-gray-50">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            {/* PRODUCT DETAILS TEXT */}
            <div className="mt-8 border-b border-gray-300 pb-8">
              <h3 className="text-lg font-bold mb-3">Product Details</h3>
              <div className="text-sm md:text-base text-gray-700 space-y-2 leading-relaxed font-sans">
                <p>
                  電源入り撮影出来ましたが細部の機能までは確認していません。
                </p>
                <p>
                  不得意ジャンルの買い取り品の為細かい確認出来る知識がありません、ご了承ください。
                </p>
                <p>
                  簡単な確認方法が有れば確認しますので方法等質問欄からお願いします、終了日の質問には答えられない場合があります。
                </p>
                <p className="mt-4 text-gray-500 text-xs">
                  ✏️ 31/10/2025 - が大きくなる事がありますがご了承下さい。
                  <br />
                  ✏️ 5/11/2025 -
                  不得意ジャンルの買い取り品の為細かい確認出来る知識がありません、ご了承ください。
                </p>
              </div>
            </div>

            {/* HAVE A QUESTION SECTION */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Have a Question?</h3>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Give a question to the seller"
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-sm outline-none focus:border-yellow-500"
                />
                <button className="bg-[#EFA00B] hover:bg-[#d9900a] text-white font-bold px-8 py-2 rounded-sm uppercase text-sm">
                  Send
                </button>
              </div>

              {/* Q&A LIST */}
              <div className="bg-[#E8E6DE] p-6 rounded-md space-y-6">
                {/* Item 1 */}
                <div className="border-b border-gray-300 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                      <User size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">
                        ChubeTeLiet:{" "}
                        <span className="font-normal text-gray-700">
                          Đế Vương phải có long ngai
                        </span>
                      </p>
                      <div className="mt-2 pl-4 border-l-2 border-gray-400">
                        <span className="font-bold text-sm text-gray-800">
                          Answer:
                        </span>{" "}
                        <span className="text-sm text-gray-600">
                          Mấy con gà thì biết gì
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="border-b border-gray-300 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                      <User size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">
                        3ker:{" "}
                        <span className="font-normal text-gray-700">
                          Trẻ con sa mạc truyền tai nhau bài đồng dao
                        </span>
                      </p>
                      <div className="mt-2 pl-4 border-l-2 border-gray-400">
                        <span className="font-bold text-sm text-gray-800">
                          Answer:
                        </span>{" "}
                        <span className="text-sm text-gray-600">
                          Xương rồng đơm lá đơm hoa. Nước đọng đầy trên cao
                          nguyên đá. Là ngày Hoàng Đế trở về nhà.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[#EFA00B] text-sm font-bold cursor-pointer flex items-center justify-center gap-1">
                    LOAD MORE <ChevronDown size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --------------- RIGHT SIDEBAR (30%) --------------- */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden sticky top-20">
              {/* BEIGE HEADER */}
              <div className="bg-[#DFD7C7] py-3 text-center border-b border-[#d4cdbf]">
                <p className="text-xs font-semibold text-gray-600 tracking-wider uppercase">
                  Ending In
                </p>
                <h2 className="text-2xl font-bold text-[#C75C5C] mt-1">
                  11/20/2025
                </h2>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Current Bid
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    10.000.000.000 VND
                  </p>
                  <p className="text-xs text-gray-400 mt-1">OR</p>
                </div>

                {/* DASHED LINE SEPARATOR */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px border-t border-dashed border-gray-400 flex-1"></div>
                  <div className="h-px border-t border-dashed border-gray-400 flex-1"></div>
                </div>

                {/* SELLER INFO */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>{" "}
                  {/* Avatar placeholder */}
                  <div>
                    <p className="text-xs text-gray-500">Posted by</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">Dreckiez</span>
                      <span className="text-xs bg-gray-100 px-1 rounded border border-gray-200 flex items-center gap-0.5">
                        <ThumbsUp size={10} /> 98%
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
                <div className="flex justify-center mb-4">
                  <button className="w-2/3 border border-gray-300 rounded-full py-1 text-[10px] sm:text-xs text-gray-600 hover:border-black transition-colors">
                    20.000.000.000 VND
                  </button>
                </div>

                {/* INPUT BID */}
                <div className="bg-[#EBEBEB] rounded-sm p-3 mb-3">
                  <input
                    type="text"
                    placeholder="10.000.000.000 VND or higher"
                    className="bg-transparent w-full outline-none text-sm text-center text-gray-600 placeholder-gray-500"
                  />
                </div>

                <button className="w-full bg-[#EFA00B] hover:bg-[#d9900a] text-white font-bold py-3 rounded-sm shadow-sm transition-colors uppercase tracking-wide">
                  Place Bid
                </button>

                {/* BIDDING HISTORY */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-gray-700">
                      Bidding History
                    </h3>
                  </div>

                  <div className="bg-[#F9F7F4] rounded border border-gray-100 text-xs">
                    {/* Row 1 */}
                    <div className="flex justify-between p-2 border-b border-gray-100">
                      <span className="text-gray-600">****Diddy (90%)</span>
                      <div className="text-right">
                        <span className="block text-gray-500 text-[10px]">
                          27/10/2025 10:43
                        </span>
                        <span className="font-semibold">
                          10.000.000.000 VND
                        </span>
                      </div>
                    </div>
                    {/* Row 2 */}
                    <div className="flex justify-between p-2 border-b border-gray-100 bg-[#F2EFE8]">
                      <span className="text-gray-600">****Trump (85%)</span>
                      <div className="text-right">
                        <span className="block text-gray-500 text-[10px]">
                          27/10/2025 10:43
                        </span>
                        <span className="font-semibold">9.000.000.000 VND</span>
                      </div>
                    </div>
                    {/* Row 3 */}
                    <div className="flex justify-between p-2 border-b border-gray-100">
                      <span className="text-gray-600">****Elon (80%)</span>
                      <div className="text-right">
                        <span className="block text-gray-500 text-[10px]">
                          27/10/2025 10:43
                        </span>
                        <span className="font-semibold">8.000.000.000 VND</span>
                      </div>
                    </div>
                    {/* Row 4 */}
                    <div className="flex justify-between p-2 bg-[#F2EFE8]">
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
          </div>
        </div>

        {/* ---------------- SIMILAR ITEMS ---------------- */}
        <div className="mt-16 pb-10">
          <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-300 pb-2">
            Similar Items
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="relative group rounded-md overflow-hidden cursor-pointer shadow-md aspect-[4/5]"
              >
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt="Similar"
                />
                {/* OVERLAY CONTENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3 text-white">
                  <h4 className="font-bold text-sm leading-tight mb-1">
                    Fuji GS645 Professional Wide 60
                  </h4>
                  <p className="text-xs text-gray-300 mb-2">Current Bid</p>
                  <p className="text-[#EFA00B] font-bold text-lg mb-2">
                    10.350.000 VND
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2">
                    <span>🔨 3.000.000</span>
                    <span>End in: 11/10/2025</span>
                  </div>
                  <button className="w-full bg-[#EFA00B] text-black font-bold py-1.5 rounded text-sm hover:bg-yellow-500">
                    Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
