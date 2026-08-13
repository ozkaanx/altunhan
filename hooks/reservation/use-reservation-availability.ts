"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAccommodationBusyRanges,
} from "@/app/rezervasyon/action";

import type {
  AccommodationBusyRange,
} from "@/app/rezervasyon/action";

export function useReservationAvailability(
  accommodationId:
    | number
    | null,
) {
  const [
    busyRanges,
    setBusyRanges,
  ] =
    useState<
      AccommodationBusyRange[]
    >([]);

  const [
    isLoadingAvailability,
    setIsLoadingAvailability,
  ] =
    useState(false);

  const [
    availabilityError,
    setAvailabilityError,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    let cancelled =
      false;

    const loadAvailability =
      async () => {
        if (
          !accommodationId
        ) {
          setBusyRanges(
            [],
          );

          setAvailabilityError(
            null,
          );

          return;
        }

        setIsLoadingAvailability(
          true,
        );

        setAvailabilityError(
          null,
        );

        try {
          const result =
            await getAccommodationBusyRanges(
              accommodationId,
            );

          if (
            cancelled
          ) {
            return;
          }

          if (
            !result.success
          ) {
            setBusyRanges(
              [],
            );

            setAvailabilityError(
              result.message ??
                "Müsaitlik bilgisi alınamadı.",
            );

            return;
          }

          setBusyRanges(
            result.ranges,
          );
        } catch (
          error
        ) {
          console.error(
            "Müsaitlik bilgisi alınamadı:",
            error,
          );

          if (
            !cancelled
          ) {
            setBusyRanges(
              [],
            );

            setAvailabilityError(
              "Müsaitlik bilgisi alınamadı.",
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setIsLoadingAvailability(
              false,
            );
          }
        }
      };

    void loadAvailability();

    return () => {
      cancelled =
        true;
    };
  }, [
    accommodationId,
  ]);

  return {
    busyRanges,
    isLoadingAvailability,
    availabilityError,
  };
}