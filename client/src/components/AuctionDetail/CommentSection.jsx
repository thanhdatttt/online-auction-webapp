import React from "react";
import { User, ChevronDown } from "lucide-react";
import { FaRegCircleUser } from "react-icons/fa6";
const CommentSection = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Have a Question?</h3>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Give a question to the seller"
          className="flex-1 border border-gray-300 px-4 py-2 rounded-sm outline-none focus:border-dark focus:bg-light/50"
        />
        <button className="bg-[#EFA00B] hover:bg-[#d9900a] text-white font-bold px-8 py-2 rounded-sm uppercase text-sm">
          Send
        </button>
      </div>

      {/* Q&A LIST */}
      <div className="bg-decor p-6 rounded-md space-y-6">
        {/* Item 1 */}
        <div className="border-b border-gray-300 pb-4 last:border-0 last:pb-0">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <FaRegCircleUser className="w-16 h-16"></FaRegCircleUser>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">
                ChubeTeLiet:{" "}
                <span className="font-normal text-gray-700">
                  Đế Vương phải có long ngai
                </span>
              </p>
              <div className="mt-2 pl-4 border-l-2 border-gray-400">
                <span className="font-bold text-sm text-gray-800">Answer:</span>{" "}
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <FaRegCircleUser className="w-16 h-16"></FaRegCircleUser>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">
                3ker:{" "}
                <span className="font-normal text-gray-700">
                  Trẻ con sa mạc truyền tai nhau bài đồng dao
                </span>
              </p>
              <div className="mt-2 pl-4 border-l-2 border-gray-400">
                <span className="font-bold text-sm text-gray-800">Answer:</span>{" "}
                <span className="text-sm text-gray-600">
                  Xương rồng đơm lá đơm hoa. Nước đọng đầy trên cao nguyên đá.
                  Là ngày Hoàng Đế trở về nhà.
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
  );
};

export default CommentSection;
