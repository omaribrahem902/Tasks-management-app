import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={currentPage === 1}
        className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              onClick={() =>
                onPageChange(page)
              }
              className={`w-8 h-8 rounded-md border font-semibold text-xs transition-colors
                ${
                  currentPage === page
                    ? "bg-blue-700 text-white border-blue-700"
                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
            >
              {page}
            </button>
          );
        }
      )}

      <button
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={
          currentPage === totalPages
        }
        className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;