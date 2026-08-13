export type SiteSettings = {
  id: number;

  bank_account_holder: string;

  bank_name: string;

  iban: string;

  phone: string;

  whatsapp: string;

  email: string;

  address: string;

  created_at: string;

  updated_at: string;

  hero_image_url: string | null;
};

export type SiteSettingsFormValues = {
  bankAccountHolder: string;

  bankName: string;

  iban: string;

  phone: string;

  whatsapp: string;

  email: string;

  address: string;

  hero_image_url: string | null;
};
