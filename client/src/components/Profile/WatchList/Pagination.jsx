import React from 'react'

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;

  let visiblePages = pages;
  if (pages.length > maxVisiblePages) {
    const startIndex = Math.max(0, currentPage - 2);
    visiblePages = pages.slice(startIndex, startIndex + maxVisiblePages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-md border flex items-center justify-center
            ${currentPage === page ? "bg-black text-white" : "bg-white"}
          `}
        >
          {page}
        </button>
      ))}
      {pages.length > maxVisiblePages && visiblePages[visiblePages.length - 1] < pages.length && (
        <>
          <span className="px-2">...</span>
          <button
            key={pages.length} 
            onClick={() => onPageChange(pages.length)}
            className={`w-10 h-10 rounded-md border flex items-center justify-center
              ${currentPage === pages.length ? "bg-black text-white" : "bg-white"}
            `}
          >
            {pages.length}
          </button>
        </>
      )}
    </div>
  );
}

export default Pagination;