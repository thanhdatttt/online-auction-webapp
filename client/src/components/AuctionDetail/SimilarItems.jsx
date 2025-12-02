import React from "react";
import ProductCard from "../ProductCard";

const SimilarItems = () => {
  return (
    <div className="mt-16 pb-10">
      <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-300 pb-2">
        Similar Items
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <ProductCard></ProductCard>
        ))}
      </div>
    </div>
  );
};

export default SimilarItems;
