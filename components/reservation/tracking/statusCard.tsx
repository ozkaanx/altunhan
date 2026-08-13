"use client";

import {
  CheckCircle2,
  Clock3,
  ReceiptText,
  XCircle,
} from "lucide-react";

import type {
  PublicReservationStatus,
} from "@/types/reservation-tracking";

type TrackingStatusCardProps = {
  status: PublicReservationStatus;
};

const statusConfig: Record<
  PublicReservationStatus,
  {
    icon: typeof CheckCircle2;
    className: string;
    title: string;
    description: string;
  }
> = {
  confirmed: {
    icon: CheckCircle2,
    className:
      "border-[#CBDDC8] bg-[#EAF2E8] text-[#456044]",
    title:
      "Rezervasyonunuz Onaylandı",
    description:
      "Rezervasyonunuz kesinleşti. Altunhan Farm sizi bekliyor.",
  },

  rejected: {
    icon: XCircle,
    className:
      "border-[#E4C6BF] bg-[#F7EBE8] text-[#98584E]",
    title:
      "Rezervasyon Onaylanamadı",
    description:
      "Rezervasyonunuz yapılan kontrol sonucunda onaylanamadı.",
  },

  cancelled: {
    icon: XCircle,
    className:
      "border-[#DEDCD6] bg-[#EEEEEB] text-[#666B65]",
    title:
      "Rezervasyon İptal Edildi",
    description:
      "Rezervasyonunuz iptal edildi. Aşağıda iptal açıklamasını görebilirsiniz.",
  },

  pending_approval: {
    icon: Clock3,
    className:
      "border-[#DDD4E8] bg-[#F0EDF6] text-[#655D8A]",
    title:
      "Ödeme Kontrol Ediliyor",
    description:
      "Dekontunuz bize ulaştı. Rezervasyonunuz yönetici onayı bekliyor.",
  },

  pending_payment: {
    icon: ReceiptText,
    className:
      "border-[#E5D8BE] bg-[#F7F0E3] text-[#88662F]",
    title:
      "Ödeme Bekleniyor",
    description:
      "Rezervasyonunuz oluşturuldu. Ödemenizi yaptıktan sonra dekontunuzu aşağıdan yükleyebilirsiniz.",
  },
};

export function TrackingStatusCard({
  status,
}: TrackingStatusCardProps) {
  const config =
    statusConfig[status];

  const StatusIcon =
    config.icon;

  return (
    <div
      className={`flex min-w-0 items-start gap-3 border p-4 ${config.className}`}
    >
      <StatusIcon
        size={22}
        className="mt-0.5 shrink-0"
      />

      <div className="min-w-0">
        <p className="text-sm font-semibold">
          {config.title}
        </p>

        <p className="mt-1 text-xs leading-5 opacity-80">
          {config.description}
        </p>
      </div>
    </div>
  );
}