"use client";

import { ContactSettingsSection } from "@/components/admin/settings-form/contact-settings-section";
import { HeroImageSection } from "@/components/admin/settings-form/hero-image-section";
import { PaymentSettingsSection } from "@/components/admin/settings-form/payment-settings-section";
import { SettingsFormFooter } from "@/components/admin/settings-form/settings-form-footer";

import { useHeroImageUpload } from "@/hooks/admin/use-hero-image-upload";
import { useSettingsForm } from "@/hooks/admin/use-settings-form";

import type { SiteSettings } from "@/types/site-settings";

type SettingsFormProps = {
  settings: SiteSettings;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const heroImage = useHeroImageUpload(settings.hero_image_url);
  const form = useSettingsForm(settings, heroImage.heroImageUrl);

  return (
    <form onSubmit={form.handleSubmit} className="space-y-5">
      <HeroImageSection
        heroImageUrl={heroImage.heroImageUrl}
        heroImage={heroImage.heroImage}
        isUploading={heroImage.isUploadingHero}
        error={heroImage.heroError}
        onFileChange={heroImage.selectHeroImage}
        onUpload={heroImage.uploadHeroImage}
      />

      <PaymentSettingsSection values={form.values} onFieldChange={form.updateField} />

      <ContactSettingsSection values={form.values} onFieldChange={form.updateField} />

      <SettingsFormFooter error={form.error} success={form.success} isSaving={form.isSaving} />
    </form>
  );
}
