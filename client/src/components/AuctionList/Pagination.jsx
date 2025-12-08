import { useSearchParams } from 'react-router';

const Pagination = ({ currentPage, totalPages }) => {
  if (totalPages <= 1) return null;

  const [searchParams, setSearchParams] = useSearchParams();

  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 1; 

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (showLeftDots && !showRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [1, '...', ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, '...', ...middleRange, '...', totalPages];
    }
  };

  const handlePageChange = (e, page) => {
    e.stopPropagation();
    searchParams.set("page", page);
    setSearchParams(searchParams);
  }

  const pages = getPageNumbers();
  return (
    <div className="flex justify-center items-center space-x-2 font-lato">
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={index} className="px-2 text-dark select-none">
              ...
            </span>
          );
        }

        return (
          <button
            key={index}
            onClick={(e) => handlePageChange(e, page)}
            className={`w-10 h-10 rounded-lg font-bold transition-all focus:outline-none ${
              currentPage === page
                ? 'bg-primary text-dark shadow-lg scale-105 cursor-default' // Active
                : 'bg-dark text-gray-100 hover:bg-primary cursor-pointer' // Inactive
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;