"use client";

import { useMemo, useState } from "react";

import { createPublicReservation } from "@/app/rezervasyon/action";

import { calculateNightCount, reservationOverlapsRange } from "@/lib/reservation/date-utils";

import { useReservationAvailability } from "@/hooks/reservation/use-reservation-availability";

import type { PublicAccommodation } from "@/types/public-reservation";

import type { CreatedReservation } from "@/types/reservation-ui";

import { calculateReservationTotal } from "@/lib/reservation/reservation-utils";

type UseReservationFormParams = {
  accommodations: PublicAccommodation[];

  initialAccommodationId?: number | null;
};

function getDefaultAdultCount(accommodation: PublicAccommodation | null) {
  if (!accommodation) {
    return 1;
  }

  return Math.max(1, Math.min(2, accommodation.max_adults, accommodation.max_total_guests));
}

export function useReservationForm({
  accommodations,
  initialAccommodationId,
}: UseReservationFormParams) {
  const initialAccommodation =
    accommodations.find((item) => item.id === initialAccommodationId) ?? accommodations[0] ?? null;

  const [accommodationId, setAccommodationId] = useState<number | null>(
    initialAccommodation?.id ?? null,
  );

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [adultCount, setAdultCount] = useState(getDefaultAdultCount(initialAccommodation));

  const [childCount, setChildCount] = useState(0);

  const [guestName, setGuestName] = useState("");

  const [guestPhone, setGuestPhone] = useState("");

  const [guestEmail, setGuestEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [createdReservation, setCreatedReservation] = useState<CreatedReservation | null>(null);

  const selectedAccommodation = useMemo(
    () => accommodations.find((item) => item.id === accommodationId),
    [accommodations, accommodationId],
  );

  const guestCount = adultCount + childCount;

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

    const nextAdultCount = Math.max(
      1,
      Math.min(adultCount, accommodation.max_adults, accommodation.max_total_guests),
    );

    const remainingCapacity = Math.max(0, accommodation.max_total_guests - nextAdultCount);

    const nextChildCount = Math.min(childCount, accommodation.max_children, remainingCapacity);

    setAdultCount(nextAdultCount);

    setChildCount(nextChildCount);
  };

  const handleAdultCountChange = (value: number) => {
    if (!selectedAccommodation) {
      return;
    }

    const maxAllowed = Math.min(
      selectedAccommodation.max_adults,

      selectedAccommodation.max_total_guests - childCount,
    );

    const nextValue = Math.max(1, Math.min(value, maxAllowed));

    setAdultCount(nextValue);

    setError(null);
  };

  const handleChildCountChange = (value: number) => {
    if (!selectedAccommodation) {
      return;
    }

    const maxAllowed = Math.min(
      selectedAccommodation.max_children,

      selectedAccommodation.max_total_guests - adultCount,
    );

    const nextValue = Math.max(0, Math.min(value, maxAllowed));

    setChildCount(nextValue);

    setError(null);
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

    if (!accommodationId || !selectedAccommodation) {
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

    if (adultCount < 1) {
      setError("En az 1 yetişkin seçilmelidir.");

      return;
    }

    if (adultCount > selectedAccommodation.max_adults) {
      setError(`Bu konaklamada en fazla ${selectedAccommodation.max_adults} yetişkin kalabilir.`);

      return;
    }

    if (childCount > selectedAccommodation.max_children) {
      setError(`Bu konaklamada en fazla ${selectedAccommodation.max_children} çocuk kalabilir.`);

      return;
    }

    if (guestCount > selectedAccommodation.max_total_guests) {
      setError(
        `Bu konaklamanın maksimum toplam kapasitesi ${selectedAccommodation.max_total_guests} kişidir.`,
      );

      return;
    }

    if (!guestName.trim() || !guestPhone.trim() || !guestEmail.trim()) {
      setError("Lütfen ad soyad, telefon ve e-posta bilgilerinizi girin.");

      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPublicReservation({
        accommodationId,

        checkIn,
        checkOut,

        adultCount,
        childCount,

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

      setError(error instanceof Error ? error.message : "Rezervasyon oluşturulamadı.");
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

    // Guests
    adultCount,
    childCount,
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

    handleAdultCountChange,
    handleChildCountChange,

    handleSubmit,

    // Simple setters
    setGuestName,
    setGuestPhone,
    setGuestEmail,
  };
}
