import { formatPrice } from "@/lib/formatters/price";

import type { FinancialReportDay } from "@/types/admin-financial-report";

type DailyPerformanceProps = {
  days: FinancialReportDay[];
};

function formatDay(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    weekday: "short",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function DailyPerformance({ days }: DailyPerformanceProps) {
  const maxRevenue = Math.max(...days.map((day) => day.revenue), 1);

  return (
    <section className="mt-6 border border-[#E3E0D8] bg-white">
      <div className="border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
        <h2 className="text-sm font-semibold text-[#263A2D]">Günlük Performans</h2>
        <p className="mt-1 text-[10px] text-[#969990]">
          Tahsilat, dolu oda ve giriş-çıkış hareketleri
        </p>
      </div>

      <div className="overflow-x-auto p-4 sm:p-5">
        <div className="flex min-w-[680px] items-end gap-2 border-b border-[#E8E4DC] pb-4">
          {days.map((day) => {
            const revenueHeight = Math.max(
              (day.revenue / maxRevenue) * 128,
              day.revenue > 0 ? 8 : 2,
            );

            return (
              <div key={day.date} className="flex min-w-[42px] flex-1 flex-col items-center">
                <p className="mb-2 text-[9px] font-semibold text-[#526048]">
                  %{day.occupancyRate.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
                </p>
                <div className="flex h-32 w-full items-end justify-center bg-[#F7F5EF]">
                  <div
                    title={`${formatDay(day.date)}: ${formatPrice(day.revenue)}`}
                    className="w-full max-w-8 bg-[#A8754F]"
                    style={{ height: `${revenueHeight}px` }}
                  />
                </div>
                <p className="mt-2 whitespace-nowrap text-[9px] capitalize text-[#7C817A]">
                  {formatDay(day.date)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto border-t border-[#ECE8E1]">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="bg-[#FAF9F6] text-left text-[9px] uppercase tracking-[0.08em] text-[#969990]">
              <th className="px-4 py-3 font-medium">Gün</th>
              <th className="px-4 py-3 font-medium">Tahsilat</th>
              <th className="px-4 py-3 font-medium">Dolu Oda</th>
              <th className="px-4 py-3 font-medium">Doluluk</th>
              <th className="px-4 py-3 font-medium">Giriş</th>
              <th className="px-4 py-3 font-medium">Çıkış</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date} className="border-t border-[#F0EDE7] text-xs text-[#596058]">
                <td className="px-4 py-3 font-medium capitalize text-[#263A2D]">
                  {formatDay(day.date)}
                </td>
                <td className="px-4 py-3 font-semibold text-[#263A2D]">
                  {formatPrice(day.revenue)}
                </td>
                <td className="px-4 py-3">{day.occupiedRooms}</td>
                <td className="px-4 py-3">
                  %{day.occupancyRate.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
                </td>
                <td className="px-4 py-3">{day.checkIns}</td>
                <td className="px-4 py-3">{day.checkOuts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
