import { Building2, CreditCard, UserRound } from "lucide-react";

import {
  SettingsField,
  settingsInputClassName,
} from "@/components/admin/settings-form/settings-field";
import { SettingsSection } from "@/components/admin/settings-form/settings-section";

import type { SettingsFormValues, UpdateSettingsField } from "@/types/admin-settings";

type PaymentSettingsSectionProps = {
  values: SettingsFormValues;
  onFieldChange: UpdateSettingsField;
};

export function PaymentSettingsSection({ values, onFieldChange }: PaymentSettingsSectionProps) {
  return (
    <SettingsSection
      icon={CreditCard}
      title="Ödeme Bilgileri"
      description="Rezervasyon sonrası müşteriye gösterilir."
    >
      <SettingsField icon={UserRound} label="Hesap Sahibi" htmlFor="bank-account-holder">
        <input
          id="bank-account-holder"
          required
          value={values.bankAccountHolder}
          onChange={(event) => onFieldChange("bankAccountHolder", event.currentTarget.value)}
          placeholder="ALTUNHAN FARM"
          className={settingsInputClassName}
        />
      </SettingsField>

      <SettingsField icon={Building2} label="Banka Adı" htmlFor="bank-name">
        <input
          id="bank-name"
          value={values.bankName}
          onChange={(event) => onFieldChange("bankName", event.currentTarget.value)}
          placeholder="Örn. Ziraat Bankası"
          className={settingsInputClassName}
        />
      </SettingsField>

      <SettingsField icon={CreditCard} label="IBAN" htmlFor="iban">
        <input
          id="iban"
          value={values.iban}
          onChange={(event) => onFieldChange("iban", event.currentTarget.value.toUpperCase())}
          placeholder="TR00 0000 0000 0000 0000 0000 00"
          className={`${settingsInputClassName} font-medium uppercase tracking-wide`}
        />
      </SettingsField>
    </SettingsSection>
  );
}
