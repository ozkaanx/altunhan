"use client";

import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

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
    <section
      className="
        border
        border-[#DDD8CC]
        bg-[#FAF8F2]
        p-4
        sm:p-6
      "
    >
      <SectionTitle number="03" title="İletişim Bilgileriniz" />

      <p
        className="
          mt-3
          max-w-[580px]
          text-[11px]
          leading-5
          text-[#81867F]
        "
      >
        Rezervasyonunuzla ilgili bilgilendirmeleri size ulaştırabilmemiz için iletişim bilgilerinizi
        girin.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <FieldLabel>Ad Soyad</FieldLabel>

          <InputShell icon={UserRound}>
            <input
              required
              value={guestName}
              onChange={(event) => onGuestNameChange(event.target.value)}
              placeholder="Adınız ve soyadınız"
              autoComplete="name"
              className={inputClass}
            />
          </InputShell>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Telefon</FieldLabel>

            <InputShell icon={Phone}>
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
            </InputShell>
          </div>

          <div>
            <FieldLabel>E-posta</FieldLabel>

            <InputShell icon={Mail}>
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
            </InputShell>
          </div>
        </div>

        <div
          className="
            flex
            items-start
            gap-3
            bg-[#F0F2EC]
            px-4
            py-3
          "
        >
          <ShieldCheck size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#526048]" />

          <p
            className="
              text-[9px]
              leading-5
              text-[#747A72]
            "
          >
            Rezervasyon bilgileri e-posta adresinize gönderilir. Rezervasyon takibinde telefon
            numaranız kullanılır.
          </p>
        </div>
      </div>
    </section>
  );
}

function InputShell({
  icon: Icon,
  children,
}: {
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        mt-2
        flex
        h-[52px]
        items-center
        border
        border-[#D9D5CD]
        bg-white
        transition-colors
        focus-within:border-[#263A2D]
      "
    >
      <div
        className="
          flex
          h-full
          w-12
          shrink-0
          items-center
          justify-center
          border-r
          border-[#EEEAE3]
          text-[#A8754F]
        "
      >
        <Icon size={16} strokeWidth={1.5} />
      </div>

      {children}
    </div>
  );
}

const inputClass =
  "h-full w-full min-w-0 border-0 bg-transparent px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] sm:text-sm";
