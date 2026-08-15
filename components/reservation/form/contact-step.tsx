"use client";

import { FieldLabel } from "@/components/shared/fieldLabel";

import { SectionTitle } from "@/components/shared/sectionTitle";

type ContactStepProps = {
  guestName: string;
  guestPhone: string;
  guestEmail: string;

  onGuestNameChange: (value: string) => void;

  onGuestPhoneChange: (value: string) => void;

  onGuestEmailChange: (value: string) => void;
};

export function ContactStep({
  guestName,
  guestPhone,
  guestEmail,

  onGuestNameChange,
  onGuestPhoneChange,
  onGuestEmailChange,
}: ContactStepProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white p-4 sm:p-6">
      <SectionTitle number="03" title="İletişim Bilgileriniz" />

      <div className="mt-5 space-y-4">
        <div>
          <FieldLabel>Ad Soyad</FieldLabel>

          <input
            required
            value={guestName}
            onChange={(event) => onGuestNameChange(event.target.value)}
            placeholder="Adınız ve soyadınız"
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Telefon</FieldLabel>

            <input
              required
              type="tel"
              value={guestPhone}
              onChange={(event) => onGuestPhoneChange(event.target.value)}
              placeholder="+90 5__ ___ __ __"
              autoComplete="tel"
              inputMode="tel"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel>E-posta</FieldLabel>

            <input
              required
              type="email"
              value={guestEmail}
              onChange={(event) => onGuestEmailChange(event.target.value)}
              placeholder="ornek@mail.com"
              autoComplete="email"
              inputMode="email"
              className={inputClass}
            />
          </div>
        </div>

        <p className="text-[10px] leading-5 text-[#969990]">
          Rezervasyon bilgileri e-posta adresinize gönderilecektir. Rezervasyon takibinde telefon
          numaranız kullanılacaktır.
        </p>
      </div>
    </section>
  );
}

const inputClass =
  "mt-2 h-11 w-full min-w-0 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm";
