"use client";

import {
  TrackingResult,
} from "@/components/reservation/tracking/result";

import {
  TrackingSearchForm,
} from "@/components/reservation/tracking/searchForm";

import {
  useReservationTracking,
} from "@/hooks/reservation/use-reservation-tracking";

import type {
  SiteSettings,
} from "@/types/site-settings";

type ReservationTrackingProps = {
  settings: SiteSettings | null;
};

export function ReservationTracking({
  settings,
}: ReservationTrackingProps) {
  const {
    reservationCode,
    phone,
    reservation,
    isLoading,
    error,

    setReservationCode,
    setPhone,
    setReservation,

    handleSubmit,
    resetSearch,
  } = useReservationTracking();

  if (reservation) {
    return (
      <TrackingResult
        reservation={reservation}
        phone={phone}
        settings={settings}
        onReset={resetSearch}
        onReservationChange={setReservation}
      />
    );
  }

  return (
    <TrackingSearchForm
      reservationCode={reservationCode}
      phone={phone}
      error={error}
      isLoading={isLoading}
      onReservationCodeChange={setReservationCode}
      onPhoneChange={setPhone}
      onSubmit={handleSubmit}
    />
  );
}