"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  findReservation,
} from "@/app/rezervasyon/takip/action";

import type {
  ReservationTrackingResult,
} from "@/types/reservation-tracking";

export function useReservationTracking() {
  const searchParams =
    useSearchParams();

  const codeFromUrl =
    searchParams.get(
      "code",
    );

  const [
    reservationCode,
    setReservationCode,
  ] =
    useState(
      codeFromUrl ?? "",
    );

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    reservation,
    setReservation,
  ] =
    useState<ReservationTrackingResult | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    if (
      !codeFromUrl
    ) {
      return;
    }

    setReservationCode(
      codeFromUrl,
    );
  }, [
    codeFromUrl,
  ]);

  useEffect(() => {
    if (
      !reservation ||
      !phone.trim()
    ) {
      return;
    }

    if (
      reservation.status ===
        "confirmed" ||
      reservation.status ===
        "rejected" ||
      reservation.status ===
        "cancelled"
    ) {
      return;
    }

    let cancelled =
      false;

    const refreshReservation =
      async () => {
        try {
          const result =
            await findReservation(
              reservation.reservationCode,
              phone,
            );

          if (
            cancelled ||
            !result.success
          ) {
            return;
          }

          setReservation(
            result.reservation,
          );
        } catch (
          error
        ) {
          console.error(
            "Rezervasyon durumu otomatik güncellenemedi:",
            error,
          );
        }
      };

    const interval =
      window.setInterval(
        refreshReservation,
        15_000,
      );

    return () => {
      cancelled =
        true;

      window.clearInterval(
        interval,
      );
    };
  }, [
    reservation,
    phone,
  ]);

  const searchReservation =
    async () => {
      setError(null);
      setReservation(null);
      setIsLoading(true);

      try {
        const result =
          await findReservation(
            reservationCode,
            phone,
          );

        if (
          !result.success
        ) {
          setError(
            result.message,
          );

          return;
        }

        setReservation(
          result.reservation,
        );
      } catch (
        error
      ) {
        console.error(
          "Rezervasyon sorgulama hatası:",
          error,
        );

        setError(
          "Rezervasyon sorgulanırken beklenmeyen bir hata oluştu.",
        );
      } finally {
        setIsLoading(false);
      }
    };

  const handleSubmit =
    (
      event:
        React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      void searchReservation();
    };

  const resetSearch =
    () => {
      setReservation(null);
      setError(null);
    };

  return {
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
  };
}