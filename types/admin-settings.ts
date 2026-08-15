export type SettingsFormValues = {
  bankAccountHolder: string;
  bankName: string;
  iban: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
};

export type SettingsFieldName = keyof SettingsFormValues;

export type UpdateSettingsField = <Field extends SettingsFieldName>(
  field: Field,
  value: SettingsFormValues[Field],
) => void;
