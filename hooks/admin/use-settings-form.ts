"use client";

import type { FormEvent } from "react";
import { useCallback, useState } from "react";

import { updateSiteSettings } from "@/app/admin/settings/action";

import type { SettingsFieldName, SettingsFormValues } from "@/types/admin-settings";
import type { SiteSettings } from "@/types/site-settings";

function getInitialValues(settings: SiteSettings): SettingsFormValues {
  return {
    bankAccountHolder: settings.bank_account_holder ?? "",
    bankName: settings.bank_name ?? "",
    iban: settings.iban ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
    instagram: settings.instagram ?? "",
    map_url: settings.map_url ?? "",
    map_embed_url: settings.map_embed_url ?? "",
  };
}

export function useSettingsForm(settings: SiteSettings, heroImageUrl: string) {
  const [values, setValues] = useState<SettingsFormValues>(() => getInitialValues(settings));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateField = useCallback(
    <Field extends SettingsFieldName>(field: Field, value: SettingsFormValues[Field]) => {
      setValues((currentValues) => ({
        ...currentValues,
        [field]: value,
      }));
    },
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const result = await updateSiteSettings({
        ...values,
        hero_image_url: heroImageUrl || null,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(result.message);
    } catch (submitError) {
      console.error(submitError);
      setError("Ayarlar kaydedilirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    values,
    updateField,
    isSaving,
    error,
    success,
    handleSubmit,
  };
}
