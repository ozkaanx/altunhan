import { ChevronLeft, ChevronRight } from "lucide-react";

type ReservationsPaginationProps = {
  currentPage: number;
  totalPages: number;
  visiblePages: number[];
  onPageChange: (page: number) => void;
};

export function ReservationsPagination({
  currentPage,
  totalPages,
  visiblePages,
  onPageChange,
}: ReservationsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-[#E3E0D8] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-[#8B8E87]">
        Sayfa <span className="font-semibold text-[#263A2D]">{currentPage}</span> / {totalPages}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Önceki sayfa"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-9 items-center gap-1 border border-[#DDD9D1] bg-white px-3 text-xs text-[#263A2D] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />

          <span className="hidden sm:inline">Önceki</span>
        </button>

        {visiblePages.map((page, index) => {
          const previous = visiblePages[index - 1];

          const showDots = previous && page - previous > 1;

          return (
            <div key={page} className="flex items-center gap-1.5">
              {showDots && <span className="px-1 text-xs text-[#969990]">…</span>}

              <button
                type="button"
                aria-label={`${page}. sayfaya git`}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange(page)}
                className={`flex h-9 min-w-9 items-center justify-center border px-2 text-xs font-medium ${
                  page === currentPage
                    ? "border-[#263A2D] bg-[#263A2D] text-white"
                    : "border-[#DDD9D1] bg-white text-[#263A2D]"
                }`}
              >
                {page}
              </button>
            </div>
          );
        })}

        <button
          type="button"
          aria-label="Sonraki sayfa"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-9 items-center gap-1 border border-[#DDD9D1] bg-white px-3 text-xs text-[#263A2D] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Sonraki</span>

          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
