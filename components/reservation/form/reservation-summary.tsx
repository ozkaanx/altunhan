"use client";

import Image from "next/image";

import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

import { formatReservationDate } from "@/lib/reservation/date-utils";

import { formatPrice } from "@/lib/formatters/price";

import type { PublicAccommodation, PublicAccommodationImage } from "@/types/public-reservation";

type ReservationSummaryProps = {
  selectedAccommodation: PublicAccommodation | undefined;

  checkIn: string;
  checkOut: string;

  adultCount: number;
  childCount: number;

  estimatedNightCount: number;
  estimatedTotal: number;

  dateError: string | null;
  error: string | null;

  isSubmitting: boolean;
  isLoadingAvailability: boolean;

  accommodationId: number | null;

  isContactComplete: boolean;
};

function getCoverImage(images: PublicAccommodationImage[] | undefined) {
  if (!images?.length) {
    return null;
  }

  const cover = images.find((image) => image.is_cover);

  if (cover) {
    return cover.image_url;
  }

  return [...images].sort((a, b) => Number(a.sort_order) - Number(b.sort_order))[0]?.image_url;
}

export function ReservationSummary({
  selectedAccommodation,

  checkIn,
  checkOut,

  adultCount,
  childCount,

  estimatedNightCount,
  estimatedTotal,

  dateError,
  error,

  isSubmitting,
  isLoadingAvailability,

  accommodationId,

  isContactComplete,
}: ReservationSummaryProps) {
  const totalGuests = adultCount + childCount;

  const hasInvalidGuests =
    Boolean(selectedAccommodation) &&
    (adultCount < 1 ||
      adultCount > (selectedAccommodation?.max_adults ?? 0) ||
      childCount < 0 ||
      childCount > (selectedAccommodation?.max_children ?? 0) ||
      totalGuests > (selectedAccommodation?.max_total_guests ?? 0));

  const isDisabled =
    isSubmitting ||
    isLoadingAvailability ||
    !accommodationId ||
    !checkIn ||
    !checkOut ||
    Boolean(dateError) ||
    hasInvalidGuests ||
    !isContactComplete;

  const guestText =
    childCount > 0 ? `${adultCount} yetişkin · ${childCount} çocuk` : `${adultCount} yetişkin`;

  const coverImage = getCoverImage(selectedAccommodation?.accommodation_images);

  return (
    <aside
      className="
        h-fit
        overflow-hidden
        border
        border-[#D5D0C6]
        bg-[#FAF8F2]
        lg:sticky
        lg:top-6
      "
    >
      <div
        className="
          relative
          h-[150px]
          overflow-hidden
          bg-[#E8E2D7]
        "
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={selectedAccommodation?.title ?? "Altunhan Farm"}
            fill
            sizes="380px"
            className="object-cover"
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              font-serif
              text-xl
              text-[#8B8F87]
            "
          >
            Altunhan Farm
          </div>
        )}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#1E3024]/80
            via-[#1E3024]/10
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            p-5
            text-white
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-white/65
            "
          >
            Rezervasyon Özeti
          </p>

          <h2
            className="
              mt-1.5
              font-serif
              text-2xl
              leading-tight
            "
          >
            {selectedAccommodation?.title ?? "Konaklama seçin"}
          </h2>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          <SummaryRow
            label="Giriş"
            value={checkIn ? formatReservationDate(checkIn) : "Tarih seçin"}
          />

          <SummaryRow
            label="Çıkış"
            value={checkOut ? formatReservationDate(checkOut) : "Tarih seçin"}
          />

          <SummaryRow label="Misafir" value={guestText} />

          <SummaryRow
            label="Konaklama"
            value={estimatedNightCount > 0 ? `${estimatedNightCount} gece` : "—"}
          />
        </div>

        <div
          className="
            mt-5
            border-t
            border-[#E2DED5]
            pt-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <span className="text-[10px] text-[#858A83]">Gecelik fiyat</span>

            <span
              className="
                text-xs
                font-medium
                text-[#263A2D]
              "
            >
              {selectedAccommodation ? formatPrice(selectedAccommodation.price) : "—"}
            </span>
          </div>

          {estimatedNightCount > 0 && (
            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <span className="text-[10px] text-[#858A83]">Hesaplama</span>

              <span className="text-[10px] text-[#6D736C]">{estimatedNightCount} gece</span>
            </div>
          )}
        </div>

        {dateError && (
          <div
            className="
              mt-4
              border
              border-[#E5C7C0]
              bg-[#F8EEEA]
              p-3
              text-[10px]
              leading-5
              text-[#98584E]
            "
          >
            {dateError}
          </div>
        )}

        {error && error !== dateError && (
          <div
            className="
              mt-4
              border
              border-[#E5C7C0]
              bg-[#F8EEEA]
              p-3
              text-[10px]
              leading-5
              text-[#98584E]
            "
          >
            {error}
          </div>
        )}

        <div
          className="
            mt-5
            bg-[#263A2D]
            p-5
            text-white
          "
        >
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-white/55
            "
          >
            Toplam Tutar
          </p>

          <div
            className="
              mt-2
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <p
              className="
                font-serif
                text-[34px]
                leading-none
                tracking-[-0.02em]
              "
            >
              {estimatedNightCount > 0 ? formatPrice(estimatedTotal) : "—"}
            </p>

            {estimatedNightCount > 0 && (
              <p className="pb-0.5 text-[9px] text-white/50">{estimatedNightCount} gece</p>
            )}
          </div>
          {estimatedNightCount > 0 && (
            <p className="mt-3 text-[9px] leading-5 text-white/55">
              Gösterilen tutar seçtiğiniz konaklama ve gece sayısına göre hesaplanan toplam
              konaklama bedelidir. Rezervasyon, ödeme ve işletme onayından sonra kesinleşir.
            </p>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="
              group
              mt-5
              flex
              h-[52px]
              w-full
              items-center
              justify-center
              gap-2.5
              bg-[#FAF8F2]
              px-4
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#263A2D]
              transition-colors
              hover:bg-white
              disabled:cursor-not-allowed
              disabled:bg-white/15
              disabled:text-white/45
            "
          >
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              !isDisabled && (
                <ArrowRight
                  size={14}
                  className="
                    order-2
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              )
            )}

            {isSubmitting
              ? "Rezervasyon Oluşturuluyor..."
              : isLoadingAvailability
                ? "Müsaitlik Kontrol Ediliyor..."
                : dateError
                  ? "Farklı Tarih Seçin"
                  : hasInvalidGuests
                    ? "Misafir Sayısını Kontrol Edin"
                    : !checkIn || !checkOut
                      ? "Tarihlerinizi Seçin"
                      : !isContactComplete
                        ? "Bilgilerinizi Tamamlayın"
                        : "Rezervasyon Talebi Oluştur"}
          </button>
        </div>

        <div
          className="
            mt-4
            flex
            items-start
            gap-3
          "
        >
          <ShieldCheck size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#526048]" />

          <p className="text-[9px] leading-5 text-[#81867F]">
            Rezervasyon talebiniz oluşturulduğunda seçtiğiniz konaklama 1 saat boyunca geçici olarak
            sizin için ayrılır. Ödeme/dekont işlemini tamamladıktan sonra talebiniz işletme
            tarafından kontrol edilir ve onaylandığında rezervasyonunuz kesinleşir.
          </p>
        </div>

        {checkIn && checkOut && !dateError && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              border-t
              border-[#E2DED5]
              pt-4
              text-[9px]
              font-medium
              text-[#526A51]
            "
          >
            <CheckCircle2 size={13} />
            Tarih seçiminiz uygun görünüyor
          </div>
        )}
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <span className="text-[10px] text-[#969990]">{label}</span>

      <span
        className="
          max-w-[210px]
          text-right
          text-[11px]
          font-medium
          text-[#263A2D]
        "
      >
        {value}
      </span>
    </div>
  );
}
