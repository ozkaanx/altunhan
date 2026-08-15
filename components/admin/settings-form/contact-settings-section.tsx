import { Mail, MapPin, Phone } from "lucide-react";

import {
  SettingsField,
  settingsInputClassName,
} from "@/components/admin/settings-form/settings-field";
import { SettingsSection } from "@/components/admin/settings-form/settings-section";

import type { SettingsFormValues, UpdateSettingsField } from "@/types/admin-settings";

type ContactSettingsSectionProps = {
  values: SettingsFormValues;
  onFieldChange: UpdateSettingsField;
};

export function ContactSettingsSection({ values, onFieldChange }: ContactSettingsSectionProps) {
  return (
    <SettingsSection
      icon={Phone}
      title="İletişim Bilgileri"
      description="Site ve müşteri iletişiminde kullanılacak."
    >
      <SettingsField icon={Phone} label="Telefon" htmlFor="phone">
        <input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={(event) => onFieldChange("phone", event.currentTarget.value)}
          placeholder="+90 5__ ___ __ __"
          className={settingsInputClassName}
        />
      </SettingsField>

      <SettingsField icon={Phone} label="WhatsApp" htmlFor="whatsapp">
        <input
          id="whatsapp"
          type="tel"
          value={values.whatsapp}
          onChange={(event) => onFieldChange("whatsapp", event.currentTarget.value)}
          placeholder="+90 5__ ___ __ __"
          className={settingsInputClassName}
        />

        <p className="mt-2 text-[10px] leading-5 text-[#969990]">
          WhatsApp bağlantılarında kullanılacak numara.
        </p>
      </SettingsField>

      <SettingsField icon={Mail} label="E-posta" htmlFor="email">
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(event) => onFieldChange("email", event.currentTarget.value)}
          placeholder="info@altunhanfarm.com"
          className={settingsInputClassName}
        />
      </SettingsField>

      <SettingsField icon={MapPin} label="Adres" htmlFor="address">
        <textarea
          id="address"
          value={values.address}
          onChange={(event) => onFieldChange("address", event.currentTarget.value)}
          rows={4}
          placeholder="Altunhan Farm adresi"
          className="w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-sm leading-6 text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]"
        />
      </SettingsField>
    </SettingsSection>
  );
}
