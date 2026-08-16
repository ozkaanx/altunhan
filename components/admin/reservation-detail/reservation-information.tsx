import { BedDouble, CalendarDays, ExternalLink, Loader2, Mail, Phone, User } from "lucide-react";

import { InfoRow, MiniInfo } from "@/components/admin/reservation-detail/detail-info";

import { formatPrice } from "@/lib/formatters/price";
import { formatTurkishPhoneForDisplay } from "@/lib/phone";

import type { Reservation } from "@/types/reservation";

type ReservationInformationProps = {
  reservation: Reservation;
  isLoadingRooms: boolean;
  isOpeningReceipt: boolean;
  receiptError: string | null;
  onOpenRoomModal: () => void;
  onOpenReceipt: () => void;
};

export function ReservationInformation({
  reservation,
  isLoadingRooms,
  isOpeningReceipt,
  receiptError,
  onOpenRoomModal,
  onOpenReceipt,
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

  return (
    <>
      <section className="border border-[#E3E0D8] bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
          Misafir
        </p>

        <InfoRow icon={User} label="Ad Soyad" value={reservation.guest_name} />

        <InfoRow
          icon={Phone}
          label="Telefon"
          value={formatTurkishPhoneForDisplay(reservation.guest_phone)}
        />

        {reservation.guest_email && (
          <InfoRow icon={Mail} label="E-posta" value={reservation.guest_email} />
        )}
      </section>

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

        <div className="mt-4 grid grid-cols-2 gap-4">
          <MiniInfo label="Giriş" value={reservation.check_in} />

          <MiniInfo label="Çıkış" value={reservation.check_out} />

          <MiniInfo label="Gece" value={`${reservation.night_count}`} />

          <MiniInfo label="Misafir" value={guestSummary} />
        </div>
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
