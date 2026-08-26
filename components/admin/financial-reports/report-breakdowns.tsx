import { CreditCard, House } from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";

import type {
  FinancialReportAccommodation,
  FinancialReportPaymentMethod,
  FinancialReportPeriod,
} from "@/types/admin-financial-report";

type ReportBreakdownsProps = {
  accommodations: FinancialReportAccommodation[];
  paymentMethods: FinancialReportPaymentMethod[];
  period: FinancialReportPeriod;
  dayCount: number;
};

const paymentMethodLabels: Record<FinancialReportPaymentMethod["method"], string> = {
  bank_transfer: "Havale / EFT",
  cash: "Nakit",
  card: "Kart",
  other: "Diğer",
};

function formatRate(value: number) {
  return `%${value.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`;
}

export function ReportBreakdowns({
  accommodations,
  paymentMethods,
  period,
  dayCount,
}: ReportBreakdownsProps) {
  const totalPaymentAmount = paymentMethods.reduce((total, item) => total + item.amount, 0);
  const normalizedDayCount = Math.max(dayCount, 1);
  const isDaily = period === "day";

  const totalLabel = isDaily ? "Toplam Oda" : "Toplam Oda-Gece";
  const occupiedLabel = isDaily ? "Verilen Oda" : "Verilen Oda-Gece";
  const emptyLabel = isDaily ? "Boş Oda" : "Boş Oda-Gece";

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="min-w-0 border border-[#E3E0D8] bg-white">
        <div className="flex items-center gap-3 border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
          <div className="flex h-9 w-9 items-center justify-center bg-[#EEF0EA] text-[#526048]">
            <House size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#263A2D]">Oda Durumu</h2>
            <p className="mt-1 text-[10px] text-[#969990]">
              Kaç oda kullanıldı, kaç oda boş kaldı ve ne kadar tahsilat yapıldı
            </p>
          </div>
        </div>

        {accommodations.length > 0 ? (
          <>
            <div className="divide-y divide-[#F0EDE7] md:hidden">
              {accommodations.map((item) => {
                const totalCapacity = isDaily
                  ? item.activeRoomCount
                  : item.activeRoomCount * normalizedDayCount;

                const occupied = item.soldRoomNights;
                const empty = Math.max(totalCapacity - occupied, 0);

                return (
                  <article key={item.accommodationId} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-[#263A2D]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[9px] text-[#969990]">
                          {formatRate(item.occupancyRate)} doluluk
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-[#263A2D]">
                        {formatPrice(item.revenue)}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <Metric label={totalLabel} value={totalCapacity.toLocaleString("tr-TR")} />
                      <Metric
                        label={occupiedLabel}
                        value={occupied.toLocaleString("tr-TR")}
                        emphasis
                      />
                      <Metric label={emptyLabel} value={empty.toLocaleString("tr-TR")} />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="bg-[#FAF9F6] text-left text-[9px] uppercase tracking-[0.08em] text-[#969990]">
                    <th className="px-5 py-3 font-medium">Konaklama</th>
                    <th className="px-4 py-3 text-right font-medium">{totalLabel}</th>
                    <th className="px-4 py-3 text-right font-medium">{occupiedLabel}</th>
                    <th className="px-4 py-3 text-right font-medium">{emptyLabel}</th>
                    <th className="px-4 py-3 text-right font-medium">Doluluk</th>
                    <th className="px-5 py-3 text-right font-medium">Net Tahsilat</th>
                  </tr>
                </thead>

                <tbody>
                  {accommodations.map((item) => {
                    const totalCapacity = isDaily
                      ? item.activeRoomCount
                      : item.activeRoomCount * normalizedDayCount;

                    const occupied = item.soldRoomNights;
                    const empty = Math.max(totalCapacity - occupied, 0);

                    return (
                      <tr
                        key={item.accommodationId}
                        className="border-t border-[#F0EDE7] text-xs text-[#596058]"
                      >
                        <td className="px-5 py-4 font-semibold text-[#263A2D]">{item.title}</td>

                        <td className="px-4 py-4 text-right">
                          {totalCapacity.toLocaleString("tr-TR")}
                        </td>

                        <td className="px-4 py-4 text-right font-semibold text-[#263A2D]">
                          {occupied.toLocaleString("tr-TR")}
                        </td>

                        <td className="px-4 py-4 text-right font-semibold text-[#8A5147]">
                          {empty.toLocaleString("tr-TR")}
                        </td>

                        <td className="px-4 py-4 text-right font-semibold text-[#526048]">
                          {formatRate(item.occupancyRate)}
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-[#263A2D]">
                          {formatPrice(item.revenue)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!isDaily && (
              <div className="border-t border-[#ECE8E1] bg-[#FAF9F6] px-4 py-3 sm:px-5">
                <p className="text-[9px] leading-4 text-[#8A8E87]">
                  Haftalık ve aylık görünümde oda durumu oda-gece üzerinden hesaplanır. Örneğin 6
                  oda × 7 gün = 42 toplam oda-gece kapasitesi.
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="px-5 py-12 text-center text-xs text-[#969990]">
            Bu dönemde veri bulunmuyor.
          </p>
        )}
      </section>

      <section className="border border-[#E3E0D8] bg-white">
        <div className="flex items-center gap-3 border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
          <div className="flex h-9 w-9 items-center justify-center bg-[#F4EEE7] text-[#A8754F]">
            <CreditCard size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#263A2D]">Ödeme Yöntemleri</h2>
            <p className="mt-1 text-[10px] text-[#969990]">Tahsilatın dağılımı</p>
          </div>
        </div>

        {paymentMethods.length > 0 ? (
          <div className="space-y-5 p-4 sm:p-5">
            {paymentMethods.map((item) => {
              const ratio = totalPaymentAmount > 0 ? (item.amount / totalPaymentAmount) * 100 : 0;

              return (
                <div key={item.method}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#263A2D]">
                        {paymentMethodLabels[item.method]}
                      </p>
                      <p className="mt-1 text-[9px] text-[#969990]">{item.paymentCount} ödeme</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-[#263A2D]">
                        {formatPrice(item.amount)}
                      </p>
                      <p className="mt-1 text-[9px] text-[#969990]">
                        %{ratio.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden bg-[#EEECE6]">
                    <div
                      className="h-full bg-[#A8754F]"
                      style={{ width: `${Math.min(Math.max(ratio, 0), 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-xs text-[#969990]">Bu dönemde ödeme yok.</p>
        )}
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-[#F7F5EF] px-2.5 py-2.5">
      <p className="text-[8px] text-[#969990]">{label}</p>
      <p
        className={`mt-1 text-base font-semibold ${emphasis ? "text-[#263A2D]" : "text-[#596058]"}`}
      >
        {value}
      </p>
    </div>
  );
}
