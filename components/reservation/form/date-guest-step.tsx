"use client";

import { DateSelection } from "@/components/reservation/form/date-guest-step/date-selection";
import { GuestSelection } from "@/components/reservation/form/date-guest-step/guest-selection";
import { SectionTitle } from "@/components/shared/sectionTitle";

import type { AccommodationBusyRange, PublicAccommodation } from "@/types/public-reservation";

type DateGuestStepProps = {
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  selectedAccommodation: PublicAccommodation | undefined;
  busyRanges: AccommodationBusyRange[];
  isLoadingAvailability: boolean;
  availabilityError: string | null;
  dateError: string | null;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onAdultCountChange: (value: number) => void;
  onChildCountChange: (value: number) => void;
};

export function DateGuestStep({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  selectedAccommodation,
  busyRanges,
  isLoadingAvailability,
  availabilityError,
  dateError,
  onCheckInChange,
  onCheckOutChange,
  onAdultCountChange,
  onChildCountChange,
}: DateGuestStepProps) {
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
      <SectionTitle number="02" title="Tarih ve Misafir" />

      <p
        className="
          mt-3
          max-w-[580px]
          text-[11px]
          leading-5
          text-[#81867F]
        "
      >
        Giriş ve çıkış tarihlerinizi belirleyin, ardından konaklayacak misafir sayısını seçin.
      </p>

      <DateSelection
        checkIn={checkIn}
        checkOut={checkOut}
        busyRanges={busyRanges}
        isLoadingAvailability={isLoadingAvailability}
        availabilityError={availabilityError}
        dateError={dateError}
        onCheckInChange={onCheckInChange}
        onCheckOutChange={onCheckOutChange}
      />

      <GuestSelection
        adultCount={adultCount}
        childCount={childCount}
        selectedAccommodation={selectedAccommodation}
        onAdultCountChange={onAdultCountChange}
        onChildCountChange={onChildCountChange}
      />
    </section>
  );
}
