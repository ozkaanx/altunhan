"use client";

import { useState } from "react";

import { saveReceiptPath } from "@/app/rezervasyon/action";
import { createClient } from "@/lib/supabase/client";

import type { CreatedReservation } from "@/types/reservation-ui";

import {
  getFileExtension,
  isAllowedReceiptType,
  isReceiptSizeValid,
} from "@/lib/reservation/reservation-utils";

export function useReceiptUpload(
  reservation: CreatedReservation,
) {
  const [receipt, setReceipt] =
    useState<File | null>(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const clearReceipt = () => {
    setReceipt(null);
    setError(null);
  };

  const selectReceipt = (
    file: File | null,
  ) => {
    setError(null);

    if (!file) {
      setReceipt(null);
      return;
    }

    if (!isReceiptSizeValid(file.size)) {
      setReceipt(null);

      setError(
        "Dekont en fazla 10 MB olabilir.",
      );

      return;
    }

    if (
      !isAllowedReceiptType(file.type)
    ) {
      setReceipt(null);

      setError(
        "Sadece JPG, PNG, WEBP veya PDF yükleyebilirsiniz.",
      );

      return;
    }

    // Eksik olan satır buydu.
    setReceipt(file);
  };

  const uploadReceipt = async () => {
    if (!receipt || isUploading) {
      return;
    }

    setError(null);
    setIsUploading(true);

    let storagePath: string | null =
      null;

    const supabase = createClient();

    try {
      const extension =
        getFileExtension(receipt.name);

      storagePath =
        `${reservation.reservationCode}/` +
        `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from(
            "reservation-receipts",
          )
          .upload(
            storagePath,
            receipt,
            {
              cacheControl: "3600",
              upsert: false,
              contentType:
                receipt.type,
            },
          );

      if (uploadError) {
        throw new Error(
          `Dekont yüklenemedi: ${uploadError.message}`,
        );
      }

      const result =
        await saveReceiptPath(
          reservation.id,
          reservation.reservationCode,
          storagePath,
        );

      if (!result.success) {
        await supabase.storage
          .from(
            "reservation-receipts",
          )
          .remove([storagePath]);

        throw new Error(
          result.message,
        );
      }

      setReceipt(null);

      window.location.href =
        `/rezervasyon/takip?code=${encodeURIComponent(
          reservation.reservationCode,
        )}`;
    } catch (error) {
      console.error(
        "Dekont yükleme hatası:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Dekont yüklenemedi.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return {
    receipt,
    error,
    isUploading,

    selectReceipt,
    clearReceipt,
    uploadReceipt,
  };
}