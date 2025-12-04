import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Header from "../Header.jsx";
import Product from "./Product.jsx";
import CommentSection from "./CommentSection.jsx";
import RightSideBar from "./RightSideBar.jsx";
import SimilarItems from "./SimilarItems.jsx";
import { useParams } from "react-router";
import api from "../../utils/axios.js";
import Error from "../Error.jsx";
import { socket } from "../../utils/socket.js";
const AuctionDetailLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  const [auction, setAuction] = useState({});

  const [seller, setSeller] = useState({});

  const [currentPrice, setCurrentPrice] = useState(null);

  const [dataWinner, setDataWinner] = useState({});

  const [endTime, setEndTime] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const loadAuction = async () => {
      try {
        setIsLoading(true);

        setError(null);

        const res = await api.get(`guest/auctions/${id}`);

        if (isMounted) {
          setAuction(res.data.auction);
          setSeller(res.data.seller);
          setDataWinner(res.data.dataWinner);
          setEndTime(res.data.auction.endTime);
        }
        if (!socket.connected) socket.connect();

        socket.emit("joinAuction", id);

        socket.on("priceUpdate", (newCurrentPrice) => {
          if (isMounted) setCurrentPrice(newCurrentPrice);
        });
        socket.on("winnerUpdate", (newDataWinner) => {
          if (isMounted) setDataWinner(newDataWinner);
        });
        socket.on("endTimeUpdate", (newEndTime) => {
          if (isMounted) setEndTime(newEndTime);
        });
      } catch (err) {
        if (isMounted) setError(err.message);
        console.log(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAuction();

    return () => {
      isMounted = false;
      socket.off("priceUpdate");
      socket.off("winnerUpdate");
      socket.off("endTimeUpdate");
    };
  }, [id]);

  return (
    <>
      {isLoading && <p>loading......</p>}
      {error && <Error message={error}></Error>}
      {!isLoading && !error && (
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
                <Product
                  p={auction.product}
                  postedOn={auction.startTime}
                ></Product>

                {/* HAVE A QUESTION SECTION */}
                <CommentSection
                  seller={seller}
                  endTime={endTime}
                ></CommentSection>
              </div>

              {/* --------------- RIGHT SIDEBAR (30%) --------------- */}
              <div className="w-full lg:w-[35%]">
                <RightSideBar
                  auction={auction}
                  seller={seller}
                  currentPrice={currentPrice}
                  dataWinner={dataWinner}
                  endTime={endTime}
                ></RightSideBar>
              </div>
            </div>

            {/* ---------------- SIMILAR ITEMS ---------------- */}
            <SimilarItems></SimilarItems>
          </div>
        </div>
      )}
    </>
  );
};

export default AuctionDetailLayout;
