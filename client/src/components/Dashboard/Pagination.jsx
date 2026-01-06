export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];
    
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1, 2, 3);
        pages.push('...');
        pages.push(totalPages - 2, totalPages - 1, totalPages);
    }

    return (
        <div className="px-6 py-[1.78rem] border-t border-gray-200 flex items-center justify-center gap-2">
            {pages.map((page, idx) => (
                page === '...' ? (
                    <span key={idx} className="px-2 text-gray-400">...</span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                        currentPage === page
                            ? 'bg-primary text-light'
                            : 'bg-gray-200 text-dark hover:bg-gray-300 cursor-pointer'
                        }`}
                    >
                        {page}
                    </button>
                )
            ))}
        </div>
    );
}