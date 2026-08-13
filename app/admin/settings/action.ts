"use server";

import { revalidatePath } from "next/cache";

import type { SiteSettingsFormValues } from "@/types/site-settings";

import { requireAdmin } from "@/lib/auth/admin";

export async function updateSiteSettings(values: SiteSettingsFormValues) {
  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false,
      message: auth.message,
    };
  }

  const { supabase } = auth;

  const bankAccountHolder = values.bankAccountHolder.trim();

  const bankName = values.bankName.trim();

  const iban = values.iban.trim().toUpperCase();

  const phone = values.phone.trim();

  const whatsapp = values.whatsapp.trim();

  const email = values.email.trim().toLowerCase();

  const address = values.address.trim();

  if (!bankAccountHolder) {
    return {
      success: false,

      message: "Hesap sahibi alanı zorunludur.",
    };
  }

  if (iban && !iban.startsWith("TR")) {
    return {
      success: false,

      message: "IBAN TR ile başlamalıdır.",
    };
  }

  const { error } = await supabase.from("site_settings").upsert(
    {
      id: 1,

      bank_account_holder: bankAccountHolder,

      bank_name: bankName,

      iban,

      phone,

      whatsapp,

      email,

      address,

      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    console.error("Ayarlar kaydedilemedi:", error);

    return {
      success: false,

      message: error.message,
    };
  }

  revalidatePath("/admin/settings");

  revalidatePath("/rezervasyon");

  revalidatePath("/rezervasyon/takip");

  revalidatePath("/");

  return {
    success: true,

    message: "Ayarlar başarıyla kaydedildi.",
  };
}
