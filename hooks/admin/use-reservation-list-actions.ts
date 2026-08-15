"use client";

import { useRouter } from "next/navigation";

import {
  approveReservation,
  cancelReservation,
  rejectReservation,
} from "@/app/admin/reservations/action";

import type { Reservation } from "@/types/reservation";

type UseReservationListActionsParams = {
  onSuccess: () => void;
};

export function useReservationListActions({ onSuccess }: UseReservationListActionsParams) {
  const router = useRouter();

  const completeAction = () => {
    onSuccess();
    router.refresh();
  };

  const handleApprove = async (reservation: Reservation) => {
    const result = await approveReservation(reservation.id);

    if (!result.success) {
      return result;
    }

    completeAction();

    return {
      success: true,
    };
  };

  const handleReject = async (reservation: Reservation, reason: string) => {
    const result = await rejectReservation(reservation.id, reason);

    if (!result.success) {
      return result;
    }

    completeAction();

    return {
      success: true,
    };
  };

  const handleCancel = async (reservation: Reservation, reason: string) => {
    const result = await cancelReservation(reservation.id, reason);

    if (!result.success) {
      return result;
    }

    completeAction();

    return {
      success: true,
    };
  };

  return {
    handleApprove,
    handleReject,
    handleCancel,
  };
}
