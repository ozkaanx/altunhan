"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";

import type { ReservationPaymentMethod, ReservationPaymentPlan } from "@/types/reservation";

const MAX_PAYMENT_NOTE_LENGTH = 500;

function revalidatePaymentPaths() {
  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
  revalidatePath("/rezervasyon/takip");
}

export async function recordReservationPayment(
  reservationId: number,
  amount: number,
  paymentMethod: ReservationPaymentMethod,
  adminNote: string,
) {
  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    return {
      success: false as const,
      message: "Rezervasyon bilgisi geçersiz.",
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      success: false as const,
      message: "Ödeme tutarı sıfırdan büyük olmalıdır.",
    };
  }

  const cleanNote = adminNote.trim();

  if (cleanNote.length > MAX_PAYMENT_NOTE_LENGTH) {
    return {
      success: false as const,
      message: `Ödeme notu en fazla ${MAX_PAYMENT_NOTE_LENGTH} karakter olabilir.`,
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase.rpc("record_admin_reservation_payment", {
    p_reservation_id: reservationId,
    p_amount: amount,
    p_payment_method: paymentMethod,
    p_admin_note: cleanNote || null,
  });

  if (error || !data) {
    console.error("Rezervasyon ödemesi kaydedilemedi:", error);

    return {
      success: false as const,
      message: error?.message ?? "Ödeme kaydedilemedi.",
    };
  }

  revalidatePaymentPaths();

  return {
    success: true as const,
  };
}

export async function updateReservationPaymentPlan(
  reservationId: number,
  paymentPlan: ReservationPaymentPlan,
  depositTargetAmount: number | null,
) {
  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    return {
      success: false as const,
      message: "Rezervasyon bilgisi geçersiz.",
    };
  }

  if (paymentPlan === "deposit") {
    if (
      depositTargetAmount === null ||
      !Number.isFinite(depositTargetAmount) ||
      depositTargetAmount <= 0
    ) {
      return {
        success: false as const,
        message: "Geçerli bir kapora tutarı girin.",
      };
    }
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase.rpc("update_admin_reservation_payment_plan", {
    p_reservation_id: reservationId,
    p_payment_plan: paymentPlan,
    p_deposit_target_amount: paymentPlan === "deposit" ? depositTargetAmount : null,
  });

  if (error || !data) {
    console.error("Rezervasyon ödeme planı güncellenemedi:", error);

    return {
      success: false as const,
      message: error?.message ?? "Ödeme planı güncellenemedi.",
    };
  }

  revalidatePaymentPaths();

  return {
    success: true as const,
  };
}

export async function voidReservationPayment(paymentId: number, reason: string) {
  if (!Number.isInteger(paymentId) || paymentId <= 0) {
    return {
      success: false as const,
      message: "Ödeme kaydı geçersiz.",
    };
  }

  const cleanReason = reason.trim();

  if (cleanReason.length < 3 || cleanReason.length > MAX_PAYMENT_NOTE_LENGTH) {
    return {
      success: false as const,
      message: `İptal açıklaması 3-${MAX_PAYMENT_NOTE_LENGTH} karakter arasında olmalıdır.`,
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase.rpc("void_admin_reservation_payment", {
    p_payment_id: paymentId,
    p_reason: cleanReason,
  });

  if (error || !data) {
    console.error("Rezervasyon ödemesi iptal edilemedi:", error);

    return {
      success: false as const,
      message: error?.message ?? "Tahsilat kaydı iptal edilemedi.",
    };
  }

  revalidatePaymentPaths();

  return {
    success: true as const,
  };
}
