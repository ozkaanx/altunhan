"use client";

import { useMemo, useState } from "react";

import { createPublicReservation } from "@/app/rezervasyon/action";

import {
  calculateNightCount,
  reservationOverlapsRange,
} from "@/lib/reservation/date-utils";

import { useReservationAvailability } from "@/hooks/reservation/use-reservation-availability";

import type { PublicAccommodation } from "@/types/public-reservation";

import type { CreatedReservation } from "@/types/reservation-ui";

import { calculateReservationTotal } from "@/lib/reservation/reservation-utils";

type UseReservationFormParams = {
  accommodations: PublicAccommodation[];
  initialAccommodationId?: number | null;
};

export function useReservationForm({
  accommodations,
  initialAccommodationId,
}: UseReservationFormParams) {
  const initialAccommodation =
    accommodations.find((item) => item.id === initialAccommodationId) ??
    accommodations[0] ??
    null;

  const [accommodationId, setAccommodationId] = useState<number | null>(
    initialAccommodation?.id ?? null,
  );

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [guestCount, setGuestCount] = useState(
    Math.min(2, initialAccommodation?.capacity ?? 2),
  );

  const [guestName, setGuestName] = useState("");

  const [guestPhone, setGuestPhone] = useState("");

  const [guestEmail, setGuestEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [createdReservation, setCreatedReservation] =
    useState<CreatedReservation | null>(null);

  const selectedAccommodation = useMemo(
    () => accommodations.find((item) => item.id === accommodationId),
    [accommodations, accommodationId],
  );

  const { busyRanges, isLoadingAvailability, availabilityError } =
    useReservationAvailability(accommodationId);

  const estimatedNightCount = useMemo(
    () => calculateNightCount(checkIn, checkOut),
    [checkIn, checkOut],
  );

  const estimatedTotal = useMemo(
    () =>
      calculateReservationTotal(
        selectedAccommodation?.price ?? 0,
        estimatedNightCount,
      ),
    [selectedAccommodation, estimatedNightCount],
  );

  const dateError = useMemo(() => {
    if (!checkIn || !checkOut) {
      return null;
    }

    if (checkOut <= checkIn) {
      return "Çıkış tarihi giriş tarihinden sonra olmalıdır.";
    }

    const overlappingRange = busyRanges.find((range) =>
      reservationOverlapsRange(checkIn, checkOut, range),
    );

    if (overlappingRange) {
      return "Seçtiğiniz tarih aralığında müsait oda bulunmuyor.";
    }

    return null;
  }, [checkIn, checkOut, busyRanges]);

  const handleAccommodationChange = (accommodation: PublicAccommodation) => {
    setAccommodationId(accommodation.id);

    setCheckIn("");
    setCheckOut("");

    setError(null);

    setGuestCount(Math.min(guestCount, accommodation.capacity));
  };

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    setError(null);

    if (checkOut && value >= checkOut) {
      setCheckOut("");
    }
  };

  const handleCheckOutChange = (value: string) => {
    setCheckOut(value);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!accommodationId) {
      setError("Lütfen bir konaklama seçin.");

      return;
    }

    if (!checkIn || !checkOut) {
      setError("Lütfen giriş ve çıkış tarihlerini seçin.");

      return;
    }

    if (dateError) {
      setError(dateError);

      return;
    }

    if (!guestName.trim() || !guestPhone.trim()) {
      setError("Lütfen ad soyad ve telefon bilgilerinizi girin.");

      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPublicReservation({
        accommodationId,
        checkIn,
        checkOut,
        guestCount,

        guestName: guestName.trim(),

        guestPhone: guestPhone.trim(),

        guestEmail: guestEmail.trim(),
      });

      if (!result.success) {
        setError(result.message);

        return;
      }

      const reservationData: CreatedReservation = {
        id: result.reservation.id,

        reservationCode: result.reservation.reservationCode,

        accommodationTitle: result.reservation.accommodationTitle,

        checkIn: result.reservation.checkIn,

        checkOut: result.reservation.checkOut,

        nightCount: result.reservation.nightCount,

        totalPrice: result.reservation.totalPrice,
      };

      setCreatedReservation(reservationData);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Rezervasyon oluşturulamadı:", error);

      setError(
        error instanceof Error ? error.message : "Rezervasyon oluşturulamadı.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Reservation
    accommodationId,
    selectedAccommodation,
    createdReservation,

    // Dates
    checkIn,
    checkOut,
    busyRanges,
    dateError,

    // Guest
    guestCount,
    guestName,
    guestPhone,
    guestEmail,

    // Calculations
    estimatedNightCount,
    estimatedTotal,

    // Status
    error,
    isSubmitting,
    isLoadingAvailability,
    availabilityError,

    // Handlers
    handleAccommodationChange,
    handleCheckInChange,
    handleCheckOutChange,
    handleSubmit,

    // Simple setters
    setGuestCount,
    setGuestName,
    setGuestPhone,
    setGuestEmail,
  };
}
