"use client";

import Link from "next/link";

import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

import { FieldLabel } from "@/components/shared/fieldLabel";
import { SectionTitle } from "@/components/shared/sectionTitle";
import { TurkishMobileInput } from "@/components/shared/turkish-mobile-input";

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
          <FieldLabel htmlFor="reservation-guest-name">Ad Soyad</FieldLabel>

          <InputShell icon={UserRound}>
            <input
              id="reservation-guest-name"
              name="guestName"
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
            <FieldLabel htmlFor="reservation-guest-phone">Telefon</FieldLabel>

            <InputShell icon={Phone}>
              <TurkishMobileInput
                id="reservation-guest-phone"
                name="guestPhone"
                required
                value={guestPhone}
                onValueChange={onGuestPhoneChange}
                containerClassName="h-full flex-1"
                prefixClassName="border-r border-[#EEEAE3] px-3"
                inputClassName={inputClass}
              />
            </InputShell>
          </div>

          <div>
            <FieldLabel htmlFor="reservation-guest-email">E-posta</FieldLabel>

            <InputShell icon={Mail}>
              <input
                id="reservation-guest-email"
                name="guestEmail"
                required
                type="email"
                value={guestEmail}
                onChange={(event) => onGuestEmailChange(event.target.value)}
                placeholder="ornek@mail.com"
                autoComplete="email"
                inputMode="email"
                maxLength={254}
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
            Rezervasyon bilgileri e-posta adresinize gönderilir ve takipte telefon numaranız
            kullanılır. Talep oluşturarak{" "}
            <Link href="/kvkk" className="font-semibold underline underline-offset-2">
              KVKK Aydınlatma Metni
            </Link>{" "}
            ve{" "}
            <Link href="/gizlilik" className="font-semibold underline underline-offset-2">
              Gizlilik Politikası
            </Link>
            &apos;nı okuduğunuzu kabul edersiniz.
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
