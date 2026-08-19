"use client";

import { Check, Clock3, XCircle } from "lucide-react";

import type { ReservationTrackingResult } from "@/types/reservation-tracking";

type TimelineStep = {
  title: string;
  description: string;
  state: "completed" | "active" | "waiting" | "failed";
};

type TrackingTimelineProps = {
  reservation: ReservationTrackingResult;
};

export function TrackingTimeline({ reservation }: TrackingTimelineProps) {
  const timeline = getTimeline(reservation);

  return (
    <div className="mt-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8754F]">
        Rezervasyon Süreci
      </p>

      <div className="mt-4 space-y-0">
        {timeline.map((step, index) => {
          const isLast = index === timeline.length - 1;

          return <TimelineItem key={`${step.title}-${index}`} step={step} isLast={isLast} />;
        })}
      </div>
    </div>
  );
}

function TimelineItem({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  const config = getTimelineConfig(step.state);

  const Icon = config.icon;

  return (
    <div className="relative flex gap-4">
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${config.iconClassName}`}
        >
          <Icon size={14} />
        </div>

        {!isLast && <div className={`min-h-10 w-px flex-1 ${config.lineClassName}`} />}
      </div>

      <div className={`min-w-0 ${isLast ? "pb-0" : "pb-6"}`}>
        <p className={`text-xs font-semibold ${config.titleClassName}`}>{step.title}</p>

        <p className="mt-1 text-[11px] leading-5 text-[#858A83]">{step.description}</p>
      </div>
    </div>
  );
}

function getTimelineConfig(state: TimelineStep["state"]) {
  switch (state) {
    case "completed":
      return {
        icon: Check,
        iconClassName: "bg-[#E8EFE6] text-[#496449]",
        lineClassName: "bg-[#CBD8C8]",
        titleClassName: "text-[#456044]",
      };

    case "active":
      return {
        icon: Clock3,
        iconClassName: "bg-[#F0EDF6] text-[#655D8A]",
        lineClassName: "bg-[#DDD4E8]",
        titleClassName: "text-[#655D8A]",
      };

    case "failed":
      return {
        icon: XCircle,
        iconClassName: "bg-[#F7EBE8] text-[#98584E]",
        lineClassName: "bg-[#E4C6BF]",
        titleClassName: "text-[#98584E]",
      };

    default:
      return {
        icon: Clock3,
        iconClassName: "bg-[#F0EFEA] text-[#949890]",
        lineClassName: "bg-[#E3E0D8]",
        titleClassName: "text-[#858A83]",
      };
  }
}

function getTimeline(reservation: ReservationTrackingResult): TimelineStep[] {
  const paymentLabel = reservation.paymentPlan === "deposit" ? "Kapora" : "Ödeme";

  switch (reservation.status) {
    case "confirmed":
      return [
        {
          title: "Rezervasyon Talebi",
          description: "Rezervasyon talebiniz alındı.",
          state: "completed",
        },
        {
          title: "Dekont Yüklendi",
          description: "Ödeme belgeniz tarafımıza ulaştı.",
          state: "completed",
        },
        {
          title: `${paymentLabel} Onaylandı`,
          description: `${paymentLabel} tutarınız kontrol edilerek onaylandı.`,
          state: "completed",
        },
        {
          title: "Rezervasyon Kesinleşti",
          description: "Rezervasyonunuz başarıyla onaylandı.",
          state: "completed",
        },
      ];

    case "pending_approval":
      return [
        {
          title: "Rezervasyon Talebi",
          description: "Rezervasyon talebiniz alındı.",
          state: "completed",
        },
        {
          title: "Dekont Yüklendi",
          description: "Ödeme belgeniz tarafımıza ulaştı.",
          state: "completed",
        },
        {
          title: `${paymentLabel} Kontrol Ediliyor`,
          description: "Dekontunuz Altunhan Farm tarafından kontrol ediliyor.",
          state: "active",
        },
        {
          title: "Rezervasyon Onayı",
          description: "Kontrol tamamlandıktan sonra rezervasyonunuz kesinleşecek.",
          state: "waiting",
        },
      ];

    case "rejected":
      return [
        {
          title: "Rezervasyon Talebi",
          description: "Rezervasyon talebiniz alındı.",
          state: "completed",
        },
        {
          title: "Dekont",
          description: reservation.hasReceipt
            ? "Ödeme dekontunuz sisteme yüklendi."
            : "Ödeme dekontu yüklenmedi.",
          state: reservation.hasReceipt ? "completed" : "waiting",
        },
        {
          title: "Ödeme Kontrolü",
          description: "Rezervasyonunuz yapılan inceleme sonucunda onaylanamadı.",
          state: "failed",
        },
        {
          title: "Rezervasyon Onayı",
          description: "Rezervasyon kesinleşmedi.",
          state: "failed",
        },
      ];

    case "cancelled":
      return [
        {
          title: "Rezervasyon Talebi",
          description: "Rezervasyon talebiniz oluşturuldu.",
          state: "completed",
        },
        {
          title: "Rezervasyon Onaylandı",
          description: "Rezervasyonunuz daha önce onaylandı.",
          state: "completed",
        },
        {
          title: "Rezervasyon İptal Edildi",
          description: "Rezervasyonunuz iptal edildi ve artık aktif değil.",
          state: "failed",
        },
      ];

    default:
      return [
        {
          title: "Rezervasyon Talebi",
          description: "Rezervasyon talebiniz alındı.",
          state: "completed",
        },
        {
          title: `${paymentLabel} Bekleniyor`,
          description: `${paymentLabel} tutarını ödedikten sonra dekontunuzu yükleyin.`,
          state: "active",
        },
        {
          title: "Ödeme Kontrolü",
          description: "Dekontunuz gönderildikten sonra ödeme kontrol edilecek.",
          state: "waiting",
        },
        {
          title: "Rezervasyon Onayı",
          description: `${paymentLabel} onayından sonra rezervasyonunuz kesinleşecek.`,
          state: "waiting",
        },
      ];
  }
}
