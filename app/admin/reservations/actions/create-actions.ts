"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";

export type CreateAdminReservationInput = {
  accommodationId: number;
  roomId: number | null;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  status: "pending_payment" | "pending_approval" | "confirmed";
  source: "phone" | "whatsapp" | "walk_in" | "admin";
  adminNote: string;
};

export async function createAdminReservation(values: CreateAdminReservationInput) {
  if (!Number.isInteger(values.adultCount) || values.adultCount < 1) {
    return {
      success: false as const,
      message: "En az 1 yetişkin seçilmelidir.",
    };
  }

  if (!Number.isInteger(values.childCount) || values.childCount < 0) {
    return {
      success: false as const,
      message: "Çocuk sayısı geçersiz.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase.rpc("create_admin_reservation_v2", {
    p_accommodation_id: values.accommodationId,
    p_room_id: values.roomId,

    p_check_in: values.checkIn,
    p_check_out: values.checkOut,

    p_adult_count: values.adultCount,
    p_child_count: values.childCount,

    p_guest_name: values.guestName.trim(),
    p_guest_phone: values.guestPhone.trim(),

    p_guest_email: values.guestEmail.trim() || null,

    p_status: values.status,
    p_source: values.source,

    p_admin_note: values.adminNote.trim() || null,
  });

  if (error) {
    console.error("Manuel rezervasyon oluşturulamadı:", error);

    return {
      success: false as const,
      message: error.message,
    };
  }

  const reservation = data?.[0];

  if (!reservation) {
    return {
      success: false as const,
      message: "Rezervasyon oluşturulamadı.",
    };
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/rooms");
  revalidatePath("/admin");
  revalidatePath("/rezervasyon");

  return {
    success: true as const,

    reservation: {
      id: Number(reservation.reservation_id),

      reservationCode: reservation.reservation_code,

      roomId: Number(reservation.room_id),

      roomName: reservation.room_name,
      roomNumber: reservation.room_number,

      totalPrice: Number(reservation.total_price),
    },
  };
}
