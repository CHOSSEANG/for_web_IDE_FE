type PaginationProps = {
  currentPage: number;
  totalPages: number;
};
import { Button } from "@/components/ui/button";

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1 py-6 text-sm text-slate-600 dark:text-slate-300">
      {/* First */}
      <button className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
        &laquo;
      </button>

      {/* Prev */}
      <button className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
        &lsaquo;
      </button>

      {/* Page Numbers */}
      {[1, 2, 3, 4, 5].map((page) => (
        <Button
          key={page}
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
      <button className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
        &rsaquo;
      </button>

      {/* Last */}
      <button className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
        &raquo;
      </button>
    </div>
  );
}
