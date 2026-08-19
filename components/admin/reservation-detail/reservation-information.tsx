import {
  BedDouble,
  CalendarClock,
  CalendarDays,
  CreditCard,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { ReservationAdminNote } from "@/components/admin/reservation-detail/reservation-admin-note";
import { InfoRow, MiniInfo } from "@/components/admin/reservation-detail/detail-info";

import { formatPrice } from "@/lib/formatters/price";
import { formatTurkishPhoneForDisplay } from "@/lib/phone";
import { CHECK_IN_POLICY_TEXT, CHECK_OUT_POLICY_TEXT } from "@/lib/reservation/stay-policy";
import { formatTcknForDisplay } from "@/lib/identity/tckn";

import type { Reservation } from "@/types/reservation";

type ReservationInformationProps = {
  reservation: Reservation;
  isLoadingRooms: boolean;
  isOpeningReceipt: boolean;
  receiptError: string | null;
  onOpenRoomModal: () => void;
  onOpenDateModal: () => void;
  onOpenReceipt: () => void;
  onAdminNoteChange: (adminNote: string | null) => void;
};

export function ReservationInformation({
  reservation,
  isLoadingRooms,
  isOpeningReceipt,
  receiptError,
  onOpenRoomModal,
  onOpenDateModal,
  onOpenReceipt,
  onAdminNoteChange,
}: ReservationInformationProps) {
  const roomName = reservation.rooms
    ? reservation.rooms.room_number
      ? `${reservation.rooms.room_name} · ${reservation.rooms.room_number}`
      : reservation.rooms.room_name
    : "Henüz oda atanmamış";

  const guestSummary =
    reservation.child_count > 0
      ? `${reservation.adult_count} yetişkin · ${reservation.child_count} çocuk`
      : `${reservation.adult_count} yetişkin`;

  const canEditDates = reservation.status !== "rejected" && reservation.status !== "cancelled";

  return (
    <>
      <section className="border border-[#E3E0D8] bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
          Misafir
        </p>

        <InfoRow icon={User} label="Ad Soyad" value={reservation.guest_name} />

        {reservation.guest_identity_number && (
          <InfoRow
            icon={CreditCard}
            label="T.C. Kimlik Numarası"
            value={formatTcknForDisplay(reservation.guest_identity_number)}
          />
        )}

        <InfoRow
          icon={Phone}
          label="Telefon"
          value={formatTurkishPhoneForDisplay(reservation.guest_phone)}
        />

        {reservation.guest_email && (
          <InfoRow icon={Mail} label="E-posta" value={reservation.guest_email} />
        )}
      </section>

      <ReservationAdminNote
        key={reservation.id}
        reservationId={reservation.id}
        initialNote={reservation.admin_note}
        onSaved={onAdminNoteChange}
      />

      <section className="border border-[#E3E0D8] bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
          Konaklama
        </p>

        <InfoRow
          icon={CalendarDays}
          label="Oda Tipi"
          value={reservation.accommodations?.title ?? "—"}
        />

        <InfoRow icon={BedDouble} label="Atanan Fiziksel Oda" value={roomName} />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <MiniInfo label={`Giriş · ${CHECK_IN_POLICY_TEXT}`} value={reservation.check_in} />

          <MiniInfo label={`Çıkış · ${CHECK_OUT_POLICY_TEXT}`} value={reservation.check_out} />

          <MiniInfo label="Gece" value={`${reservation.night_count}`} />

          <MiniInfo label="Misafir" value={guestSummary} />
        </div>
        <button
          type="button"
          onClick={onOpenRoomModal}
          disabled={isLoadingRooms}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 border border-[#D7D3CA] bg-white text-xs font-semibold text-[#263A2D]"
        >
          {isLoadingRooms ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <BedDouble size={15} />
          )}
          Odayı Değiştir
        </button>

        {canEditDates && (
          <button
            type="button"
            onClick={onOpenDateModal}
            className="mt-2 flex h-10 w-full items-center justify-center gap-2 border border-[#D7D3CA] bg-white text-xs font-semibold text-[#263A2D]"
          >
            <CalendarClock size={15} />
            Tarihlerini Düzenle
          </button>
        )}
      </section>

      <section className="border border-[#E3E0D8] bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
          Ödeme
        </p>

        <p className="mt-3 text-2xl font-semibold text-[#263A2D]">
          {formatPrice(reservation.total_price)}
        </p>

        {reservation.receipt_storage_path && (
          <button
            type="button"
            onClick={onOpenReceipt}
            disabled={isOpeningReceipt}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white"
          >
            {isOpeningReceipt ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <ExternalLink size={15} />
            )}
            Dekontu Gör
          </button>
        )}

        {receiptError && <p className="mt-2 text-xs text-[#98584E]">{receiptError}</p>}
      </section>
    </>
  );
}
