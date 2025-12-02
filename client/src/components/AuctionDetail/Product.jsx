import React from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
const Product = () => {
  return (
    <>
      {/* TITLE HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
            Nikon Nikonos V + 2,8/35mm | Underwater Analogue camera
          </h1>
          <p className="text-sm text-gray-500 mt-1">Posted on 10/29/2025</p>
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
        <div className="flex flex-col gap-3 w-24 h-full justify-center">
          <div className="flex items-center justify-center w-full h-8 cursor-pointer hover:bg-gray-50">
            <ChevronUp size={20} />
          </div>
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
          <div className="flex items-center justify-center w-full h-8 cursor-pointer hover:bg-gray-50">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* PRODUCT DETAILS TEXT */}
      <div className="mt-8 border-b border-gray-300 pb-8">
        <h3 className="text-lg font-bold mb-3">Product Details</h3>
        <div className="text-sm md:text-base text-gray-700 space-y-2 leading-relaxed font-sans border-t border-gray-300 pt-3">
          <p>電源入り撮影出来ましたが細部の機能までは確認していません。</p>
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
    </>
  );
};

export default Product;
