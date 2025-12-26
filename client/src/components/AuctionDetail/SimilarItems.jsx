import React, { useState, useEffect } from "react";
import AuctionCard from "../AuctionCard.jsx";
import { useParams } from "react-router";
import Loading from "../Loading.jsx";
import Error from "../Error.jsx";
import api from "../../utils/axios.js";
const SimilarItems = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  const [similarItems, setSimilarItems] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const loadSimilarItems = async () => {
      try {
        setIsLoading(true);

        setError(null);

        const res = await api.get(`guest/auctions/${id}/similar-items`);

        if (isMounted) setSimilarItems(res.data.data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSimilarItems();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <div className="mt-16 pb-10">
        {isLoading && <Loading></Loading>}

        {error && <Error message={error}></Error>}
        {!isLoading && !error && (
          <>
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-300 pb-2">
              Similar Items
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
              {similarItems.map((item, index) => (
                <AuctionCard key={index} auction={item}></AuctionCard>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SimilarItems;
