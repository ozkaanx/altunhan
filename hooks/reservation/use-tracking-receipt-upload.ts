"use client";

import {
  useState,
} from "react";

import {
  findReservation,
  submitTrackedReceipt,
} from "@/app/rezervasyon/takip/action";

import {
  createClient,
} from "@/lib/supabase/client";

import {
  getFileExtension,
  isAllowedReceiptType,
  isReceiptSizeValid,
} from "@/lib/reservation/reservation-utils";

import type {
  ReservationTrackingResult,
} from "@/types/reservation-tracking";

type UseTrackingReceiptUploadParams = {
  reservation:
    ReservationTrackingResult;

  phone: string;

  onReservationRefresh: (
    reservation:
      ReservationTrackingResult,
  ) => void;
};

export function useTrackingReceiptUpload({
  reservation,
  phone,
  onReservationRefresh,
}: UseTrackingReceiptUploadParams) {
  const [
    receipt,
    setReceipt,
  ] =
    useState<File | null>(
      null,
    );

  const [
    isUploading,
    setIsUploading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    uploadSuccess,
    setUploadSuccess,
  ] =
    useState(false);

  const selectReceipt =
    (
      file:
        | File
        | null,
    ) => {
      setError(null);
      setUploadSuccess(false);

      if (!file) {
        setReceipt(null);
        return;
      }

      if (
        !isReceiptSizeValid(
          file.size,
        )
      ) {
        setReceipt(null);

        setError(
          "Dekont en fazla 10 MB olabilir.",
        );

        return;
      }

      if (
        !isAllowedReceiptType(
          file.type,
        )
      ) {
        setReceipt(null);

        setError(
          "Sadece JPG, PNG, WEBP veya PDF yükleyebilirsiniz.",
        );

        return;
      }

      setReceipt(file);
    };

  const clearReceipt =
    () => {
      setReceipt(null);
      setError(null);
    };

  const uploadReceipt =
    async () => {
      if (
        !receipt ||
        isUploading
      ) {
        return;
      }

      setError(null);
      setUploadSuccess(false);
      setIsUploading(true);

      let uploadedPath:
        | string
        | null = null;

      const supabase =
        createClient();

      try {
        const extension =
          getFileExtension(
            receipt.name,
          );

        uploadedPath =
          `${reservation.reservationCode}/` +
          `${crypto.randomUUID()}.${extension}`;

        const {
          error:
            uploadError,
        } =
          await supabase.storage
            .from(
              "reservation-receipts",
            )
            .upload(
              uploadedPath,
              receipt,
              {
                cacheControl:
                  "3600",
                upsert:
                  false,
                contentType:
                  receipt.type,
              },
            );

        if (
          uploadError
        ) {
          throw new Error(
            `Dekont yüklenemedi: ${uploadError.message}`,
          );
        }

        const result =
          await submitTrackedReceipt(
            reservation.reservationCode,
            phone,
            uploadedPath,
          );

        if (
          !result.success
        ) {
          await supabase.storage
            .from(
              "reservation-receipts",
            )
            .remove([
              uploadedPath,
            ]);

          throw new Error(
            result.message,
          );
        }

        setUploadSuccess(
          true,
        );

        setReceipt(null);

        const refreshed =
          await findReservation(
            reservation.reservationCode,
            phone,
          );

        if (
          refreshed.success
        ) {
          onReservationRefresh(
            refreshed.reservation,
          );
        }
      } catch (
        error
      ) {
        console.error(
          "Takip dekont yükleme hatası:",
          error,
        );

        setError(
          error instanceof
          Error
            ? error.message
            : "Dekont yüklenemedi.",
        );
      } finally {
        setIsUploading(
          false,
        );
      }
    };

  return {
    receipt,
    error,
    isUploading,
    uploadSuccess,

    selectReceipt,
    clearReceipt,
    uploadReceipt,
  };
}