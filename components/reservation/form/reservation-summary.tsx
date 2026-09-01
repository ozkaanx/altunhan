"use client";

import { ReservationSummaryAlerts } from "@/components/reservation/form/reservation-summary/reservation-summary-alerts";
import { ReservationSummaryAssurance } from "@/components/reservation/form/reservation-summary/reservation-summary-assurance";
import { ReservationSummaryDetails } from "@/components/reservation/form/reservation-summary/reservation-summary-details";
import { ReservationSummaryHeader } from "@/components/reservation/form/reservation-summary/reservation-summary-header";
import { ReservationSummaryTotal } from "@/components/reservation/form/reservation-summary/reservation-summary-total";
import {
  getReservationSubmitLabel,
  hasInvalidGuestCount,
} from "@/components/reservation/form/reservation-summary/reservation-summary-utils";

import type { PublicAccommodation } from "@/types/public-reservation";

type ReservationSummaryProps = {
  selectedAccommodation: PublicAccommodation | undefined;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  estimatedNightCount: number;
  estimatedTotal: number;
  estimatedDeposit: number;
  regularTotal: number;
  discountAmount: number;
  discountedNightCount: number;
  dateError: string | null;
  error: string | null;
  isSubmitting: boolean;
  isLoadingAvailability: boolean;
  accommodationId: number | null;
  isContactComplete: boolean;
};

export function ReservationSummary({
  selectedAccommodation,
  checkIn,
  checkOut,
  adultCount,
  childCount,
  estimatedNightCount,
  estimatedTotal,
  estimatedDeposit,
  regularTotal,
  discountAmount,
  discountedNightCount,
  dateError,
  error,
  isSubmitting,
  isLoadingAvailability,
  accommodationId,
  isContactComplete,
}: ReservationSummaryProps) {
  const hasInvalidGuests = hasInvalidGuestCount({
    accommodation: selectedAccommodation,
    adultCount,
    childCount,
  });

  const isDisabled =
    isSubmitting ||
    isLoadingAvailability ||
    !accommodationId ||
    !checkIn ||
    !checkOut ||
    Boolean(dateError) ||
    hasInvalidGuests ||
    !isContactComplete;

  const submitLabel = getReservationSubmitLabel({
    isSubmitting,
    isLoadingAvailability,
    dateError,
    hasInvalidGuests,
    checkIn,
    checkOut,
    isContactComplete,
  });

  return (
    <aside className="h-fit overflow-hidden border border-[#D5D0C6] bg-[#FAF8F2] lg:sticky lg:top-6">
      <ReservationSummaryHeader accommodation={selectedAccommodation} />

      <div className="p-5">
        <ReservationSummaryDetails
          accommodation={selectedAccommodation}
          checkIn={checkIn}
          checkOut={checkOut}
          adultCount={adultCount}
          childCount={childCount}
          estimatedNightCount={estimatedNightCount}
        />

        <ReservationSummaryAlerts dateError={dateError} error={error} />

        <ReservationSummaryTotal
          estimatedNightCount={estimatedNightCount}
          estimatedTotal={estimatedTotal}
          estimatedDeposit={estimatedDeposit}
          regularTotal={regularTotal}
          discountAmount={discountAmount}
          discountedNightCount={discountedNightCount}
          isDisabled={isDisabled}
          isSubmitting={isSubmitting}
          submitLabel={submitLabel}
        />

        <ReservationSummaryAssurance checkIn={checkIn} checkOut={checkOut} dateError={dateError} />
      </div>
    </aside>
  );
}
