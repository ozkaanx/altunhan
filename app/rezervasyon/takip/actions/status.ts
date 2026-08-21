"use server";

import { createClient } from "@/lib/supabase/server";

import type {
  ReservationPaymentPlan,
  ReservationPaymentStatus,
  ReservationStatus,
} from "@/types/reservation";
import type { ReservationTrackingResponse } from "@/types/reservation-tracking";
import { normalizeTurkishMobilePhone } from "@/lib/phone";

type ReservationTrackingRpcRow = {
  reservation_code: string;

  guest_name: string;

  accommodation_title: string;

  check_in: string;

  check_out: string;

  guest_count: number;

  adult_count: number;

  child_count: number;

  night_count: number;

  total_price: number;

  payment_plan: ReservationPaymentPlan;

  deposit_target_amount: number;

  confirmed_payment_amount: number;

  amount_due_now: number;

  remaining_payment_amount: number;

  payment_status: ReservationPaymentStatus;

  status: ReservationStatus;

  has_receipt: boolean;

  has_pending_receipt: boolean;

  last_payment_note: string | null;

  rejection_reason: string | null;

  cancellation_reason: string | null;
};

export async function findReservation(
  reservationCode: string,
  phone: string,
): Promise<ReservationTrackingResponse> {
  const code = reservationCode.trim();

  const normalizedPhone = normalizeTurkishMobilePhone(phone);

  if (!code) {
    return {
      success: false,
      message: "Rezervasyon numaranızı girin.",
    };
  }

  if (!normalizedPhone) {
    return {
      success: false,
      message: "Telefon numaranızı 5XX XXX XX XX biçiminde girin.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_public_reservation_status_v3", {
    p_reservation_code: code,

    p_guest_phone: normalizedPhone,
  });

  if (error) {
    console.error("Rezervasyon sorgulanamadı:", error);

    return {
      success: false,
      message: "Rezervasyon sorgulanırken bir hata oluştu.",
    };
  }

  const reservation = (data as ReservationTrackingRpcRow[] | null)?.[0];

  if (!reservation) {
    return {
      success: false,
      message: "Bu rezervasyon numarası ve telefon bilgisiyle eşleşen bir rezervasyon bulunamadı.",
    };
  }

  const isClosedReservation =
    reservation.status === "cancelled" || reservation.status === "rejected";

  return {
    success: true,

    reservation: {
      reservationCode: reservation.reservation_code,

      guestName: reservation.guest_name,

      accommodationTitle: reservation.accommodation_title,

      checkIn: reservation.check_in,

      checkOut: reservation.check_out,

      adultCount: Number(reservation.adult_count),

      childCount: Number(reservation.child_count),

      nightCount: Number(reservation.night_count),

      totalPrice: Number(reservation.total_price),

      paymentPlan: reservation.payment_plan,

      depositTargetAmount: Number(reservation.deposit_target_amount),

      confirmedPaymentAmount: Number(reservation.confirmed_payment_amount),

      amountDueNow: isClosedReservation ? 0 : Number(reservation.amount_due_now),

      remainingPaymentAmount: isClosedReservation
        ? 0
        : Number(reservation.remaining_payment_amount),

      paymentStatus: reservation.payment_status,

      status: reservation.status,

      hasReceipt: reservation.has_receipt,

      hasPendingReceipt: reservation.has_pending_receipt,

      lastPaymentNote: reservation.last_payment_note,

      rejectionReason: reservation.rejection_reason,

      cancellationReason: reservation.cancellation_reason,
    },
  };
}
