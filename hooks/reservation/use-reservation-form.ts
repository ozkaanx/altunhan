"use client";

import { useEffect, useMemo, useState } from "react";

import { createPublicReservation, getBedConfigurationAvailability } from "@/app/rezervasyon/action";
import { getGoogleAnalyticsAttribution } from "@/lib/analytics/attribution";

import { reservationOverlapsRange } from "@/lib/reservation/date-utils";

import { useReservationAvailability } from "@/hooks/reservation/use-reservation-availability";
import { trackReservationCreated } from "@/lib/analytics/events";

import type {
  BedConfigurationAvailability,
  PublicAccommodation,
  PublicBedConfiguration,
} from "@/types/public-reservation";

import type { CreatedReservation } from "@/types/reservation-ui";

import { calculateDepositAmount } from "@/lib/reservation/reservation-utils";
import { calculateSeptemberPromotionPricing } from "@/lib/reservation/september-promotion";

import { publicReservationSchema } from "@/lib/reservation/reservation-schema";

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
    initialAccommodationId == null
      ? null
      : (accommodations.find((item) => item.id === initialAccommodationId) ?? null);

  const [accommodationId, setAccommodationId] = useState<number | null>(
    initialAccommodation?.id ?? null,
  );

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [adultCount, setAdultCount] = useState(getDefaultAdultCount(initialAccommodation));

  const [childCount, setChildCount] = useState(0);

  const [requestedBedConfiguration, setRequestedBedConfiguration] =
    useState<PublicBedConfiguration | null>(null);

  const [bedConfigurationOptions, setBedConfigurationOptions] = useState<
    BedConfigurationAvailability[]
  >([]);

  const [isLoadingBedAvailability, setIsLoadingBedAvailability] = useState(false);

  const [bedAvailabilityError, setBedAvailabilityError] = useState<string | null>(null);

  const [guestName, setGuestName] = useState("");

  const [guestIdentityNumber, setGuestIdentityNumber] = useState("");

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

  useEffect(() => {
    let cancelled = false;

    const loadBedAvailability = async () => {
      if (!accommodationId || !checkIn || !checkOut || checkOut <= checkIn) {
        setBedConfigurationOptions([]);
        setRequestedBedConfiguration(null);
        setBedAvailabilityError(null);
        setIsLoadingBedAvailability(false);
        return;
      }

      setIsLoadingBedAvailability(true);
      setBedAvailabilityError(null);

      try {
        const result = await getBedConfigurationAvailability(
          accommodationId,
          checkIn,
          checkOut,
          guestCount,
        );

        if (cancelled) {
          return;
        }

        if (!result.success) {
          setBedConfigurationOptions([]);
          setRequestedBedConfiguration(null);
          setBedAvailabilityError(result.message);
          return;
        }

        setBedConfigurationOptions(result.options);

        const availableOptions = result.options.filter((option) => option.isAvailable);

        setRequestedBedConfiguration((current) => {
          if (current && availableOptions.some((option) => option.bedConfiguration === current)) {
            return current;
          }

          return availableOptions.length === 1 ? availableOptions[0].bedConfiguration : null;
        });
      } catch (bedError) {
        console.error("Yatak tipi müsaitliği alınamadı:", bedError);

        if (!cancelled) {
          setBedConfigurationOptions([]);
          setRequestedBedConfiguration(null);
          setBedAvailabilityError("Yatak tipi müsaitliği alınamadı.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingBedAvailability(false);
        }
      }
    };

    void loadBedAvailability();

    return () => {
      cancelled = true;
    };
  }, [accommodationId, checkIn, checkOut, guestCount]);

  const estimatedPricing = useMemo(
    () =>
      calculateSeptemberPromotionPricing(
        selectedAccommodation?.price ?? 0,
        checkIn,
        checkOut,
      ),
    [selectedAccommodation, checkIn, checkOut],
  );

  const estimatedNightCount = estimatedPricing.nightCount;
  const estimatedTotal = estimatedPricing.totalPrice;

  const estimatedDeposit = useMemo(
    () =>
      calculateDepositAmount(
        estimatedPricing.firstNightPrice,
        estimatedNightCount,
        estimatedTotal,
      ),
    [estimatedPricing.firstNightPrice, estimatedNightCount, estimatedTotal],
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

  const resetBedPreference = () => {
    setRequestedBedConfiguration(null);
    setBedConfigurationOptions([]);
    setBedAvailabilityError(null);
  };

  const handleBedConfigurationChange = (value: PublicBedConfiguration) => {
    setRequestedBedConfiguration(value);
    setError(null);
  };

  const handleAccommodationChange = (accommodation: PublicAccommodation) => {
    setAccommodationId(accommodation.id);

    setCheckIn("");
    setCheckOut("");

    resetBedPreference();
    setError(null);

    const nextAdultCount = selectedAccommodation
      ? Math.max(1, Math.min(adultCount, accommodation.max_adults, accommodation.max_total_guests))
      : getDefaultAdultCount(accommodation);

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

    resetBedPreference();
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

    resetBedPreference();
    setError(null);
  };

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);

    resetBedPreference();
    setError(null);

    if (checkOut && value >= checkOut) {
      setCheckOut("");
    }
  };

  const handleCheckOutChange = (value: string) => {
    setCheckOut(value);

    resetBedPreference();
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!accommodationId || !selectedAccommodation) {
      setError("Lütfen bir konaklama seçin.");

      return;
    }

    if (isLoadingBedAvailability) {
      setError("Yatak seçenekleri kontrol ediliyor. Lütfen kısa bir süre bekleyin.");

      return;
    }

    if (bedAvailabilityError) {
      setError(bedAvailabilityError);

      return;
    }

    if (bedConfigurationOptions.length > 0) {
      const selectedBedOption = bedConfigurationOptions.find(
        (option) => option.bedConfiguration === requestedBedConfiguration,
      );

      if (!selectedBedOption?.isAvailable) {
        setError("Lütfen müsait bir yatak tercihi seçin.");

        return;
      }
    }

    const validationResult = publicReservationSchema.safeParse({
      accommodationId,

      checkIn,
      checkOut,

      adultCount,
      childCount,

      requestedBedConfiguration,

      guestName,
      guestIdentityNumber,
      guestPhone,
      guestEmail,
    });

    if (!validationResult.success) {
      setError(validationResult.error.issues[0]?.message ?? "Rezervasyon bilgileri geçersiz.");

      return;
    }

    if (dateError) {
      setError(dateError);

      return;
    }

    const input = validationResult.data;
    const totalGuestCount = input.adultCount + input.childCount;

    if (input.adultCount > selectedAccommodation.max_adults) {
      setError(`Bu konaklamada en fazla ${selectedAccommodation.max_adults} yetişkin kalabilir.`);

      return;
    }

    if (input.childCount > selectedAccommodation.max_children) {
      setError(`Bu konaklamada en fazla ${selectedAccommodation.max_children} çocuk kalabilir.`);

      return;
    }

    if (totalGuestCount > selectedAccommodation.max_total_guests) {
      setError(
        `Bu konaklamanın maksimum toplam kapasitesi ${selectedAccommodation.max_total_guests} kişidir.`,
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const attribution = await getGoogleAnalyticsAttribution();

      const result = await createPublicReservation(input, attribution);

      if (!result.success) {
        setError(result.message);

        return;
      }
      trackReservationCreated({
        reservationCode: result.reservation.reservationCode,
        accommodationTitle: result.reservation.accommodationTitle,
        nightCount: result.reservation.nightCount,
        totalPrice: result.reservation.totalPrice,
      });

      const reservationData: CreatedReservation = {
        id: result.reservation.id,

        reservationCode: result.reservation.reservationCode,

        accommodationTitle: result.reservation.accommodationTitle,

        checkIn: result.reservation.checkIn,
        checkOut: result.reservation.checkOut,

        nightCount: result.reservation.nightCount,

        totalPrice: result.reservation.totalPrice,

        depositTargetAmount: result.reservation.depositTargetAmount,

        amountDueNow: result.reservation.amountDueNow,

        remainingPaymentAmount: result.reservation.remainingPaymentAmount,
      };

      setCreatedReservation(reservationData);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (submitError) {
      console.error("Rezervasyon oluşturulamadı:", submitError);

      setError(submitError instanceof Error ? submitError.message : "Rezervasyon oluşturulamadı.");
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

    requestedBedConfiguration,
    bedConfigurationOptions,
    isLoadingBedAvailability,
    bedAvailabilityError,

    guestName,
    guestIdentityNumber,
    guestPhone,
    guestEmail,

    // Calculations
    estimatedNightCount,
    estimatedTotal,
    estimatedDeposit,
    estimatedPricing,

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
    handleBedConfigurationChange,

    handleSubmit,

    // Simple setters
    setGuestName,
    setGuestIdentityNumber,
    setGuestPhone,
    setGuestEmail,
  };
}
