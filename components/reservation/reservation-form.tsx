"use client";

import { AccommodationStep } from "@/components/reservation/form/accommodation-step";

import { ContactStep } from "@/components/reservation/form/contact-step";

import { DateGuestStep } from "@/components/reservation/form/date-guest-step";

import { ReservationSummary } from "@/components/reservation/form/reservation-summary";

import { ReservationPayment } from "@/components/reservation/payment/reservation-payment";

import { useReservationForm } from "@/hooks/reservation/use-reservation-form";

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
    return (
      <ReservationPayment
        reservation={createdReservation}
        settings={settings}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[900px]">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
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
        />
      </div>
    </form>
  );
}
