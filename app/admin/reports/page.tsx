import { BarChart3 } from "lucide-react";

import { DailyPerformance } from "@/components/admin/financial-reports/daily-performance";
import { RecentPayments } from "@/components/admin/financial-reports/recent-payments";
import { ReportBreakdowns } from "@/components/admin/financial-reports/report-breakdowns";
import { ReportControls } from "@/components/admin/financial-reports/report-controls";
import { ReportSummary } from "@/components/admin/financial-reports/report-summary";

import {
  getAdminFinancialReport,
  getFinancialReportRange,
  parseFinancialReportDate,
  parseFinancialReportPeriod,
} from "@/lib/admin/financial-report";

type ReportsPageProps = {
  searchParams: Promise<{
    period?: string;
    date?: string;
  }>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const period = parseFinancialReportPeriod(params.period);
  const anchorDate = parseFinancialReportDate(params.date);
  const range = getFinancialReportRange(period, anchorDate);
  const { report, error } = await getAdminFinancialReport(range.startDate, range.endDate);

  return (
    <section>
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#E9EDE6] text-[#526048]">
          <BarChart3 size={20} />
        </div>
        <div>
          <p className="text-xs text-[#8B8E87]">Finans ve Doluluk</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
            Gelir Raporları
          </h1>
          <p className="mt-2 max-w-[760px] text-sm leading-6 text-[#71756E]">
            Gerçek tahsilatları, kalan alacakları ve fiziksel oda doluluğunu günlük, haftalık veya
            aylık takip edin.
          </p>
        </div>
      </div>

      <ReportControls range={range} />

      {error || !report ? (
        <div className="mt-5 border border-[#E7D6D1] bg-[#F8EEEA] px-5 py-14 text-center">
          <h2 className="text-sm font-semibold text-[#8A5147]">Rapor yüklenemedi</h2>
          <p className="mt-2 text-xs leading-5 text-[#9B746D]">
            {error ?? "Rapor verisi alınamadı."}
          </p>
        </div>
      ) : (
        <>
          <ReportSummary summary={report.summary} />
          <DailyPerformance days={report.daily} />
          <ReportBreakdowns
            accommodations={report.accommodations}
            paymentMethods={report.paymentMethods}
          />
          <RecentPayments payments={report.recentPayments} />

          <div className="mt-5 border border-[#E3E0D8] bg-[#FAF9F6] px-4 py-3 text-[10px] leading-5 text-[#777D75]">
            Gelir yalnızca onaylanmış tahsilatlardan hesaplanır. Rezervasyon değeri henüz tahsil
            edilmemiş tutarları da içerebilir. Doluluk, onaylanmış rezervasyonların fiziksel
            oda-gece kullanımına göre hesaplanır.
          </div>
        </>
      )}
    </section>
  );
}
