import React from "react";
import { ChevronRight } from "lucide-react";
import Header from "../Header.jsx";
import Product from "./Product.jsx";
import CommentSection from "./CommentSection.jsx";
import RightSideBar from "./RightSideBar.jsx";
import SimilarItems from "./SimilarItems.jsx";

const AuctionDetailLayout = () => {
  return (
    <div className="min-h-screen text-gray-800 bg-light font-lato pb-20">
      {/* ---------------- HEADER ---------------- */}
      <Header></Header>

      {/* ---------------- MAIN CONTENT WRAPPER ---------------- */}
      <div className="max-w-[1200px] mx-auto pt-32 px-4">
        {/* Breadcrumb */}
        <div className="text-gray-500 text-sm mb-4 flex items-center cursor-pointer hover:underline">
          <span className="mr-1">Back</span> <ChevronRight size={14} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* --------------- LEFT CONTENT (70%) --------------- */}
          <div className="flex-1 w-full lg:max-w-[65%]">
            {/*Product */}
            <Product></Product>

            {/* HAVE A QUESTION SECTION */}
            <CommentSection></CommentSection>
          </div>

          {/* --------------- RIGHT SIDEBAR (30%) --------------- */}
          <div className="w-full lg:w-[35%]">
            <RightSideBar></RightSideBar>
          </div>
        </div>

        {/* ---------------- SIMILAR ITEMS ---------------- */}
        <SimilarItems></SimilarItems>
      </div>
    </div>
  );
};

export default AuctionDetailLayout;
