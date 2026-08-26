import {
  BadgeDollarSign,
  Banknote,
  CircleDollarSign,
  CreditCard,
  ReceiptText,
  RotateCcw,
} from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";

import type { FinancialPaymentBreakdown } from "@/types/admin-financial-report";

type PaymentBreakdownProps = {
  breakdown: FinancialPaymentBreakdown | null;
  error: string | null;
};

export function PaymentBreakdown({ breakdown, error }: PaymentBreakdownProps) {
  if (error || !breakdown) {
    return (
      <section className="mt-5 border border-[#E7D6D1] bg-[#F8EEEA] px-4 py-4">
        <p className="text-xs font-semibold text-[#8A5147]">Tahsilat kırılımı yüklenemedi</p>
        <p className="mt-1 text-[10px] text-[#9B746D]">
          {error ?? "Tahsilat kırılımı verisi alınamadı."}
        </p>
      </section>
    );
  }

  const cards = [
    {
      label: "Brüt Tahsilat",
      value: formatPrice(breakdown.grossCollected),
      description: `${breakdown.collectionCount.toLocaleString("tr-TR")} onaylı tahsilat`,
      icon: CircleDollarSign,
    },
    {
      label: "Kapora",
      value: formatPrice(breakdown.depositCollected),
      description: "Onaylanmış gerçek kapora ödemeleri",
      icon: BadgeDollarSign,
    },
    {
      label: "Bakiye",
      value: formatPrice(breakdown.balanceCollected),
      description: "Sonradan alınan kalan ödemeler",
      icon: Banknote,
    },
    {
      label: "Tam Ödeme",
      value: formatPrice(breakdown.fullCollected),
      description: "Tek seferde alınan tam ödemeler",
      icon: CreditCard,
    },
    {
      label: "İade",
      value: formatPrice(breakdown.refundTotal),
      description: `${breakdown.refundCount.toLocaleString("tr-TR")} onaylı iade`,
      icon: RotateCcw,
    },
    {
      label: "Net Tahsilat",
      value: formatPrice(breakdown.netCollected),
      description: "Brüt tahsilat eksi iadeler",
      icon: ReceiptText,
      featured: true,
    },
  ];

  return (
    <section className="mt-5 border border-[#E3E0D8] bg-[#FAF9F6] p-4 sm:p-5">
      <div>
        <h2 className="text-sm font-semibold text-[#263A2D]">Tahsilat Kırılımı</h2>
        <p className="mt-1 text-[10px] leading-5 text-[#969990]">
          Seçilen dönemde onaylanmış gerçek ödeme hareketleri.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className={`min-w-0 border p-3.5 ${
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
                className={`mt-1.5 break-words text-lg font-semibold tracking-tight ${
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
    </section>
  );
}
