import { Loader2 } from "lucide-react";

import type { ReservationRoomOption } from "@/types/admin-reservation-detail";

type ReservationRoomModalProps = {
  open: boolean;
  rooms: ReservationRoomOption[];
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
        className="relative z-10 flex max-h-[calc(100dvh-0.75rem)] w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:max-w-[520px]"
      >
        <div className="shrink-0 border-b border-[#EEEAE3] p-5 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8754F]">
            Fiziksel Oda
          </p>

          <h3 id="room-modal-title" className="mt-2 text-xl font-semibold text-[#263A2D]">
            Odayı Değiştir
          </h3>

          <p className="mt-2 text-xs leading-5 text-[#7D817B]">
            Sadece bu rezervasyon tarihleri için müsait olan aynı tipteki odalar seçilebilir.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 [-webkit-overflow-scrolling:touch]">
          <div className="space-y-2">
            {rooms.map((room) => {
              const disabled = !room.isAvailable && !room.isCurrent;

              const status = room.isCurrent ? "Mevcut" : room.isAvailable ? "Müsait" : "Dolu";

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
                  <div>
                    <p className="text-sm font-semibold text-[#263A2D]">{room.roomName}</p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#969990]">
                      {room.roomNumber ?? "—"}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-semibold ${
                      room.isCurrent
                        ? "text-[#A8754F]"
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
            <div
              role="alert"
              className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs text-[#98584E]"
            >
              {error}
            </div>
          )}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-[#EEEAE3] bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 sm:pb-5">
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
