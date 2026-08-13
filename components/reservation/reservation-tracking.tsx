"use client";

import type { SiteSettings } from "@/types/site-settings";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import {
  findReservation,
} from "@/app/rezervasyon/takip/action";

import type {
  PublicReservationStatus,
  ReservationTrackingResult,
} from "@/types/reservation-tracking";

import { TrackingSearchForm } from "@/components/reservation/tracking/searchForm";
import { TrackingStatusCard } from "@/components/reservation/tracking/statusCard";
import { TrackingTimeline } from "@/components/reservation/tracking/timeline";

import { TrackingReceiptUpload } from "@/components/reservation/tracking/receiptUpload";

import { useTrackingReceiptUpload } from "@/hooks/reservation/use-tracking-receipt-upload";

import { TrackingResult } from "@/components/reservation/tracking/result";

const statusLabels: Record<PublicReservationStatus, string> = {
  pending_payment: "Ödeme Bekleniyor",

  pending_approval: "Onay Bekliyor",

  confirmed: "Onaylandı",

  rejected: "Reddedildi",

  cancelled: "İptal Edildi",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",

    month: "long",

    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function getTimeline(reservation: ReservationTrackingResult): TimelineStep[] {
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
          title: "Ödeme Onaylandı",

          description: "Ödemeniz kontrol edilerek onaylandı.",

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
          title: "Ödeme Kontrol Ediliyor",

          description: "Dekontunuz Altunhan Farm tarafından kontrol ediliyor.",

          state: "active",
        },

        {
          title: "Rezervasyon Onayı",

          description:
            "Kontrol tamamlandıktan sonra rezervasyonunuz kesinleşecek.",

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

          description:
            "Rezervasyonunuz yapılan inceleme sonucunda onaylanamadı.",

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
          title: "Ödeme Bekleniyor",

          description: "Ödemenizi yaptıktan sonra dekontunuzu yükleyin.",

          state: "active",
        },

        {
          title: "Ödeme Kontrolü",

          description:
            "Dekontunuz gönderildikten sonra ödeme kontrol edilecek.",

          state: "waiting",
        },

        {
          title: "Rezervasyon Onayı",

          description: "Ödeme onayından sonra rezervasyonunuz kesinleşecek.",

          state: "waiting",
        },
      ];
  }
}

type ReservationTrackingProps = {
  settings: SiteSettings | null;
};

export function ReservationTracking({ settings }: ReservationTrackingProps) {
  const searchParams = useSearchParams();

  const codeFromUrl = searchParams.get("code");

  const [reservationCode, setReservationCode] = useState(codeFromUrl ?? "");

  const [phone, setPhone] = useState("");

  const [reservation, setReservation] =
    useState<ReservationTrackingResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (codeFromUrl) {
      setReservationCode(codeFromUrl);
    }
  }, [codeFromUrl]);

  useEffect(() => {
    if (!reservation || !phone.trim()) {
      return;
    }

    if (
      reservation.status === "confirmed" ||
      reservation.status === "rejected" ||
      reservation.status === "cancelled"
    ) {
      return;
    }

    let cancelled = false;

    const refreshReservation = async () => {
      try {
        const result = await findReservation(
          reservation.reservationCode,
          phone,
        );

        if (cancelled || !result.success) {
          return;
        }

        setReservation(result.reservation);
      } catch (error) {
        console.error("Rezervasyon durumu otomatik güncellenemedi:", error);
      }
    };

    const interval = window.setInterval(refreshReservation, 15_000);

    return () => {
      cancelled = true;

      window.clearInterval(interval);
    };
  }, [reservation, phone]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    setReservation(null);

    setIsLoading(true);

    try {
      const result = await findReservation(reservationCode, phone);

      if (!result.success) {
        setError(result.message);

        return;
      }

      setReservation(result.reservation);
    } catch (error) {
      console.error(error);

      setError("Rezervasyon sorgulanırken beklenmeyen bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setReservation(null);

    setError(null);
  };


  if (reservation) {

    return (
      <TrackingResult
        reservation={reservation}
        phone={phone}
        settings={settings}
        onReset={resetSearch}
        onReservationChange={setReservation}
      />
    );
  }

  return (
    <TrackingSearchForm
      reservationCode={reservationCode}
      phone={phone}
      error={error}
      isLoading={isLoading}
      onReservationCodeChange={setReservationCode}
      onPhoneChange={setPhone}
      onSubmit={handleSubmit}
    />
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;

  label: string;

  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border border-[#E8E4DC] bg-[#FAF9F6] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white text-[#A8754F]">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-[#969990]">{label}</p>

        <p className="mt-1 truncate text-xs font-medium text-[#263A2D]">
          {value}
        </p>
      </div>
    </div>
  );
}

function BankRow({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-[#969990]">{label}</p>

      <p className="mt-1 text-sm font-medium text-[#263A2D]">{value}</p>
    </div>
  );
}
