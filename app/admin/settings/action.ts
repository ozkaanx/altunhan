"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  SiteSettingsFormValues,
} from "@/types/site-settings";

export async function updateSiteSettings(
  values: SiteSettingsFormValues,
) {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
    error:
      authError,
  } =
    await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    return {
      success: false,

      message:
        "Bu işlem için yönetici girişi yapmanız gerekiyor.",
    };
  }

  const bankAccountHolder =
    values.bankAccountHolder.trim();

  const bankName =
    values.bankName.trim();

  const iban =
    values.iban
      .trim()
      .toUpperCase();

  const phone =
    values.phone.trim();

  const whatsapp =
    values.whatsapp.trim();

  const email =
    values.email
      .trim()
      .toLowerCase();

  const address =
    values.address.trim();

  if (
    !bankAccountHolder
  ) {
    return {
      success: false,

      message:
        "Hesap sahibi alanı zorunludur.",
    };
  }

  if (
    iban &&
    !iban.startsWith(
      "TR",
    )
  ) {
    return {
      success: false,

      message:
        "IBAN TR ile başlamalıdır.",
    };
  }

  const {
    error,
  } =
    await supabase
      .from(
        "site_settings",
      )
      .upsert(
        {
          id: 1,

          bank_account_holder:
            bankAccountHolder,

          bank_name:
            bankName,

          iban,

          phone,

          whatsapp,

          email,

          address,

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "id",
        },
      );

  if (error) {
    console.error(
      "Ayarlar kaydedilemedi:",
      error,
    );

    return {
      success: false,

      message:
        error.message,
    };
  }

  revalidatePath(
    "/admin/settings",
  );

  revalidatePath(
    "/rezervasyon",
  );

  revalidatePath(
    "/rezervasyon/takip",
  );

  revalidatePath(
    "/",
  );

  return {
    success: true,

    message:
      "Ayarlar başarıyla kaydedildi.",
  };
}