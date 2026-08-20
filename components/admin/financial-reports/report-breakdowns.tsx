import { CreditCard, House } from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";

import type {
  FinancialReportAccommodation,
  FinancialReportPaymentMethod,
} from "@/types/admin-financial-report";

type ReportBreakdownsProps = {
  accommodations: FinancialReportAccommodation[];
  paymentMethods: FinancialReportPaymentMethod[];
};

const paymentMethodLabels: Record<FinancialReportPaymentMethod["method"], string> = {
  bank_transfer: "Havale / EFT",
  cash: "Nakit",
  card: "Kart",
  other: "Diğer",
};

export function ReportBreakdowns({ accommodations, paymentMethods }: ReportBreakdownsProps) {
  const totalPaymentAmount = paymentMethods.reduce((total, item) => total + item.amount, 0);

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <section className="border border-[#E3E0D8] bg-white">
        <div className="flex items-center gap-3 border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
          <div className="flex h-9 w-9 items-center justify-center bg-[#EEF0EA] text-[#526048]">
            <House size={17} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#263A2D]">Konaklama Tipleri</h2>
            <p className="mt-1 text-[10px] text-[#969990]">Gelir ve oda-gece doluluğu</p>
          </div>
        </div>

        {accommodations.length > 0 ? (
          <div className="divide-y divide-[#F0EDE7]">
            {accommodations.map((item) => (
              <article key={item.accommodationId} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#263A2D]">{item.title}</h3>
                    <p className="mt-1 text-[10px] text-[#969990]">
                      {item.activeRoomCount} aktif oda · {item.soldRoomNights} satılan oda-gece
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[#263A2D]">
                    {formatPrice(item.revenue)}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden bg-[#EEECE6]">
                    <div
                      className="h-full bg-[#526048]"
                      style={{ width: `${Math.min(Math.max(item.occupancyRate, 0), 100)}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-[10px] font-semibold text-[#526048]">
                    %{item.occupancyRate.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
                  </span>
                </div>
              </article>
            ))}
          </div>
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
