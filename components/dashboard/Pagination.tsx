type PaginationProps = {
    paging:{
        currentPage: number;
        totalPages: number;
        first: boolean;
        last: boolean;
        hasNext: boolean;
        hasPrevious: boolean;
    }
    onPageChange: (page:number) => void;
};
import { Button } from "@/components/ui/button";

export default function Pagination({
                                       paging,
                                       onPageChange,
}: PaginationProps) {

    const { currentPage, totalPages, first, last, hasNext, hasPrevious } = paging;

  return (
    <div className="flex items-center justify-center gap-1 py-6 text-sm text-slate-600 dark:text-slate-300">
      {/* First */}
      <button
          className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => onPageChange(1)}
          disabled={first}
      >
        &laquo;
      </button>

      {/* Prev */}
      <button
          className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
      >
        &lsaquo;
      </button>

      {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p >= currentPage - 2 && p <= currentPage + 2) // ⭐ 주변 5개만
            .map((page) => (
                <Button
                    key={page}
                    onClick={() => onPageChange(page)} // ⭐ 클릭 시 페이지 변경
                    className={`px-4 py-1 rounded ${
                        page === currentPage
                            ? "bg-blue-800 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                    {page}
                </Button>
        ))}

      {/* Ellipsis */}
      <span className="px-2">…</span>

      {/* Last Page */}
      <button className="px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
        {totalPages}
      </button>

      {/* Next */}
      <button
          className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
      >
        &rsaquo;
      </button>

      {/* Last */}
      <button
          className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={last}
      >
        &raquo;
      </button>
    </div>
  );
}
