"use server";

import { requireAdmin } from "@/lib/auth/admin";

const RECEIPT_URL_EXPIRES_IN_SECONDS = 60 * 10;

export async function getReceiptSignedUrl(storagePath: string) {
  const cleanStoragePath = storagePath.trim();

  if (!cleanStoragePath) {
    return {
      success: false as const,
      message: "Dekont dosya yolu geçersiz.",
      url: null,
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
      url: null,
    };
  }

  const { data, error } = await auth.supabase.storage
    .from("reservation-receipts")
    .createSignedUrl(cleanStoragePath, RECEIPT_URL_EXPIRES_IN_SECONDS);

  if (error || !data) {
    console.error("Dekont URL oluşturulamadı:", error);

    return {
      success: false as const,
      message: error?.message ?? "Dekont açılamadı.",
      url: null,
    };
  }

  return {
    success: true as const,
    url: data.signedUrl,
  };
}
