"use client";

import { useRouter } from "next/navigation";

import { cancelReservation, rejectReservation } from "@/app/admin/reservations/action";

import type { Reservation } from "@/types/reservation";

type ReservationListAction = "reject" | "cancel";

type UseReservationListActionsParams = {
  onSuccess: (action: ReservationListAction, reservation: Reservation) => void;
};

export function useReservationListActions({ onSuccess }: UseReservationListActionsParams) {
  const router = useRouter();

  const completeAction = (action: ReservationListAction, reservation: Reservation) => {
    onSuccess(action, reservation);
    router.refresh();
  };

  const handleReject = async (reservation: Reservation, reason: string) => {
    const result = await rejectReservation(reservation.id, reason);

    if (!result.success) {
      return result;
    }

    completeAction("reject", reservation);

    return { success: true };
  };

  const handleCancel = async (reservation: Reservation, reason: string) => {
    const result = await cancelReservation(reservation.id, reason);

    if (!result.success) {
      return result;
    }

    completeAction("cancel", reservation);

    return { success: true };
  };

  return {
    handleReject,
    handleCancel,
  };
}
