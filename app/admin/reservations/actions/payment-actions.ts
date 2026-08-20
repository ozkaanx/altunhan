"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { notifyReservationDecision } from "@/lib/notifications/reservation-emails";

import type { ReservationPaymentMethod } from "@/types/reservation";

const MAX_NOTE_LENGTH = 500;

type VerifyPaymentRpcRow = {
  reservation_id: number;
  reservation_confirmed: boolean;
  confirmed_payment_amount: number;
  deposit_remaining_amount: number;
  total_remaining_amount: number;
};

function revalidatePaymentPaths() {
  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
  revalidatePath("/rezervasyon/takip");
}

export async function verifyReservationPayment(paymentId: number, receivedAmount: number) {
  if (!Number.isInteger(paymentId) || paymentId <= 0) {
    return {
      success: false as const,
      message: "Ödeme kaydı geçersiz.",
    };
  }

  if (!Number.isFinite(receivedAmount) || receivedAmount <= 0) {
    return {
      success: false as const,
      message: "Bankaya gelen tutar sıfırdan büyük olmalıdır.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase.rpc("verify_admin_reservation_payment", {
    p_payment_id: paymentId,
    p_received_amount: receivedAmount,
  });

  const result = (data as VerifyPaymentRpcRow[] | null)?.[0];

  if (error || !result) {
    console.error("Dekont ödemesi doğrulanamadı:", error);

    return {
      success: false as const,
      message: error?.message ?? "Ödeme doğrulanamadı.",
    };
  }

  if (result.reservation_confirmed) {
    try {
      await notifyReservationDecision(auth.supabase, Number(result.reservation_id), "confirmed");
    } catch (notificationError) {
      console.error("Rezervasyon onay maili gönderilemedi:", notificationError);
    }
  }

  revalidatePaymentPaths();

  return {
    success: true as const,
    reservationConfirmed: Boolean(result.reservation_confirmed),
    confirmedPaymentAmount: Number(result.confirmed_payment_amount),
    depositRemainingAmount: Number(result.deposit_remaining_amount),
    totalRemainingAmount: Number(result.total_remaining_amount),
  };
}

export async function rejectReservationPayment(paymentId: number, reason: string) {
  if (!Number.isInteger(paymentId) || paymentId <= 0) {
    return {
      success: false as const,
      message: "Ödeme kaydı geçersiz.",
    };
  }

  const cleanReason = reason.trim();

  if (cleanReason.length < 3 || cleanReason.length > MAX_NOTE_LENGTH) {
    return {
      success: false as const,
      message: `Dekont açıklaması 3-${MAX_NOTE_LENGTH} karakter arasında olmalıdır.`,
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase.rpc("reject_admin_reservation_payment", {
    p_payment_id: paymentId,
    p_reason: cleanReason,
  });

  if (error || !data) {
    console.error("Dekont reddedilemedi:", error);

    return {
      success: false as const,
      message: error?.message ?? "Dekont reddedilemedi.",
    };
  }

  revalidatePaymentPaths();

  return {
    success: true as const,
  };
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

  if (cleanNote.length > MAX_NOTE_LENGTH) {
    return {
      success: false as const,
      message: `Ödeme notu en fazla ${MAX_NOTE_LENGTH} karakter olabilir.`,
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

export async function voidReservationPayment(paymentId: number, reason: string) {
  if (!Number.isInteger(paymentId) || paymentId <= 0) {
    return {
      success: false as const,
      message: "Ödeme kaydı geçersiz.",
    };
  }

  const cleanReason = reason.trim();

  if (cleanReason.length < 3 || cleanReason.length > MAX_NOTE_LENGTH) {
    return {
      success: false as const,
      message: `İptal açıklaması 3-${MAX_NOTE_LENGTH} karakter arasında olmalıdır.`,
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
