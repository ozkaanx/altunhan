import { BedDouble, CalendarDays, Loader2 } from "lucide-react";

import {
  Field,
  SectionTitle,
  SummaryItem,
  dateInputClass,
  inputClass,
} from "@/components/admin/reservation-form/form-elements";

import { CHECK_IN_POLICY_TEXT, CHECK_OUT_POLICY_TEXT } from "@/lib/reservation/stay-policy";

import type { AdminAvailableRoom, AdminReservationAccommodation } from "@/types/admin-reservation";

function getBedConfigurationLabel(
  value: AdminAvailableRoom["bedConfiguration"],
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

type AccommodationSelectionSectionProps = {
  accommodations: AdminReservationAccommodation[];
  accommodationId: number | null;
  selectedAccommodation: AdminReservationAccommodation | null;
  checkIn: string;
  checkOut: string;
  today: string;
  maxAdults: number;
  maxChildren: number;
  maxTotalGuests: number;
  totalGuestCount: number;
  availableRooms: AdminAvailableRoom[];
  selectedRoomId: number | null;
  isLoadingRooms: boolean;
  nightCount: number;
  totalPrice: number;
  onAccommodationChange: (id: number) => void;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onLoadRooms: () => void;
  onRoomChange: (id: number | null) => void;
};

export function AccommodationSelectionSection({
  accommodations,
  accommodationId,
  selectedAccommodation,
  checkIn,
  checkOut,
  today,
  maxAdults,
  maxChildren,
  maxTotalGuests,
  totalGuestCount,
  availableRooms,
  selectedRoomId,
  isLoadingRooms,
  nightCount,
  totalPrice,
  onAccommodationChange,
  onCheckInChange,
  onCheckOutChange,
  onLoadRooms,
  onRoomChange,
}: AccommodationSelectionSectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <SectionTitle
        icon={BedDouble}
        title="Konaklama Bilgileri"
        description="Oda tipi, tarih ve fiziksel oda seçimi."
      />

      <div className="space-y-5 p-4 sm:p-5">
        <Field label="Oda Tipi">
          <select
            value={accommodationId ?? ""}
            onChange={(event) => onAccommodationChange(Number(event.target.value))}
            className={inputClass}
          >
            {accommodations.map((accommodation) => (
              <option key={accommodation.id} value={accommodation.id}>
                {accommodation.title}
              </option>
            ))}
          </select>
        </Field>

        {selectedAccommodation && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 bg-[#F7F5EF] px-4 py-3 text-[10px] text-[#747970]">
            <span>
              En fazla <strong className="text-[#263A2D]">{maxAdults}</strong> yetişkin
            </span>

            <span>
              <strong className="text-[#263A2D]">{maxChildren}</strong> çocuk
            </span>

            <span>
              Toplam <strong className="text-[#263A2D]">{maxTotalGuests}</strong> kişi
            </span>
          </div>
        )}

        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Field label={`Giriş Tarihi · ${CHECK_IN_POLICY_TEXT}`}>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(event) => {
                const value = event.currentTarget.value;

                if (value && value < today) {
                  return;
                }

                onCheckInChange(value);
              }}
              className={dateInputClass}
            />
          </Field>

          <Field label={`Çıkış Tarihi · ${CHECK_OUT_POLICY_TEXT}`}>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(event) => {
                const value = event.currentTarget.value;
                const minimumDate = checkIn || today;

                if (value && value < minimumDate) {
                  return;
                }

                onCheckOutChange(value);
              }}
              className={dateInputClass}
            />
          </Field>
        </div>

        <button
          type="button"
          onClick={onLoadRooms}
          disabled={isLoadingRooms || !checkIn || !checkOut}
          className="flex h-11 w-full items-center justify-center gap-2 border border-[#D7D3CA] bg-[#FAF9F6] px-4 text-xs font-semibold text-[#263A2D] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isLoadingRooms ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CalendarDays size={15} />
          )}
          Müsait Odaları Kontrol Et
        </button>

        {availableRooms.length > 0 && (
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium text-[#40463F]">Fiziksel Oda</p>

              <span className="text-[10px] text-[#8B8E87]">
                {totalGuestCount} kişi için uygun {availableRooms.length} oda
              </span>
            </div>

            <select
              value={selectedRoomId ?? ""}
              onChange={(event) =>
                onRoomChange(event.target.value ? Number(event.target.value) : null)
              }
              className={inputClass}
            >
              <option value="">Otomatik oda ata</option>

              {availableRooms.map((room) => {
                const bedLabel = getBedConfigurationLabel(room.bedConfiguration);

                return (
                  <option key={room.id} value={room.id}>
                    {room.roomName}
                    {room.roomNumber ? ` · ${room.roomNumber}` : ""}
                    {bedLabel ? ` · ${bedLabel}` : ""}
                    {room.maxGuests ? ` · ${room.maxGuests} kişi` : ""}
                  </option>
                );
              })}
            </select>

            <p className="mt-2 text-[10px] leading-5 text-[#969990]">
              Sadece seçilen misafir sayısına kapasitesi yeterli ve tarihlerde müsait odalar
              listelenir. Oda seçmezseniz sistem bu uygun odalardan birini otomatik atar.
            </p>
          </div>
        )}

        {checkIn && checkOut && nightCount > 0 && (
          <div className="grid gap-3 bg-[#FAF8F4] p-4 sm:grid-cols-3">
            <SummaryItem label="Gece" value={`${nightCount}`} />

            <SummaryItem
              label="Gecelik"
              value={`${Number(selectedAccommodation?.price ?? 0).toLocaleString("tr-TR")} TL`}
            />

            <SummaryItem label="Toplam" value={`${totalPrice.toLocaleString("tr-TR")} TL`} />
          </div>
        )}
      </div>
    </section>
  );
}
