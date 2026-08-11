"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      success: false as const,
      supabase,
      message:
        "Bu işlem için yönetici girişi yapmanız gerekiyor.",
    };
  }

  return {
    success: true as const,
    supabase,
  };
}

export async function approveReservation(
  id: number,
) {
  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false,
      message: auth.message,
    };
  }

  const { supabase } = auth;

  const { data, error } =
    await supabase
      .from("reservations")
      .update({
        status: "confirmed",
        rejection_reason: null,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .eq(
        "status",
        "pending_approval",
      )
      .select("id");

  if (error) {
    console.error(
      "Rezervasyon onaylanamadı:",
      error,
    );

    return {
      success: false,
      message: error.message,
    };
  }

  if (!data?.length) {
    return {
      success: false,
      message:
        "Rezervasyon bulunamadı veya artık onay beklemiyor.",
    };
  }

  revalidatePath(
    "/admin/reservations",
  );

  revalidatePath(
    "/rezervasyon/takip",
  );

  return {
    success: true,
  };
}

export async function rejectReservation(
  id: number,
  reason: string,
) {
  const cleanReason =
    reason.trim();

  if (
    cleanReason.length < 5
  ) {
    return {
      success: false,
      message:
        "Lütfen en az 5 karakterlik bir red sebebi yazın.",
    };
  }

  if (
    cleanReason.length > 500
  ) {
    return {
      success: false,
      message:
        "Red sebebi en fazla 500 karakter olabilir.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false,
      message: auth.message,
    };
  }

  const { supabase } = auth;

  const { data, error } =
    await supabase
      .from("reservations")
      .update({
        status: "rejected",
        rejection_reason:
          cleanReason,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .eq(
        "status",
        "pending_approval",
      )
      .select("id");

  if (error) {
    console.error(
      "Rezervasyon reddedilemedi:",
      error,
    );

    return {
      success: false,
      message: error.message,
    };
  }

  if (!data?.length) {
    return {
      success: false,
      message:
        "Rezervasyon bulunamadı veya artık onay beklemiyor.",
    };
  }

  revalidatePath(
    "/admin/reservations",
  );

  revalidatePath(
    "/rezervasyon/takip",
  );

  return {
    success: true,
  };
}

export async function getReceiptSignedUrl(
  storagePath: string,
) {
  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false,
      message: auth.message,
      url: null,
    };
  }

  const { supabase } = auth;

  const { data, error } =
    await supabase.storage
      .from(
        "reservation-receipts",
      )
      .createSignedUrl(
        storagePath,
        60 * 10,
      );

  if (error || !data) {
    console.error(
      "Dekont URL oluşturulamadı:",
      error,
    );

    return {
      success: false,
      message:
        error?.message ??
        "Dekont açılamadı.",
      url: null,
    };
  }

  return {
    success: true,
    url: data.signedUrl,
  };
}