"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { getTurkeyToday } from "@/lib/admin/reservation-form-utils";
import { normalizeTurkishMobilePhone } from "@/lib/phone";
import { isValidTckn, normalizeTckn } from "@/lib/identity/tckn";

import type { ReservationPaymentMethod, ReservationStatus } from "@/types/reservation";

export type CreateAdminReservationInput = {
  accommodationId: number;
  roomId: number | null;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  guestName: string;
  guestIdentityNumber: string;
  guestPhone: string;
  guestEmail: string;
  source: "phone" | "whatsapp" | "walk_in" | "admin";
  adminNote: string;
  initialPaymentAmount: number;
  initialPaymentMethod: ReservationPaymentMethod | null;
  initialPaymentNote: string;
};

type CreateAdminReservationRpcRow = {
  reservation_id: number;
  reservation_code: string;
  room_id: number;
  room_name: string;
  room_number: string | null;
  total_price: number;
  deposit_target_amount: number;
  confirmed_payment_amount: number;
  remaining_payment_amount: number;
  status: ReservationStatus;
};

export async function createAdminReservation(values: CreateAdminReservationInput) {
  const today = getTurkeyToday();
  const normalizedGuestPhone = normalizeTurkishMobilePhone(values.guestPhone);
  const normalizedIdentityNumber = normalizeTckn(values.guestIdentityNumber);

  if (!values.checkIn || !values.checkOut) {
    return {
      success: false as const,
      message: "Giriş ve çıkış tarihleri zorunludur.",
    };
  }

  if (values.checkIn < today) {
    return {
      success: false as const,
      message: "Geçmiş bir tarih için rezervasyon oluşturulamaz.",
    };
  }

  if (values.checkOut <= values.checkIn) {
    return {
      success: false as const,
      message: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
    };
  }

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

  if (!normalizedGuestPhone) {
    return {
      success: false as const,
      message: "Telefon numarasını 5XX XXX XX XX biçiminde girin.",
    };
  }

  if (!isValidTckn(normalizedIdentityNumber)) {
    return {
      success: false as const,
      message: "Geçerli bir T.C. kimlik numarası girin.",
    };
  }

  if (!Number.isFinite(values.initialPaymentAmount) || values.initialPaymentAmount < 0) {
    return {
      success: false as const,
      message: "Alınan ödeme tutarı geçersiz.",
    };
  }

  if (values.initialPaymentAmount > 0 && !values.initialPaymentMethod) {
    return {
      success: false as const,
      message: "Ödeme yöntemi seçilmelidir.",
    };
  }

  if (values.initialPaymentNote.trim().length > 500) {
    return {
      success: false as const,
      message: "Ödeme notu en fazla 500 karakter olabilir.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase.rpc("create_admin_reservation_v5", {
    p_accommodation_id: values.accommodationId,
    p_room_id: values.roomId,

    p_check_in: values.checkIn,
    p_check_out: values.checkOut,

    p_adult_count: values.adultCount,
    p_child_count: values.childCount,

    p_guest_name: values.guestName.trim(),
    p_guest_identity_number: normalizedIdentityNumber,
    p_guest_phone: normalizedGuestPhone,

    p_guest_email: values.guestEmail.trim() || null,

    p_source: values.source,

    p_admin_note: values.adminNote.trim() || null,
    p_initial_payment_amount: values.initialPaymentAmount,
    p_initial_payment_method: values.initialPaymentMethod,
    p_initial_payment_note: values.initialPaymentNote.trim() || null,
  });

  if (error) {
    console.error("Manuel rezervasyon oluşturulamadı:", error);

    return {
      success: false as const,
      message: error.message,
    };
  }

  const reservation = (data as CreateAdminReservationRpcRow[] | null)?.[0];

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
      depositTargetAmount: Number(reservation.deposit_target_amount),
      confirmedPaymentAmount: Number(reservation.confirmed_payment_amount),
      remainingPaymentAmount: Number(reservation.remaining_payment_amount),
      status: reservation.status,
    },
  };
}
