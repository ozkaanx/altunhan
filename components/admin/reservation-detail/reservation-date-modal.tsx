import { CalendarDays, CheckCircle2, Loader2, Search } from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";
import { calculateNightCount } from "@/lib/reservation/date-utils";
import { STAY_TIME_POLICY_SUMMARY } from "@/lib/reservation/stay-policy";

import type { ReservationRoomOption } from "@/types/admin-reservation-detail";

type ReservationDateModalProps = {
  open: boolean;
  checkIn: string;
  checkOut: string;
  today: string;
  nightlyPrice: number;
  rooms: ReservationRoomOption[];
  selectedRoomId: number | null;
  error: string | null;
  isLoadingRooms: boolean;
  isUpdating: boolean;
  isAvailabilityCurrent: boolean;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onSelectRoom: (roomId: number) => void;
  onCheckAvailability: () => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function ReservationDateModal({
  open,
  checkIn,
  checkOut,
  today,
  nightlyPrice,
  rooms,
  selectedRoomId,
  error,
  isLoadingRooms,
  isUpdating,
  isAvailabilityCurrent,
  onCheckInChange,
  onCheckOutChange,
  onSelectRoom,
  onCheckAvailability,
  onClose,
  onSubmit,
}: ReservationDateModalProps) {
  if (!open) {
    return null;
  }

  const nightCount = calculateNightCount(checkIn, checkOut);
  const totalPrice = nightlyPrice * nightCount;
  const availableRooms = rooms.filter((room) => room.isAvailable);

  const handleClose = () => {
    if (!isUpdating && !isLoadingRooms) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Tarih düzenleme penceresini kapat"
        className="absolute inset-0"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-date-modal-title"
        className="relative z-10 max-h-[92dvh] w-full overflow-y-auto bg-white p-5 shadow-2xl sm:max-w-[560px] sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F1EFEA] text-[#A8754F]">
            <CalendarDays size={18} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8754F]">
              Rezervasyon Tarihleri
            </p>

            <h3
              id="reservation-date-modal-title"
              className="mt-1 text-xl font-semibold text-[#263A2D]"
            >
              Tarihleri Düzenle
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#7D817B]">
              {STAY_TIME_POLICY_SUMMARY}. Yeni tarihler için fiziksel oda müsaitliği yeniden kontrol
              edilir.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-[#40463F]">Giriş Tarihi</span>

            <input
              type="date"
              required
              min={today}
              value={checkIn}
              onChange={(event) => onCheckInChange(event.target.value)}
              disabled={isUpdating}
              className="h-12 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none focus:border-[#263A2D] disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-[#40463F]">Çıkış Tarihi</span>

            <input
              type="date"
              required
              min={checkIn || today}
              value={checkOut}
              onChange={(event) => onCheckOutChange(event.target.value)}
              disabled={isUpdating}
              className="h-12 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none focus:border-[#263A2D] disabled:opacity-60"
            />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 bg-[#F7F4EE] p-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.12em] text-[#969990]">Gece Sayısı</p>
            <p className="mt-1 text-sm font-semibold text-[#263A2D]">{nightCount}</p>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.12em] text-[#969990]">Yeni Toplam</p>
            <p className="mt-1 text-sm font-semibold text-[#263A2D]">{formatPrice(totalPrice)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCheckAvailability}
          disabled={isLoadingRooms || isUpdating || !checkIn || !checkOut || checkOut <= checkIn}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 border border-[#263A2D] text-xs font-semibold text-[#263A2D] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoadingRooms ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          {isLoadingRooms ? "Kontrol Ediliyor..." : "Oda Müsaitliğini Kontrol Et"}
        </button>

        {isAvailabilityCurrent && availableRooms.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#4F6A4F]" />
              <p className="text-xs font-semibold text-[#263A2D]">Müsait Fiziksel Oda</p>
            </div>

            <div className="mt-3 space-y-2">
              {availableRooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => onSelectRoom(room.id)}
                  disabled={isUpdating}
                  className={`flex w-full items-center justify-between border p-3 text-left ${
                    selectedRoomId === room.id
                      ? "border-[#263A2D] bg-[#F3F5F1]"
                      : "border-[#E3E0D8] bg-white"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#263A2D]">{room.roomName}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#969990]">
                      {room.roomNumber ?? "—"}
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold text-[#4F6A4F]">
                    {room.isCurrent ? "Mevcut Oda" : "Müsait"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs text-[#98584E]"
          >
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUpdating || isLoadingRooms}
            className="h-11 border border-[#DDD9D1] text-xs font-semibold text-[#263A2D] disabled:opacity-50"
          >
            Vazgeç
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={
              isUpdating ||
              isLoadingRooms ||
              !isAvailabilityCurrent ||
              !selectedRoomId ||
              nightCount < 1
            }
            className="flex h-11 items-center justify-center gap-2 bg-[#263A2D] px-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isUpdating && <Loader2 size={15} className="animate-spin" />}
            {isUpdating ? "Güncelleniyor..." : "Tarihleri Güncelle"}
          </button>
        </div>
      </div>
    </div>
  );
}
