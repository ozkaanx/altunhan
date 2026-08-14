"use server";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  notifyReceiptSubmitted,
} from "@/lib/notifications/reservation-emails";

type SubmitTrackedReceiptResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function submitTrackedReceipt(
  reservationCode: string,
  phone: string,
  storagePath: string,
): Promise<SubmitTrackedReceiptResult> {
  const code =
    reservationCode.trim();

  const normalizedPhone =
    phone.trim();

  const path =
    storagePath.trim();

  if (!code) {
    return {
      success: false,
      message:
        "Rezervasyon numarası bulunamadı.",
    };
  }

  if (!normalizedPhone) {
    return {
      success: false,
      message:
        "Telefon numarası bulunamadı.",
    };
  }

  if (!path) {
    return {
      success: false,
      message:
        "Dekont dosyası bulunamadı.",
    };
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "submit_tracked_reservation_receipt",
    {
      p_reservation_code:
        code,

      p_guest_phone:
        normalizedPhone,

      p_storage_path:
        path,
    },
  );

  if (error) {
    console.error(
      "Takip ekranından dekont kaydedilemedi:",
      error,
    );

    return {
      success: false,
      message:
        error.message ||
        "Dekont kaydedilemedi.",
    };
  }

  if (!data) {
    return {
      success: false,
      message:
        "Dekont kaydedilemedi.",
    };
  }

  try {
    await notifyReceiptSubmitted(
      supabase,
      code,
      path,
    );
  } catch (
    notificationError
  ) {
    console.error(
      "Takip dekont bildirimi gönderilemedi:",
      notificationError,
    );
  }

  return {
    success: true,
  };
}