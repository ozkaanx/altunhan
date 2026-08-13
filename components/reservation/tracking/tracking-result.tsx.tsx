"use client";

import {
  ArrowLeft,
  CalendarDays,
  Home,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useTrackingReceiptUpload } from "@/hooks/reservation/use-tracking-receipt-upload";

import { formatReservationDate } from "@/lib/reservation/date-utils";

import { formatReservationPrice } from "@/lib/reservation/reservation-utils";

import type { SiteSettings } from "@/types/site-settings";

import type {
  PublicReservationStatus,
  ReservationTrackingResult,
} from "@/types/reservation-tracking";
import { TrackingStatusCard } from "./tracking-status-card";
import { TrackingTimeline } from "./tracking-timeline";
import { BankInformation } from "../payment/bank-information";
import { TrackingReceiptUpload } from "./tracking-receipt-upload";

type TrackingResultProps = {
  reservation: ReservationTrackingResult;
  phone: string;
  settings: SiteSettings | null;

  onReset: () => void;

  onReservationChange: (reservation: ReservationTrackingResult) => void;
};

const statusLabels: Record<PublicReservationStatus, string> = {
  pending_payment: "Ödeme Bekleniyor",

  pending_approval: "Onay Bekliyor",

  confirmed: "Onaylandı",

  rejected: "Reddedildi",

  cancelled: "İptal Edildi",
};

export function TrackingResult({
  reservation,
  phone,
  settings,
  onReset,
  onReservationChange,
}: TrackingResultProps) {
  const {
    receipt,
    error,
    isUploading,
    uploadSuccess,

    selectReceipt,
    clearReceipt,
    uploadReceipt,
  } = useTrackingReceiptUpload({
    reservation,
    phone,

    onReservationRefresh: onReservationChange,
  });

  return (
    <div className="mx-auto max-w-[760px]">
      <button
        type="button"
        onClick={onReset}
        className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-[#777C75]"
      >
        <ArrowLeft size={14} />
        Başka Rezervasyon Sorgula
      </button>

      <div className="border border-[#E3E0D8] bg-white">
        <div className="border-b border-[#EEEAE3] p-5 sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
            Rezervasyon Durumu
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl text-[#263A2D]">
                {reservation.guestName}
              </h1>

              <p className="mt-2 break-all text-xs font-semibold tracking-[0.08em] text-[#7D817B]">
                {reservation.reservationCode}
              </p>
            </div>

            <span className="w-fit bg-[#F0EFEA] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#60665F]">
              {statusLabels[reservation.status]}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <TrackingStatusCard status={reservation.status} />

          {reservation.status === "rejected" && reservation.rejectionReason && (
            <ReasonBox
              title="Red Açıklaması"
              description={reservation.rejectionReason}
            />
          )}

          {reservation.status === "cancelled" &&
            reservation.cancellationReason && (
              <ReasonBox
                title="İptal Açıklaması"
                description={reservation.cancellationReason}
              />
            )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={Home}
              label="Konaklama"
              value={reservation.accommodationTitle}
            />

            <InfoCard
              icon={Users}
              label="Misafir"
              value={`${reservation.guestCount} kişi`}
            />

            <InfoCard
              icon={CalendarDays}
              label="Giriş"
              value={formatReservationDate(reservation.checkIn)}
            />

            <InfoCard
              icon={CalendarDays}
              label="Çıkış"
              value={formatReservationDate(reservation.checkOut)}
            />

            <InfoCard
              icon={ShieldCheck}
              label="Konaklama Süresi"
              value={`${reservation.nightCount} gece`}
            />

            <InfoCard
              icon={Phone}
              label="Toplam"
              value={formatReservationPrice(reservation.totalPrice)}
            />
          </div>

          <TrackingTimeline reservation={reservation} />

          {reservation.status === "pending_payment" &&
            !reservation.hasReceipt && (
              <>
                <BankInformation
                  settings={settings}
                  reservationCode={reservation.reservationCode}
                />

                <TrackingReceiptUpload
                  receipt={receipt}
                  error={error}
                  uploadSuccess={uploadSuccess}
                  isUploading={isUploading}
                  onSelect={selectReceipt}
                  onRemove={clearReceipt}
                  onUpload={uploadReceipt}
                />
              </>
            )}
        </div>
      </div>
    </div>
  );
}

function ReasonBox({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98584E]">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#8A635D]">{description}</p>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 border border-[#E8E4DC] bg-[#FAF9F6] p-4">
      <Icon size={16} className="mt-0.5 shrink-0 text-[#A8754F]" />

      <div className="min-w-0">
        <p className="text-[10px] text-[#969990]">{label}</p>

        <p className="mt-1 break-words text-xs font-semibold text-[#263A2D]">
          {value}
        </p>
      </div>
    </div>
  );
}
