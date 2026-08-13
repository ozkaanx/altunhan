"use client";

import { Loader2 } from "lucide-react";

import type { PublicAccommodation } from "@/types/public-reservation";

import { formatReservationDate } from "@/lib/reservation/date-utils";

type ReservationSummaryProps = {
  selectedAccommodation: PublicAccommodation | undefined;

  checkIn: string;
  checkOut: string;

  guestCount: number;

  estimatedNightCount: number;
  estimatedTotal: number;

  dateError: string | null;

  error: string | null;

  isSubmitting: boolean;
  isLoadingAvailability: boolean;

  accommodationId: number | null;
};

export function ReservationSummary({
  selectedAccommodation,

  checkIn,
  checkOut,

  guestCount,

  estimatedNightCount,
  estimatedTotal,

  dateError,
  error,

  isSubmitting,
  isLoadingAvailability,

  accommodationId,
}: ReservationSummaryProps) {
  const isDisabled =
    isSubmitting ||
    isLoadingAvailability ||
    !accommodationId ||
    !checkIn ||
    !checkOut ||
    Boolean(dateError);

  return (
    <aside className="h-fit border border-[#E3E0D8] bg-white p-5 lg:sticky lg:top-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8754F]">
        Rezervasyon Özeti
      </p>

      <h2 className="mt-2 font-serif text-2xl text-[#263A2D]">
        {selectedAccommodation?.title ?? "Konaklama seçin"}
      </h2>

      <div className="mt-5 space-y-3 border-y border-[#EEEAE3] py-4">
        <SummaryRow
          label="Giriş"
          value={checkIn ? formatReservationDate(checkIn) : "—"}
        />

        <SummaryRow
          label="Çıkış"
          value={checkOut ? formatReservationDate(checkOut) : "—"}
        />

        <SummaryRow label="Misafir" value={`${guestCount} kişi`} />

        <SummaryRow label="Gece" value={`${estimatedNightCount} gece`} />
      </div>

      <div className="mt-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xs text-[#81857F]">Toplam</p>

          <p className="break-words text-2xl font-semibold text-[#263A2D]">
            {estimatedTotal.toLocaleString("tr-TR")} TL
          </p>
        </div>

        <p className="mt-2 text-[10px] leading-4 text-[#969990]">
          Rezervasyonunuz ödeme ve yönetici onayından sonra kesinleşir.
        </p>
      </div>

      {dateError && (
        <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-[11px] leading-5 text-[#98584E]">
          {dateError}
        </div>
      )}

      {error && error !== dateError && (
        <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-[11px] leading-5 text-[#98584E]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}

        {isSubmitting
          ? "Rezervasyon Oluşturuluyor..."
          : isLoadingAvailability
            ? "Müsaitlik Kontrol Ediliyor..."
            : dateError
              ? "Farklı Tarih Seçin"
              : "Rezervasyon Talebi Oluştur"}
      </button>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-[#969990]">{label}</span>
      <span className="text-right text-xs font-medium text-[#263A2D]">
        {value}
      </span>
    </div>
  );
}
