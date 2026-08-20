import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { FinancialReportRange } from "@/types/admin-financial-report";

type ReportControlsProps = {
  range: FinancialReportRange;
};

const periodOptions = [
  { value: "day", label: "Günlük" },
  { value: "week", label: "Haftalık" },
  { value: "month", label: "Aylık" },
] as const;

function createReportUrl(period: string, date: string) {
  return `/admin/reports?period=${period}&date=${date}`;
}

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "UTC",
    ...options,
  }).format(new Date(`${value}T00:00:00Z`));
}

function getRangeLabel(range: FinancialReportRange) {
  if (range.period === "day") {
    return formatDate(range.startDate, {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  }

  if (range.period === "month") {
    return formatDate(range.startDate, { month: "long", year: "numeric" });
  }

  return `${formatDate(range.startDate, { day: "numeric", month: "short" })} – ${formatDate(
    range.endDate,
    { day: "numeric", month: "short", year: "numeric" },
  )}`;
}

export function ReportControls({ range }: ReportControlsProps) {
  return (
    <div className="mt-6 border border-[#E3E0D8] bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid grid-cols-3 gap-1 bg-[#F3F1EB] p-1 sm:w-fit">
          {periodOptions.map((option) => (
            <Link
              key={option.value}
              href={createReportUrl(option.value, range.anchorDate)}
              className={`flex h-10 items-center justify-center px-4 text-[11px] font-semibold transition-colors ${
                range.period === option.value
                  ? "bg-[#263A2D] text-white"
                  : "text-[#687067] hover:bg-white"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <Link
            href={createReportUrl(range.period, range.previousAnchor)}
            aria-label="Önceki dönem"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#DDD9D1] text-[#263A2D] hover:bg-[#F7F5EF]"
          >
            <ChevronLeft size={17} />
          </Link>

          <p className="min-w-0 flex-1 px-2 text-center text-sm font-semibold capitalize text-[#263A2D] sm:min-w-[260px]">
            {getRangeLabel(range)}
          </p>

          <Link
            href={createReportUrl(range.period, range.nextAnchor)}
            aria-label="Sonraki dönem"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#DDD9D1] text-[#263A2D] hover:bg-[#F7F5EF]"
          >
            <ChevronRight size={17} />
          </Link>
        </div>

        <form className="flex min-w-0 gap-2" action="/admin/reports" method="get">
          <input type="hidden" name="period" value={range.period} />
          <input
            type="date"
            name="date"
            defaultValue={range.anchorDate}
            aria-label="Rapor tarihi"
            className="h-10 min-w-0 flex-1 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none focus:border-[#263A2D] sm:w-[170px] sm:text-xs"
          />
          <button
            type="submit"
            className="h-10 shrink-0 bg-[#263A2D] px-4 text-[11px] font-semibold text-white"
          >
            Göster
          </button>
        </form>
      </div>
    </div>
  );
}
