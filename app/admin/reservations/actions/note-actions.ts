"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";

const MAX_ADMIN_NOTE_LENGTH = 500;

export async function updateReservationAdminNote(reservationId: number, adminNote: string) {
  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    return {
      success: false as const,
      message: "Rezervasyon bilgisi geçersiz.",
    };
  }

  const cleanNote = adminNote.trim();

  if (cleanNote.length > MAX_ADMIN_NOTE_LENGTH) {
    return {
      success: false as const,
      message: `Admin notu en fazla ${MAX_ADMIN_NOTE_LENGTH} karakter olabilir.`,
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase
    .from("reservations")
    .update({ admin_note: cleanNote || null })
    .eq("id", reservationId)
    .select("admin_note")
    .maybeSingle();

  if (error) {
    console.error("Rezervasyon admin notu güncellenemedi:", error);

    return {
      success: false as const,
      message: "Admin notu güncellenemedi.",
    };
  }

  if (!data) {
    return {
      success: false as const,
      message: "Rezervasyon bulunamadı.",
    };
  }

  revalidatePath("/admin/reservations");

  return {
    success: true as const,
    adminNote: data.admin_note,
  };
}
