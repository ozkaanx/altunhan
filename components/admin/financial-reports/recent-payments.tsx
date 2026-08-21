import { formatPrice } from "@/lib/formatters/price";

import type { FinancialReportPayment } from "@/types/admin-financial-report";

type RecentPaymentsProps = {
  payments: FinancialReportPayment[];
};

const paymentMethodLabels = {
  bank_transfer: "Havale / EFT",
  cash: "Nakit",
  card: "Kart",
  other: "Diğer",
};

function formatPaymentDate(value: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(value));
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <section className="mt-6 border border-[#E3E0D8] bg-white">
      <div className="border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
        <h2 className="text-sm font-semibold text-[#263A2D]">Son Finansal Hareketler</h2>
        <p className="mt-1 text-[10px] text-[#969990]">Seçilen dönemdeki son 12 tahsilat ve iade</p>
      </div>

      {payments.length > 0 ? (
        <>
          <div className="divide-y divide-[#F0EDE7] md:hidden">
            {payments.map((payment) => (
              <article key={payment.paymentId} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="break-all text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A8754F]">
                      {payment.code}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-[#263A2D]">
                      {payment.guestName}
                    </p>
                    <p className="mt-2 text-[10px] text-[#969990]">
                      {paymentMethodLabels[payment.method]} · {formatPaymentDate(payment.paidAt)}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-semibold ${
                      payment.amount < 0 ? "text-[#9A5047]" : "text-[#263A2D]"
                    }`}
                  >
                    {formatPrice(payment.amount)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-[#FAF9F6] text-left text-[9px] uppercase tracking-[0.08em] text-[#969990]">
                  <th className="px-5 py-3 font-medium">Rezervasyon</th>
                  <th className="px-5 py-3 font-medium">Misafir</th>
                  <th className="px-5 py-3 font-medium">Tarih</th>
                  <th className="px-5 py-3 font-medium">Yöntem</th>
                  <th className="px-5 py-3 text-right font-medium">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.paymentId}
                    className="border-t border-[#F0EDE7] text-xs text-[#596058]"
                  >
                    <td className="px-5 py-3 font-semibold text-[#263A2D]">{payment.code}</td>
                    <td className="px-5 py-3">{payment.guestName}</td>
                    <td className="px-5 py-3">{formatPaymentDate(payment.paidAt)}</td>
                    <td className="px-5 py-3">{paymentMethodLabels[payment.method]}</td>
                    <td
                      className={`px-5 py-3 text-right font-semibold ${
                        payment.amount < 0 ? "text-[#9A5047]" : "text-[#263A2D]"
                      }`}
                    >
                      {formatPrice(payment.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="px-5 py-14 text-center text-xs text-[#969990]">
          Seçilen dönemde finansal hareket bulunmuyor.
        </p>
      )}
    </section>
  );
}
