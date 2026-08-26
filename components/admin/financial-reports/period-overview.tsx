import {
  BadgeDollarSign,
  BedDouble,
  CircleDollarSign,
  Gauge,
  WalletCards,
  Warehouse,
} from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";

import type {
  FinancialPaymentBreakdown,
  FinancialReportDay,
  FinancialReportPeriod,
  FinancialReportSummary,
} from "@/types/admin-financial-report";

type PeriodOverviewProps = {
  period: FinancialReportPeriod;
  summary: FinancialReportSummary;
  days: FinancialReportDay[];
  paymentBreakdown: FinancialPaymentBreakdown | null;
};

const periodLabels: Record<FinancialReportPeriod, string> = {
  day: "Günlük",
  week: "Haftalık",
  month: "Aylık",
};

export function PeriodOverview({ period, summary, days, paymentBreakdown }: PeriodOverviewProps) {
  const totalCheckIns = days.reduce((total, day) => total + day.checkIns, 0);
  const totalCheckOuts = days.reduce((total, day) => total + day.checkOuts, 0);

  const isDaily = period === "day";
  const usedCapacity = isDaily ? (days[0]?.occupiedRooms ?? 0) : summary.soldRoomNights;

  const totalCapacity = summary.availableRoomNights;
  const emptyCapacity = Math.max(totalCapacity - usedCapacity, 0);

  const netCollected = paymentBreakdown?.netCollected ?? summary.collectedRevenue;

  const depositCollected = paymentBreakdown?.depositCollected ?? 0;

  const refundTotal = paymentBreakdown?.refundTotal ?? summary.refundTotal;

  const cards = [
    {
      label: "Net Tahsilat",
      value: formatPrice(netCollected),
      description: "İadeler düşülmüş gerçek tahsilat",
      icon: CircleDollarSign,
      featured: true,
    },
    {
      label: "Kapora",
      value: formatPrice(depositCollected),
      description: "Onaylanmış kapora ödemeleri",
      icon: BadgeDollarSign,
    },
    {
      label: "Kalan Alacak",
      value: formatPrice(summary.outstandingBalance),
      description: "Henüz tahsil edilmemiş bakiye",
      icon: WalletCards,
    },
    {
      label: isDaily ? "Verilen Oda" : "Verilen Oda-Gece",
      value: usedCapacity.toLocaleString("tr-TR"),
      description: isDaily
        ? `${totalCapacity.toLocaleString("tr-TR")} toplam odadan`
        : `${totalCapacity.toLocaleString("tr-TR")} toplam oda-geceden`,
      icon: BedDouble,
    },
    {
      label: isDaily ? "Boş Oda" : "Boş Oda-Gece",
      value: emptyCapacity.toLocaleString("tr-TR"),
      description: isDaily
        ? "O gün kullanılmayan fiziksel oda"
        : "Seçilen dönemde kullanılmayan kapasite",
      icon: Warehouse,
    },
    {
      label: "Doluluk",
      value: `%${summary.occupancyRate.toLocaleString("tr-TR", {
        maximumFractionDigits: 1,
      })}`,
      description: "Onaylı konaklamalara göre",
      icon: Gauge,
    },
  ];

  return (
    <section className="mt-5 border border-[#D9D5CC] bg-[#F8F7F3] p-4 sm:p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#263A2D]">{periodLabels[period]} Özet</h2>
          <p className="mt-1 text-[10px] leading-5 text-[#969990]">
            İşletmenin bu dönem için en önemli rakamları.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className={`min-w-0 border p-4 ${
                card.featured ? "border-[#263A2D] bg-[#263A2D]" : "border-[#E3E0D8] bg-white"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center ${
                  card.featured ? "bg-white/10 text-[#D6C19F]" : "bg-[#EEF0EA] text-[#526048]"
                }`}
              >
                <Icon size={15} strokeWidth={1.6} />
              </div>

              <p
                className={`mt-3 text-[9px] ${card.featured ? "text-white/60" : "text-[#858A82]"}`}
              >
                {card.label}
              </p>

              <p
                className={`mt-1.5 break-words text-xl font-semibold tracking-tight ${
                  card.featured ? "text-white" : "text-[#263A2D]"
                }`}
              >
                {card.value}
              </p>

              <p
                className={`mt-1.5 text-[8px] leading-4 ${
                  card.featured ? "text-white/45" : "text-[#A0A39C]"
                }`}
              >
                {card.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden border border-[#E3E0D8] bg-[#E3E0D8] sm:grid-cols-4">
        <SmallStat label="Rezervasyon" value={summary.reservationCount.toLocaleString("tr-TR")} />
        <SmallStat label="Giriş" value={totalCheckIns.toLocaleString("tr-TR")} />
        <SmallStat label="Çıkış" value={totalCheckOuts.toLocaleString("tr-TR")} />
        <SmallStat label="İade" value={formatPrice(refundTotal)} />
      </div>
    </section>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-4 py-3">
      <p className="text-[8px] uppercase tracking-[0.08em] text-[#969990]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#263A2D]">{value}</p>
    </div>
  );
}
