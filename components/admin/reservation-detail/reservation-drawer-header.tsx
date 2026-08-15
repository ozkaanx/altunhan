import { X } from "lucide-react";

type ReservationDrawerHeaderProps = {
  reservationCode: string;
  guestName: string;
  onClose: () => void;
};

export function ReservationDrawerHeader({
  reservationCode,
  guestName,
  onClose,
}: ReservationDrawerHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5E1D8] bg-white px-4 py-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8754F]">
          {reservationCode}
        </p>

        <h2 className="mt-1 text-lg font-semibold text-[#263A2D]">{guestName}</h2>
      </div>

      <button
        type="button"
        aria-label="Rezervasyon detayını kapat"
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center border border-[#DDD9D1]"
      >
        <X size={18} />
      </button>
    </header>
  );
}
