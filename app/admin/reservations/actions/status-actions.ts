"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { notifyReservationDecision } from "@/lib/notifications/reservation-emails";

function isValidReservationId(id: number) {
  return Number.isInteger(id) && id > 0;
}

function revalidateReservationPaths() {
  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
  revalidatePath("/admin/rooms");
  revalidatePath("/admin/reports");
  revalidatePath("/rezervasyon");
  revalidatePath("/rezervasyon/takip");
}

export async function rejectReservation(id: number, reason: string) {
  if (!isValidReservationId(id)) {
    return {
      success: false as const,
      message: "Geçersiz rezervasyon.",
    };
  }

  const cleanReason = reason.trim();

  if (cleanReason.length < 5) {
    return {
      success: false as const,
      message: "Lütfen en az 5 karakterlik bir red sebebi yazın.",
    };
  }

  if (cleanReason.length > 500) {
    return {
      success: false as const,
      message: "Red sebebi en fazla 500 karakter olabilir.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { supabase } = auth;

  const { data, error } = await supabase
    .from("reservations")
    .update({
      status: "rejected",
      rejection_reason: cleanReason,
      cancellation_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending_approval")
    .select("id");

  if (error) {
    console.error("Rezervasyon reddedilemedi:", error);

    return {
      success: false as const,
      message: error.message,
    };
  }

  if (!data?.length) {
    return {
      success: false as const,
      message: "Rezervasyon bulunamadı veya artık onay beklemiyor.",
    };
  }

  const { error: paymentError } = await supabase
    .from("reservation_payments")
    .update({
      status: "rejected",
      admin_note: cleanReason,
      updated_at: new Date().toISOString(),
    })
    .eq("reservation_id", id)
    .eq("status", "pending");

  if (paymentError) {
    console.error("Bekleyen dekont ödemesi reddedilemedi:", paymentError);
  }

  try {
    await notifyReservationDecision(supabase, id, "rejected", cleanReason);
  } catch (notificationError) {
    console.error("Rezervasyon red maili gönderilemedi:", notificationError);
  }

  revalidateReservationPaths();

  return {
    success: true as const,
  };
}

export async function cancelReservation(
  id: number,
  reason: string,
  expectedStatus: "pending_payment" | "confirmed",
) {
  if (!isValidReservationId(id)) {
    return {
      success: false as const,
      message: "Geçersiz rezervasyon.",
    };
  }

  const cleanReason = reason.trim();

  if (cleanReason.length < 5) {
    return {
      success: false as const,
      message: "Lütfen en az 5 karakterlik bir iptal sebebi yazın.",
    };
  }

  if (cleanReason.length > 500) {
    return {
      success: false as const,
      message: "İptal sebebi en fazla 500 karakter olabilir.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { supabase } = auth;

  const { data, error } = await supabase
    .rpc("cancel_admin_reservation", {
      p_reservation_id: id,
      p_reason: cleanReason,
      p_expected_status: expectedStatus,
    });

  if (error) {
    console.error("Rezervasyon iptal edilemedi:", error);

    return {
      success: false as const,
      message: error.message,
    };
  }

  if (!data) {
    return {
      success: false as const,
      message: "Rezervasyon iptal edilemedi.",
    };
  }

  revalidateReservationPaths();

  return {
    success: true as const,
  };
}
