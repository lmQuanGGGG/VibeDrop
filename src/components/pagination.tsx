import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    return `${basePath}?page=${pageNumber}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8 font-mono font-bold">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center border-4 border-black bg-white hover:bg-[#c8f560] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-px active:translate-x-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center border-4 border-neutral-300 bg-neutral-100 text-neutral-400 opacity-50 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2 max-sm:hidden">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`w-10 h-10 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                isActive
                  ? "bg-black text-[#c8f560]"
                  : "bg-white hover:bg-[#c8f560] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:translate-x-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>
      
      {/* Mobile Current Page */}
      <div className="sm:hidden flex items-center justify-center w-auto px-4 h-10 border-4 border-black bg-black text-[#c8f560] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center border-4 border-black bg-white hover:bg-[#c8f560] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-px active:translate-x-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center border-4 border-neutral-300 bg-neutral-100 text-neutral-400 opacity-50 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
