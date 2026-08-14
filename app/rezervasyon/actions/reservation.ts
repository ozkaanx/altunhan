"use server";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  ReservationCreateInput,
  ReservationCreateResult,
} from "@/types/public-reservation";

type ReservationRpcResult = {
  reservation_id: number;
  reservation_code: string;
  accommodation_title: string;
  night_count: number;
  total_price: number;
};

export async function createPublicReservation(
  values:
    ReservationCreateInput,
): Promise<ReservationCreateResult> {
  const guestName =
    values.guestName.trim();

  const guestPhone =
    values.guestPhone.trim();

  const guestEmail =
    values.guestEmail
      .trim()
      .toLowerCase();

  if (
    !values.accommodationId ||
    !values.checkIn ||
    !values.checkOut ||
    !guestName ||
    !guestPhone ||
    !guestEmail
  ) {
    return {
      success: false,
      message:
        "Lütfen zorunlu alanları doldurun.",
    };
  }

  if (
    !Number.isInteger(
      values.adultCount,
    ) ||
    values.adultCount < 1
  ) {
    return {
      success: false,
      message:
        "En az 1 yetişkin seçilmelidir.",
    };
  }

  if (
    !Number.isInteger(
      values.childCount,
    ) ||
    values.childCount < 0
  ) {
    return {
      success: false,
      message:
        "Çocuk sayısı geçersiz.",
    };
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailPattern.test(
      guestEmail,
    )
  ) {
    return {
      success: false,
      message:
        "Lütfen geçerli bir e-posta adresi girin.",
    };
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "create_public_reservation_v2",
    {
      p_accommodation_id:
        values.accommodationId,

      p_check_in:
        values.checkIn,

      p_check_out:
        values.checkOut,

      p_adult_count:
        values.adultCount,

      p_child_count:
        values.childCount,

      p_guest_name:
        guestName,

      p_guest_phone:
        guestPhone,

      p_guest_email:
        guestEmail,
    },
  );

  if (error) {
    console.error(
      "Rezervasyon oluşturulamadı:",
      error,
    );

    return {
      success: false,
      message:
        error.message ??
        "Rezervasyon oluşturulamadı.",
    };
  }

  const reservation =
    (
      data as
        | ReservationRpcResult[]
        | null
    )?.[0];

  if (!reservation) {
    return {
      success: false,
      message:
        "Rezervasyon oluşturulamadı.",
    };
  }

  return {
    success: true,

    reservation: {
      id: Number(
        reservation.reservation_id,
      ),

      reservationCode:
        reservation.reservation_code,

      accommodationTitle:
        reservation.accommodation_title,

      checkIn:
        values.checkIn,

      checkOut:
        values.checkOut,

      nightCount:
        Number(
          reservation.night_count,
        ),

      totalPrice:
        Number(
          reservation.total_price,
        ),
    },
  };
}