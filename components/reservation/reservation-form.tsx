"use client";

import { AccommodationStep } from "@/components/reservation/form/accommodation-step";
import { ContactStep } from "@/components/reservation/form/contact-step";
import { DateGuestStep } from "@/components/reservation/form/date-guest-step";
import { ReservationSummary } from "@/components/reservation/form/reservation-summary";
import { ReservationPayment } from "@/components/reservation/payment/reservation-payment";

import { useReservationForm } from "@/hooks/reservation/use-reservation-form";

import { normalizeTurkishMobilePhone } from "@/lib/phone";

import type { PublicAccommodation } from "@/types/public-reservation";
import type { SiteSettings } from "@/types/site-settings";

type ReservationFormProps = {
  accommodations: PublicAccommodation[];
  settings: SiteSettings | null;
  initialAccommodationId?: number | null;
};

export function ReservationForm({
  accommodations,
  settings,
  initialAccommodationId,
}: ReservationFormProps) {
  const {
    accommodationId,
    selectedAccommodation,
    createdReservation,

    checkIn,
    checkOut,
    busyRanges,
    dateError,

    adultCount,
    childCount,

    guestName,
    guestPhone,
    guestEmail,

    estimatedNightCount,
    estimatedTotal,

    error,
    isSubmitting,
    isLoadingAvailability,
    availabilityError,

    handleAccommodationChange,

    handleCheckInChange,
    handleCheckOutChange,

    handleAdultCountChange,
    handleChildCountChange,

    handleSubmit,

    setGuestName,
    setGuestPhone,
    setGuestEmail,
  } = useReservationForm({
    accommodations,
    initialAccommodationId,
  });

  if (createdReservation) {
    return <ReservationPayment reservation={createdReservation} settings={settings} />;
  }

  const isContactComplete = Boolean(
    guestName.trim() && normalizeTurkishMobilePhone(guestPhone) && guestEmail.trim(),
  );

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[1280px]">
      <div
        className="
          mb-6
          hidden
          grid-cols-3
          overflow-hidden
          border
          border-[#D9D4CA]
          bg-[#FAF8F2]
          md:grid
        "
      >
        <ProgressItem number="01" title="Konaklama" text="Odanızı seçin" />

        <ProgressItem number="02" title="Tarih & Misafir" text="Konaklama planınızı belirleyin" />

        <ProgressItem number="03" title="İletişim" text="Bilgilerinizi tamamlayın" last />
      </div>

      <div
        className="
          grid
          items-start
          gap-6
          lg:grid-cols-[minmax(0,1fr)_380px]
          lg:gap-8
        "
      >
        <div className="space-y-5">
          <AccommodationStep
            accommodations={accommodations}
            accommodationId={accommodationId}
            onChange={handleAccommodationChange}
          />

          <DateGuestStep
            checkIn={checkIn}
            checkOut={checkOut}
            adultCount={adultCount}
            childCount={childCount}
            selectedAccommodation={selectedAccommodation}
            busyRanges={busyRanges}
            isLoadingAvailability={isLoadingAvailability}
            availabilityError={availabilityError}
            dateError={dateError}
            onCheckInChange={handleCheckInChange}
            onCheckOutChange={handleCheckOutChange}
            onAdultCountChange={handleAdultCountChange}
            onChildCountChange={handleChildCountChange}
          />

          <ContactStep
            guestName={guestName}
            guestPhone={guestPhone}
            guestEmail={guestEmail}
            onGuestNameChange={setGuestName}
            onGuestPhoneChange={setGuestPhone}
            onGuestEmailChange={setGuestEmail}
          />
        </div>

        <ReservationSummary
          selectedAccommodation={selectedAccommodation}
          checkIn={checkIn}
          checkOut={checkOut}
          adultCount={adultCount}
          childCount={childCount}
          estimatedNightCount={estimatedNightCount}
          estimatedTotal={estimatedTotal}
          dateError={dateError}
          error={error}
          isSubmitting={isSubmitting}
          isLoadingAvailability={isLoadingAvailability}
          accommodationId={accommodationId}
          isContactComplete={isContactComplete}
        />
      </div>
    </form>
  );
}

function ProgressItem({
  number,
  title,
  text,
  last = false,
}: {
  number: string;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-4
        px-5
        py-4
        ${last ? "" : "border-r border-[#D9D4CA]"}
      `}
    >
      <span
        className="
          font-serif
          text-lg
          italic
          text-[#A8754F]
        "
      >
        {number}
      </span>

      <div>
        <p className="text-[11px] font-semibold text-[#263A2D]">{title}</p>

        <p className="mt-0.5 text-[9px] text-[#92968E]">{text}</p>
      </div>
    </div>
  );
}
