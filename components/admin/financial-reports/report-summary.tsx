import {
  BedDouble,
  CalendarCheck,
  CircleDollarSign,
  Landmark,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";

import type { FinancialReportSummary } from "@/types/admin-financial-report";

type ReportSummaryProps = {
  summary: FinancialReportSummary;
};

export function ReportSummary({ summary }: ReportSummaryProps) {
  const cards = [
    {
      label: "Net Tahsilat",
      value: formatPrice(summary.collectedRevenue),
      description: `${summary.paymentCount.toLocaleString("tr-TR")} onaylı tahsilat · iadeler düşülmüş`,
      icon: CircleDollarSign,
      featured: true,
    },
    {
      label: "Kalan Alacak",
      value: formatPrice(summary.outstandingBalance),
      description: "Bu dönemde konaklayanlardan",
      icon: WalletCards,
    },
    {
      label: "Rezervasyon Değeri",
      value: formatPrice(summary.bookingValue),
      description: `${summary.reservationCount.toLocaleString("tr-TR")} giriş yapan rezervasyon`,
      icon: ReceiptText,
    },
    {
      label: "Satılan Oda-Gece",
      value: summary.soldRoomNights.toLocaleString("tr-TR"),
      description: `${summary.availableRoomNights.toLocaleString("tr-TR")} oda-gece kapasitesi`,
      icon: BedDouble,
    },
    {
      label: "Doluluk Oranı",
      value: `%${summary.occupancyRate.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`,
      description: "Onaylı rezervasyonlara göre",
      icon: CalendarCheck,
    },
    {
      label: "İade",
      value: formatPrice(summary.refundTotal),
      description: "Tahsilattan düşülen tutar",
      icon: Landmark,
    },
  ];

  return (
    <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className={`min-w-0 border p-4 sm:p-5 ${
              card.featured
                ? "border-[#263A2D] bg-[#263A2D] text-white"
                : "border-[#E3E0D8] bg-white"
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center ${
                card.featured ? "bg-white/10 text-[#D6C19F]" : "bg-[#EEF0EA] text-[#526048]"
              }`}
            >
              <Icon size={17} strokeWidth={1.6} />
            </div>
            <p className={`mt-4 text-[10px] ${card.featured ? "text-white/60" : "text-[#858A82]"}`}>
              {card.label}
            </p>
            <p
              className={`mt-2 break-words text-xl font-semibold tracking-tight sm:text-2xl ${
                card.featured ? "text-white" : "text-[#263A2D]"
              }`}
            >
              {card.value}
            </p>
            <p
              className={`mt-2 text-[9px] leading-4 ${card.featured ? "text-white/45" : "text-[#A0A39C]"}`}
            >
              {card.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
