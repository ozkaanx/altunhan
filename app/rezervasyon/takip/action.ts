"use server";

import { createClient } from "@/lib/supabase/server";

import type {
  PublicReservationStatus,
  ReservationTrackingResponse,
} from "@/types/reservation-tracking";

type ReservationTrackingRpcRow = {
  reservation_code: string;

  guest_name: string;

  accommodation_title: string;

  check_in: string;

  check_out: string;

  guest_count: number;

  night_count: number;

  total_price: number;

  status: PublicReservationStatus;

  has_receipt: boolean;

  rejection_reason: string | null;

  cancellation_reason: string | null;
};

export async function findReservation(
  reservationCode: string,
  phone: string,
): Promise<ReservationTrackingResponse> {
  const code =
    reservationCode.trim();

  const normalizedPhone =
    phone.trim();

  if (!code) {
    return {
      success: false,
      message:
        "Rezervasyon numaranızı girin.",
    };
  }

  if (!normalizedPhone) {
    return {
      success: false,
      message:
        "Telefon numaranızı girin.",
    };
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_public_reservation_status",
    {
      p_reservation_code:
        code,

      p_guest_phone:
        normalizedPhone,
    },
  );

  if (error) {
    console.error(
      "Rezervasyon sorgulanamadı:",
      error,
    );

    return {
      success: false,
      message:
        "Rezervasyon sorgulanırken bir hata oluştu.",
    };
  }

  const reservation =
    (
      data as ReservationTrackingRpcRow[]
    )?.[0];

  if (!reservation) {
    return {
      success: false,
      message:
        "Bu rezervasyon numarası ve telefon bilgisiyle eşleşen bir rezervasyon bulunamadı.",
    };
  }

  return {
    success: true,

    reservation: {
      reservationCode:
        reservation.reservation_code,

      guestName:
        reservation.guest_name,

      accommodationTitle:
        reservation.accommodation_title,

      checkIn:
        reservation.check_in,

      checkOut:
        reservation.check_out,

      guestCount:
        Number(
          reservation.guest_count,
        ),

      nightCount:
        Number(
          reservation.night_count,
        ),

      totalPrice:
        Number(
          reservation.total_price,
        ),

      status:
        reservation.status,

      hasReceipt:
        reservation.has_receipt,

      rejectionReason:
        reservation.rejection_reason,

      cancellationReason:
        reservation.cancellation_reason,
    },
  };
}

export async function submitTrackedReceipt(
  reservationCode: string,
  phone: string,
  storagePath: string,
) {
  const code =
    reservationCode.trim();

  const normalizedPhone =
    phone.trim();

  if (!code) {
    return {
      success: false,
      message:
        "Rezervasyon numarası bulunamadı.",
    };
  }

  if (!normalizedPhone) {
    return {
      success: false,
      message:
        "Telefon numarası bulunamadı.",
    };
  }

  if (!storagePath) {
    return {
      success: false,
      message:
        "Dekont dosyası bulunamadı.",
    };
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "submit_tracked_reservation_receipt",
    {
      p_reservation_code:
        code,

      p_guest_phone:
        normalizedPhone,

      p_storage_path:
        storagePath,
    },
  );

  if (error) {
    console.error(
      "Takip ekranından dekont kaydedilemedi:",
      error,
    );

    return {
      success: false,
      message:
        error.message ??
        "Dekont kaydedilemedi.",
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