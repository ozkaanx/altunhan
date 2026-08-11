"use server";

import { createClient } from "@/lib/supabase/server";

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
  values: ReservationCreateInput,
): Promise<ReservationCreateResult> {
  const supabase =
    await createClient();

  if (
    !values.accommodationId ||
    !values.checkIn ||
    !values.checkOut ||
    !values.guestName.trim() ||
    !values.guestPhone.trim()
  ) {
    return {
      success: false,
      message:
        "Lütfen zorunlu alanları doldurun.",
    };
  }

  const { data, error } =
    await supabase.rpc(
      "create_public_reservation",
      {
        p_accommodation_id:
          values.accommodationId,

        p_check_in:
          values.checkIn,

        p_check_out:
          values.checkOut,

        p_guest_count:
          values.guestCount,

        p_guest_name:
          values.guestName,

        p_guest_phone:
          values.guestPhone,

        p_guest_email:
          values.guestEmail || null,
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
      data as ReservationRpcResult[]
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

export async function saveReceiptPath(
  reservationId: number,
  reservationCode: string,
  storagePath: string,
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase.rpc(
      "submit_reservation_receipt",
      {
        p_reservation_id:
          reservationId,

        p_reservation_code:
          reservationCode,

        p_storage_path:
          storagePath,
      },
    );

  if (error) {
    console.error(
      "Dekont kaydedilemedi:",
      error,
    );

    return {
      success: false,
      message:
        error.message,
    };
  }

  if (!data) {
    return {
      success: false,
      message:
        "Dekont kaydedilemedi.",
    };
  }

  return {
    success: true,
  };
}