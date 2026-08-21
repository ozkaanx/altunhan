import { BedDouble, Loader2, Users } from "lucide-react";

import { ROOM_BED_OPTIONS } from "@/lib/admin/room-bed-config";

import type { ReservationRoomOption } from "@/types/admin-reservation-detail";

type ReservationRoomModalProps = {
  open: boolean;
  rooms: ReservationRoomOption[];
  guestCount: number;
  selectedRoomId: number | null;
  error: string | null;
  isChanging: boolean;
  onSelectRoom: (roomId: number) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function ReservationRoomModal({
  open,
  rooms,
  guestCount,
  selectedRoomId,
  error,
  isChanging,
  onSelectRoom,
  onClose,
  onSubmit,
}: ReservationRoomModalProps) {
  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (!isChanging) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center overflow-hidden bg-black/40 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Oda değiştirme penceresini kapat"
        className="absolute inset-0"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-modal-title"
        className="relative z-10 flex max-h-[calc(100dvh-1rem)] w-full min-w-0 flex-col overflow-hidden bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[92dvh] sm:max-w-[520px]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8754F]">
          Fiziksel Oda
        </p>

        <h3 id="room-modal-title" className="mt-2 text-xl font-semibold text-[#263A2D]">
          Odayı Değiştir
        </h3>

        <p className="mt-2 text-xs leading-5 text-[#7D817B]">
          Aynı tipteki odaların müsaitlik, yatak düzeni ve kapasite bilgilerini karşılaştırabilirsiniz.
        </p>

        <div className="mt-5 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
          {rooms.map((room) => {
            const disabled = !room.isAvailable && !room.isCurrent;

            const capacityInsufficient =
              typeof room.maxGuests === "number" && room.maxGuests < guestCount;

            const bedLabel =
              ROOM_BED_OPTIONS.find((option) => option.value === room.bedConfiguration)?.label ??
              null;

            const status = room.isCurrent
              ? "Mevcut"
              : capacityInsufficient
                ? "Kapasite Yetersiz"
                : room.isAvailable
                  ? "Müsait"
                  : "Dolu";

            return (
              <button
                key={room.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectRoom(room.id)}
                className={`flex w-full items-center justify-between border p-3 text-left ${
                  selectedRoomId === room.id
                    ? "border-[#263A2D] bg-[#F3F5F1]"
                    : "border-[#E3E0D8] bg-white"
                } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#263A2D]">{room.roomName}</p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#969990]">
                    {room.roomNumber ?? "—"}
                  </p>

                  {(bedLabel || room.maxGuests) && (
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#6F756E]">
                      {bedLabel && (
                        <span className="flex items-center gap-1">
                          <BedDouble size={12} aria-hidden="true" />
                          {bedLabel}
                        </span>
                      )}

                      {room.maxGuests && (
                        <span className="flex items-center gap-1">
                          <Users size={12} aria-hidden="true" />
                          Maks. {room.maxGuests} kişi
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <span
                  className={`text-[10px] font-semibold ${
                    room.isCurrent
                      ? "text-[#A8754F]"
                      : capacityInsufficient
                        ? "text-[#98584E]"
                        : room.isAvailable
                          ? "text-[#4F6A4F]"
                          : "text-[#98584E]"
                  }`}
                >
                  {status}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs text-[#98584E]">
            {error}
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isChanging}
            className="h-11 border border-[#DDD9D1] text-xs font-semibold text-[#263A2D]"
          >
            Vazgeç
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isChanging || !selectedRoomId}
            className="flex h-11 items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-50"
          >
            {isChanging && <Loader2 size={15} className="animate-spin" />}
            Odayı Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
