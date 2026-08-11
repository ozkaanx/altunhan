"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function approveReservation(
  id: number,
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("reservations")
      .update({
        status: "confirmed",
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

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

  revalidatePath(
    "/admin/reservations",
  );

  return {
    success: true,
  };
}

export async function rejectReservation(
  id: number,
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("reservations")
      .update({
        status: "rejected",
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

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

  revalidatePath(
    "/admin/reservations",
  );

  return {
    success: true,
  };
}

export async function getReceiptSignedUrl(
  storagePath: string,
) {
  const supabase =
    await createClient();

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
    };
  }

  return {
    success: true,
    url: data.signedUrl,
  };
}