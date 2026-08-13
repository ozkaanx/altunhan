"use client";

import {
  CheckCircle2,
  Copy,
  ImagePlus,
  Loader2,
  Upload,
} from "lucide-react";

import { useState } from "react";

import {
  saveReceiptPath,
} from "@/app/rezervasyon/action";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  SiteSettings,
} from "@/types/site-settings";

import {
  formatReservationDate,
} from "@/lib/reservation/date-utils";

type CreatedReservation = {
  id: number;
  reservationCode: string;
  accommodationTitle: string;
  checkIn: string;
  checkOut: string;
  nightCount: number;
  totalPrice: number;
};

type ReservationPaymentProps = {
  reservation: CreatedReservation;
  settings: SiteSettings | null;
};

export function ReservationPayment({
  reservation,
  settings,
}: ReservationPaymentProps) {
  const [
    receipt,
    setReceipt,
  ] =
    useState<File | null>(
      null,
    );

  const [
    isUploadingReceipt,
    setIsUploadingReceipt,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const copyIban =
    async () => {
      if (!settings?.iban) {
        return;
      }

      await navigator.clipboard.writeText(
        settings.iban.replace(
          /\s/g,
          "",
        ),
      );
    };

  const handleReceiptUpload =
    async () => {
      if (!receipt) {
        return;
      }

      setError(null);

      const maxSize =
        10 * 1024 * 1024;

      if (
        receipt.size >
        maxSize
      ) {
        setError(
          "Dekont en fazla 10 MB olabilir.",
        );

        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

      if (
        !allowedTypes.includes(
          receipt.type,
        )
      ) {
        setError(
          "Sadece JPG, PNG, WEBP veya PDF yükleyebilirsiniz.",
        );

        return;
      }

      setIsUploadingReceipt(
        true,
      );

      let storagePath:
        | string
        | null = null;

      try {
        const extension =
          receipt.name
            .split(".")
            .pop()
            ?.toLowerCase() ||
          "jpg";

        storagePath =
          `${reservation.reservationCode}/` +
          `${crypto.randomUUID()}.${extension}`;

        const supabase =
          createClient();

        const {
          error:
            uploadError,
        } =
          await supabase.storage
            .from(
              "reservation-receipts",
            )
            .upload(
              storagePath,
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
          await saveReceiptPath(
            reservation.id,
            reservation.reservationCode,
            storagePath,
          );

        if (
          !result.success
        ) {
          await supabase.storage
            .from(
              "reservation-receipts",
            )
            .remove([
              storagePath,
            ]);

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
          error,
        );

        setError(
          error instanceof
          Error
            ? error.message
            : "Dekont yüklenemedi.",
        );
      } finally {
        setIsUploadingReceipt(
          false,
        );
      }
    };

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="border border-[#E1DED6] bg-white p-5 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EFE6] text-[#496449]">
          <CheckCircle2
            size={24}
          />
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
          Rezervasyon Talebiniz Alındı
        </p>

        <h1 className="mt-2 font-serif text-3xl text-[#263A2D] sm:text-4xl">
          Ödemenizi tamamlayın.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#70756F]">
          Rezervasyonunuz oluşturuldu.
          Havale/EFT işlemini tamamladıktan
          sonra dekontunuzu yükleyin.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <DetailCard
            label="Rezervasyon No"
            value={
              reservation.reservationCode
            }
          />

          <DetailCard
            label="Konaklama"
            value={
              reservation.accommodationTitle
            }
          />

          <DetailCard
            label="Giriş"
            value={
              formatReservationDate(
                reservation.checkIn,
              )
            }
          />

          <DetailCard
            label="Çıkış"
            value={
              formatReservationDate(
                reservation.checkOut,
              )
            }
          />

          <DetailCard
            label="Konaklama Süresi"
            value={`${reservation.nightCount} gece`}
          />

          <DetailCard
            label="Toplam Tutar"
            value={`${reservation.totalPrice.toLocaleString(
              "tr-TR",
            )} TL`}
          />
        </div>

        <div className="mt-7 border border-[#DDD9D1] bg-[#FAF8F4] p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A7658]">
            Havale / EFT Bilgileri
          </p>

          <div className="mt-4 space-y-4">
            <BankRow
              label="Hesap Sahibi"
              value={
                settings?.bank_account_holder ||
                "Hesap sahibi bilgisi henüz eklenmedi."
              }
            />

            <BankRow
              label="Banka"
              value={
                settings?.bank_name ||
                "Banka bilgisi henüz eklenmedi."
              }
            />

            <div>
              <p className="text-[10px] text-[#969990]">
                IBAN
              </p>

              <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 break-all text-xs font-semibold tracking-wide text-[#263A2D] sm:text-sm">
                  {settings?.iban ||
                    "IBAN bilgisi henüz eklenmedi."}
                </p>

                {settings?.iban && (
                  <button
                    type="button"
                    onClick={
                      copyIban
                    }
                    className="flex h-9 shrink-0 items-center justify-center gap-2 border border-[#D7D3CA] bg-white px-3 text-[10px] font-semibold text-[#263A2D]"
                  >
                    <Copy
                      size={13}
                    />

                    IBAN'ı Kopyala
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 border-t border-[#E5E1D9] pt-4 text-[11px] leading-5 text-[#777B74]">
            Havale / EFT açıklamasına{" "}
            <strong className="text-[#263A2D]">
              {
                reservation.reservationCode
              }
            </strong>{" "}
            yazmanızı rica ederiz.
          </p>
        </div>

        <div className="mt-7">
          <p className="text-sm font-semibold text-[#263A2D]">
            Ödeme Dekontu
          </p>

          <p className="mt-1 text-xs leading-5 text-[#8A8E88]">
            JPG, PNG, WEBP veya PDF.
            Maksimum 10 MB.
          </p>

          <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center border border-dashed border-[#CBC7BE] bg-[#FAF9F6] p-4 text-center transition hover:border-[#A8754F]">
            <ImagePlus
              size={27}
              className="text-[#A8754F]"
            />

            <p className="mt-3 max-w-full break-all text-xs font-semibold text-[#263A2D]">
              {receipt
                ? receipt.name
                : "Dekont Seç"}
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              disabled={
                isUploadingReceipt
              }
              onChange={(
                event,
              ) =>
                setReceipt(
                  event.target
                    .files?.[0] ??
                    null,
                )
              }
            />
          </label>

          <button
            type="button"
            disabled={
              !receipt ||
              isUploadingReceipt
            }
            onClick={
              handleReceiptUpload
            }
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] px-5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploadingReceipt ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Dekont Gönderiliyor...
              </>
            ) : (
              <>
                <Upload
                  size={16}
                />
                Ödemeyi Tamamla ve Dekontu Gönder
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs leading-5 text-[#98584E]">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[#E8E4DC] bg-[#FAF9F6] p-4">
      <p className="text-[10px] text-[#969990]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#263A2D]">
        {value}
      </p>
    </div>
  );
}

function BankRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-[#969990]">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-[#263A2D]">
        {value}
      </p>
    </div>
  );
}