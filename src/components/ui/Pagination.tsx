import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from(
    { length: Math.max(1, totalPages) },
    (_, i) => i + 1,
  );

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Föregående
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition shadow-sm ${
              page === currentPage
                ? "bg-purple-600 text-white border border-purple-600"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition"
      >
        Nästa
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
