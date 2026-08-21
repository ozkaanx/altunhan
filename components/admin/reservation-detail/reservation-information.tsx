import {
  BedDouble,
  CalendarClock,
  CalendarDays,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { ReservationAdminNote } from "@/components/admin/reservation-detail/reservation-admin-note";
import { ReservationPayments } from "@/components/admin/reservation-detail/reservation-payments";
import { InfoRow, MiniInfo } from "@/components/admin/reservation-detail/detail-info";

import { formatTurkishPhoneForDisplay } from "@/lib/phone";
import { CHECK_IN_POLICY_TEXT, CHECK_OUT_POLICY_TEXT } from "@/lib/reservation/stay-policy";
import { formatTcknForDisplay } from "@/lib/identity/tckn";

import type { Reservation } from "@/types/reservation";

function getBedConfigurationLabel(
  value: Reservation["rooms"] extends infer Room
    ? Room extends { bed_configuration: infer Configuration }
      ? Configuration
      : never
    : never,
) {
  switch (value) {
    case "one_double":
      return "1 Çift Kişilik";
    case "double_single":
      return "1 Çift + 1 Tek";
    case "two_double":
      return "2 Çift Kişilik";
    default:
      return null;
  }
}

type ReservationInformationProps = {
  reservation: Reservation;
  isLoadingRooms: boolean;
  isOpeningReceipt: boolean;
  receiptError: string | null;
  onOpenRoomModal: () => void;
  onOpenDateModal: () => void;
  onOpenReceipt: (storagePath: string) => void;
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

  const bedConfigurationLabel = reservation.rooms
    ? getBedConfigurationLabel(reservation.rooms.bed_configuration)
    : null;

  const requestedBedConfigurationLabel = getBedConfigurationLabel(
    reservation.requested_bed_configuration,
  );

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

        {requestedBedConfigurationLabel && (
          <InfoRow
            icon={BedDouble}
            label="Müşteri Yatak Tercihi"
            value={requestedBedConfigurationLabel}
          />
        )}

        <InfoRow icon={BedDouble} label="Atanan Fiziksel Oda" value={roomName} />

        {reservation.rooms && (bedConfigurationLabel || reservation.rooms.max_guests) && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <MiniInfo label="Yatak Düzeni" value={bedConfigurationLabel ?? "—"} />

            <MiniInfo
              label="Oda Kapasitesi"
              value={
                reservation.rooms.max_guests
                  ? `Maks. ${reservation.rooms.max_guests} kişi`
                  : "—"
              }
            />
          </div>
        )}

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

      <ReservationPayments
        reservation={reservation}
        isOpeningReceipt={isOpeningReceipt}
        receiptError={receiptError}
        onOpenReceipt={onOpenReceipt}
      />
    </>
  );
}
