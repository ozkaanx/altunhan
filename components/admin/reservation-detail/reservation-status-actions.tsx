import { Ban, XCircle } from "lucide-react";

import type { ReservationDrawerAction } from "@/types/admin-reservation-detail";

import type { Reservation } from "@/types/reservation";

type ReservationStatusActionsProps = {
  reservation: Reservation;
  onOpenAction: (action: ReservationDrawerAction) => void;
};

export function ReservationStatusActions({
  reservation,
  onOpenAction,
}: ReservationStatusActionsProps) {
  return (
    <>
      {reservation.status === "rejected" && reservation.rejection_reason && (
        <section className="border border-[#E5C7C0] bg-[#FFF8F6] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98584E]">
            Red Sebebi
          </p>

          <p className="mt-2 text-sm leading-6 text-[#6D625F]">{reservation.rejection_reason}</p>
        </section>
      )}

      {reservation.status === "cancelled" && reservation.cancellation_reason && (
        <section className="border border-[#DDD9D1] bg-[#F3F2EF] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#646A63]">
            İptal Sebebi
          </p>

          <p className="mt-2 text-sm leading-6 text-[#666B65]">{reservation.cancellation_reason}</p>
        </section>
      )}

      {reservation.status === "pending_approval" && (
        <button
          type="button"
          onClick={() => onOpenAction("reject")}
          className="flex h-12 w-full items-center justify-center gap-2 border border-[#D9B8B2] bg-white text-xs font-semibold text-[#9C5148]"
        >
          <XCircle size={16} />
          Rezervasyonu Reddet
        </button>
      )}

      {reservation.status === "confirmed" && (
        <button
          type="button"
          onClick={() => onOpenAction("cancel")}
          className="flex h-12 w-full items-center justify-center gap-2 border border-[#C7C5BF] bg-white text-xs font-semibold text-[#626660]"
        >
          <Ban size={16} />
          Rezervasyonu İptal Et
        </button>
      )}
    </>
  );
}
