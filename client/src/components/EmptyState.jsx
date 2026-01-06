import React from 'react';
import { SearchX } from 'lucide-react'; // An icon representing "search failed"

const EmptyState = ({ title = "No results found", description = "Try adjusting your search or filters to find what you're looking for." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon with a subtle gray color */}
      <SearchX size={64} className="text-gray-300 mb-4" strokeWidth={1.5} />
      
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;