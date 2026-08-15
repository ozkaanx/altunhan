import { Baby, User, Users } from "lucide-react";

import {
  Field,
  GuestCounter,
  SectionTitle,
  inputClass,
} from "@/components/admin/reservation-form/form-elements";

type GuestInformationSectionProps = {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  adultCount: number;
  childCount: number;
  maxAdults: number;
  maxChildren: number;
  totalGuestCount: number;
  canIncreaseAdult: boolean;
  canIncreaseChild: boolean;
  onGuestNameChange: (value: string) => void;
  onGuestPhoneChange: (value: string) => void;
  onGuestEmailChange: (value: string) => void;
  onAdultCountChange: (value: number) => void;
  onChildCountChange: (value: number) => void;
};

export function GuestInformationSection({
  guestName,
  guestPhone,
  guestEmail,
  adultCount,
  childCount,
  maxAdults,
  maxChildren,
  totalGuestCount,
  canIncreaseAdult,
  canIncreaseChild,
  onGuestNameChange,
  onGuestPhoneChange,
  onGuestEmailChange,
  onAdultCountChange,
  onChildCountChange,
}: GuestInformationSectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <SectionTitle
        icon={User}
        title="Misafir Bilgileri"
        description="Müşteri ve konaklayacak kişi bilgileri."
      />

      <div className="space-y-5 p-4 sm:p-5">
        <Field label="Ad Soyad">
          <input
            value={guestName}
            onChange={(event) => onGuestNameChange(event.target.value)}
            placeholder="Misafir adı soyadı"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefon">
            <input
              type="tel"
              value={guestPhone}
              onChange={(event) => onGuestPhoneChange(event.target.value)}
              placeholder="+90 5__ ___ __ __"
              className={inputClass}
            />
          </Field>

          <Field label="E-posta">
            <input
              type="email"
              value={guestEmail}
              onChange={(event) => onGuestEmailChange(event.target.value)}
              placeholder="Opsiyonel"
              className={inputClass}
            />
          </Field>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-[#40463F]">Konaklayacak Kişiler</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <GuestCounter
              icon={<User size={16} />}
              title="Yetişkin"
              description={`En fazla ${maxAdults}`}
              value={adultCount}
              decreaseDisabled={adultCount <= 1}
              increaseDisabled={!canIncreaseAdult}
              onDecrease={() => onAdultCountChange(adultCount - 1)}
              onIncrease={() => onAdultCountChange(adultCount + 1)}
            />

            <GuestCounter
              icon={<Baby size={16} />}
              title="Çocuk"
              description={`En fazla ${maxChildren}`}
              value={childCount}
              decreaseDisabled={childCount <= 0}
              increaseDisabled={!canIncreaseChild}
              onDecrease={() => onChildCountChange(childCount - 1)}
              onIncrease={() => onChildCountChange(childCount + 1)}
            />
          </div>

          <div className="mt-3 flex items-center justify-between bg-[#F7F5EF] px-4 py-3">
            <span className="flex items-center gap-2 text-[10px] text-[#81857F]">
              <Users size={14} />
              Toplam misafir
            </span>

            <span className="text-xs font-semibold text-[#263A2D]">{totalGuestCount} kişi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
