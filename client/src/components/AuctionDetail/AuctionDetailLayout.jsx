import { useEffect, useState } from "react";
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
import Loading from "../Loading.jsx";
import { useAuthStore } from "../../stores/useAuth.store.js";
const AuctionDetailLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  const [auction, setAuction] = useState({});

  const [seller, setSeller] = useState({});

  const [currentPrice, setCurrentPrice] = useState(null);

  const [dataWinner, setDataWinner] = useState({});

  const [endTime, setEndTime] = useState(null);

  const { id } = useParams();

  const [similarItems, setSimilarItems] = useState();

  const [showAlert, setShowAlert] = useState(null);

  const [isAllowed, setIsAllowed] = useState(null);

  const { accessToken } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const loadAuction = async () => {
      try {
        setIsLoading(true);

        setError(null);

        console.log(accessToken);

        const res = await api.get(`guest/auctions/${id}`);

        if (isMounted) {
          setAuction(res.data.auction);
          setSeller(res.data.seller);
          setDataWinner(res.data.dataWinner);
          setEndTime(res.data.auction.endTime);
          setShowAlert(res.data.showAlert);
          setIsAllowed(!res.data.showAlert);
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
      socket.disconnect();
    };
  }, [id, accessToken]);

  const handleCloseShowAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      {isLoading && <Loading />}
      {error && <Error message={error}></Error>}
      {!isLoading && !error && (
        <>
          {showAlert && (
            <div
              className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/40 backdrop-blur-sm
  "
            >
              <div
                id="toast-warning"
                className="
      w-full max-w-sm p-5
      text-sm text-yellow-900
      bg-yellow-50
      border border-yellow-300
      rounded-lg
      shadow-xl
    "
                role="alert"
              >
                <h3 className="font-semibold text-yellow-800">
                  ⚠ Action not allowed
                </h3>

                <div className="mt-2 mb-4 leading-relaxed">
                  Your current rating does not meet the minimum requirement to
                  place a bid in this auction.
                  <br />
                  <span className="font-medium">
                    Please improve your rating to continue participating in
                    auctions.
                  </span>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => handleCloseShowAlert()}
                    type="button"
                    className="
          inline-flex items-center
          text-white
          bg-yellow-600
          hover:bg-yellow-700
          focus:ring-4 
          font-medium
          rounded-md
          text-xs px-3 py-1.5
        "
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    isAllowed={isAllowed}
                  ></RightSideBar>
                </div>
              </div>

              {/* ---------------- SIMILAR ITEMS ---------------- */}
              <SimilarItems></SimilarItems>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AuctionDetailLayout;
