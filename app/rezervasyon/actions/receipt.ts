"use server";

import { createClient } from "@/lib/supabase/server";

import { notifyReceiptSubmitted } from "@/lib/notifications/reservation-emails";

type SaveReceiptResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function saveReceiptPath(
  reservationId: number,
  reservationCode: string,
  storagePath: string,
): Promise<SaveReceiptResult> {
  if (!reservationId || !reservationCode.trim() || !storagePath.trim()) {
    return {
      success: false,
      message: "Dekont bilgileri eksik.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("submit_reservation_receipt", {
    p_reservation_id: reservationId,

    p_reservation_code: reservationCode,

    p_storage_path: storagePath,
  });

  if (error) {
    console.error("Dekont kaydedilemedi:", error);

    return {
      success: false,
      message: error.message || "Dekont kaydedilemedi.",
    };
  }

  if (!data) {
    return {
      success: false,
      message: "Dekont kaydedilemedi.",
    };
  }

  try {
    await notifyReceiptSubmitted(supabase, reservationCode, storagePath);
  } catch (notificationError) {
    console.error("Dekont bildirimi gönderilemedi:", notificationError);
  }

  return {
    success: true,
  };
}
