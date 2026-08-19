"use server";

import { createClient } from "@/lib/supabase/server";

import type { ReservationCreateInput, ReservationCreateResult } from "@/types/public-reservation";
import { publicReservationSchema } from "@/lib/reservation/reservation-schema";

type ReservationRpcResult = {
  reservation_id: number;
  reservation_code: string;
  accommodation_title: string;
  night_count: number;
  total_price: number;
  payment_plan: "deposit" | "full";
  deposit_target_amount: number;
  amount_due_now: number;
};

export async function createPublicReservation(
  values: ReservationCreateInput,
): Promise<ReservationCreateResult> {
  const validationResult = publicReservationSchema.safeParse(values);

  if (!validationResult.success) {
    return {
      success: false,
      message: validationResult.error.issues[0]?.message ?? "Rezervasyon bilgileri geçersiz.",
    };
  }

  const input = validationResult.data;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_public_reservation_v4", {
    p_accommodation_id: input.accommodationId,

    p_check_in: input.checkIn,
    p_check_out: input.checkOut,

    p_adult_count: input.adultCount,
    p_child_count: input.childCount,

    p_guest_name: input.guestName,
    p_guest_identity_number: input.guestIdentityNumber,
    p_guest_phone: input.guestPhone,
    p_guest_email: input.guestEmail,
  });

  if (error) {
    console.error("Rezervasyon oluşturulamadı:", error);

    return {
      success: false,
      message: error.message ?? "Rezervasyon oluşturulamadı.",
    };
  }

  const reservation = (data as ReservationRpcResult[] | null)?.[0];

  if (!reservation) {
    return {
      success: false,
      message: "Rezervasyon oluşturulamadı.",
    };
  }

  return {
    success: true,

    reservation: {
      id: Number(reservation.reservation_id),

      reservationCode: reservation.reservation_code,

      accommodationTitle: reservation.accommodation_title,

      checkIn: input.checkIn,
      checkOut: input.checkOut,

      nightCount: Number(reservation.night_count),

      totalPrice: Number(reservation.total_price),

      paymentPlan: reservation.payment_plan,

      depositTargetAmount: Number(reservation.deposit_target_amount),

      amountDueNow: Number(reservation.amount_due_now),
    },
  };
}
