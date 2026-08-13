"use client";

import { CheckCircle2 } from "lucide-react";

import type { SiteSettings } from "@/types/site-settings";

import { formatReservationDate } from "@/lib/reservation/date-utils";

import type { CreatedReservation } from "@/types/reservation-ui";

import { ReservationDetailCard } from "@/components/reservation/payment/reservation-detail-card";

import { BankInformation } from "@/components/reservation/payment/bank-information";

import { ReceiptUpload } from "@/components/reservation/payment/receipt-upload";

import { useReceiptUpload } from "@/hooks/reservation/use-receipt-upload";

type ReservationPaymentProps = {
  reservation: CreatedReservation;
  settings: SiteSettings | null;
};

export function ReservationPayment({
  reservation,
  settings,
}: ReservationPaymentProps) {
  const {
    receipt,
    error,
    isUploading,
    selectReceipt,
    clearReceipt,
    uploadReceipt,
  } = useReceiptUpload(
    reservation
  );

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="border border-[#E1DED6] bg-white p-5 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EFE6] text-[#496449]">
          <CheckCircle2 size={24} />
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
          Rezervasyon Talebiniz Alındı
        </p>

        <h1 className="mt-2 font-serif text-3xl text-[#263A2D] sm:text-4xl">
          Ödemenizi tamamlayın.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#70756F]">
          Rezervasyonunuz oluşturuldu. Havale/EFT işlemini tamamladıktan sonra
          dekontunuzu yükleyin.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <ReservationDetailCard
            label="Rezervasyon No"
            value={reservation.reservationCode}
          />

          <ReservationDetailCard
            label="Konaklama"
            value={reservation.accommodationTitle}
          />

          <ReservationDetailCard
            label="Giriş"
            value={formatReservationDate(reservation.checkIn)}
          />

          <ReservationDetailCard
            label="Çıkış"
            value={formatReservationDate(reservation.checkOut)}
          />

          <ReservationDetailCard
            label="Konaklama Süresi"
            value={`${reservation.nightCount} gece`}
          />

          <ReservationDetailCard
            label="Toplam Tutar"
            value={`${reservation.totalPrice.toLocaleString("tr-TR")} TL`}
          />
        </div>

        <BankInformation
          settings={settings}
          reservationCode={reservation.reservationCode}
        />

        <ReceiptUpload
          receipt={receipt}
          error={error}
          isUploading={isUploading}
          onSelect={selectReceipt}
          onRemove={clearReceipt}
          onUpload={uploadReceipt}
        />
      </div>
    </div>
  );
}
