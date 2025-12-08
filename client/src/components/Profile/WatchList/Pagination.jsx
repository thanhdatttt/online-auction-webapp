import { memo, useCallback, useMemo } from "react";

const PageButton = memo(({ page, active, onClick }) => {
  if (page === "...") {
    return <span className="px-3 py-3">...</span>;
  }

  return (
    <button
      onClick={() => onClick(page)}
      className={`
        w-12 h-12 rounded-md border flex items-center justify-center cursor-pointer
        ${active ? "bg-black text-white" : "bg-white hover:bg-gray-400"}
      `}
    >
      {page}
    </button>
  );
});

const Pagination = ({ totalPages, currentPage, onPageChange }) => {

  //  handle change page
  const handleClick = useCallback((page) => {
    if (page !== "..." && page !== currentPage) 
      onPageChange(page);
  }, [onPageChange, currentPage]);

  // calculate pages  
  const pages = useMemo(() => {
    const result = [];

    const FIRST = 1;
    const LAST = totalPages;

    // Always include first page
    result.push(FIRST);

    // Determine dynamic window around current page
    let start = currentPage - 2;
    let end = currentPage + 2;

    if (start <= 2) start = 2;
    if (end >= LAST - 1) end = LAST - 1;

    // Add ellipsis after first if needed
    if (start > 2) {
      result.push("...");
    }

    // Add pages in window
    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    // Add ellipsis before last if needed
    if (end < LAST - 1) {
      result.push("...");
    }

    // Always include last page
    if (LAST > 1) {
      result.push(LAST);
    }

    return result;
  }, [currentPage, totalPages]);

  return (
    <div className="flex gap-2">
      {pages.map((page, index) => (
        <PageButton
          key={index}
          page={page}
          active={page === currentPage}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};

export default memo(Pagination);