"use client";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  Users,
} from "lucide-react";

import type {
  PublicAccommodation,
} from "@/types/public-reservation";

import type {
  AccommodationBusyRange,
} from "@/app/rezervasyon/action";


import {
  SectionTitle,
} from "@/components/shared/sectionTitle";


import {
  FieldLabel,
} from "@/components/shared/fieldLabel";


import {
  formatReservationDate,
  getTurkeyToday,
} from "@/lib/reservation/date-utils";

type DateGuestStepProps = {
  checkIn: string;
  checkOut: string;
  guestCount: number;

  selectedAccommodation:
    | PublicAccommodation
    | undefined;

  busyRanges:
    AccommodationBusyRange[];

  isLoadingAvailability: boolean;

  availabilityError:
    | string
    | null;

  dateError:
    | string
    | null;

  onCheckInChange: (
    value: string,
  ) => void;

  onCheckOutChange: (
    value: string,
  ) => void;

  onGuestCountChange: (
    value: number,
  ) => void;
};

export function DateGuestStep({
  checkIn,
  checkOut,
  guestCount,

  selectedAccommodation,

  busyRanges,

  isLoadingAvailability,

  availabilityError,

  dateError,

  onCheckInChange,

  onCheckOutChange,

  onGuestCountChange,
}: DateGuestStepProps) {
  const today =
    getTurkeyToday();

  const capacity =
    selectedAccommodation
      ?.capacity ??
    1;

  return (
    <section className="border border-[#E3E0D8] bg-white p-4 sm:p-6">
      <SectionTitle
        number="02"
        title="Tarih ve Misafir"
      />

      {isLoadingAvailability && (
        <div className="mt-5 flex items-center gap-2 border border-[#E4E1D9] bg-[#F7F6F2] px-3 py-3 text-xs text-[#737871]">
          <Loader2
            size={14}
            className="animate-spin"
          />

          Müsaitlik kontrol ediliyor...
        </div>
      )}

      {!isLoadingAvailability &&
        busyRanges.length >
          0 && (
          <div className="mt-5 border border-[#E7D8C0] bg-[#FAF5EA] p-4">
            <div className="flex items-start gap-3">
              <CalendarDays
                size={17}
                className="mt-0.5 shrink-0 text-[#9A7041]"
              />

              <div>
                <p className="text-xs font-semibold text-[#765B35]">
                  Dolu Tarihler
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#8B795E]">
                  Aşağıdaki aralıklar
                  rezervasyona kapalıdır.
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {busyRanges
                .slice(
                  0,
                  8,
                )
                .map(
                  (
                    range,
                  ) => (
                    <span
                      key={`${range.checkIn}-${range.checkOut}`}
                      className="bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#765B35]"
                    >
                      {formatReservationDate(
                        range.checkIn,
                      )}{" "}
                      →{" "}
                      {formatReservationDate(
                        range.checkOut,
                      )}
                    </span>
                  ),
                )}
            </div>

            {busyRanges.length >
              8 && (
              <p className="mt-3 text-[10px] text-[#8B795E]">
                +
                {busyRanges.length -
                  8}{" "}
                dolu tarih aralığı
                daha bulunuyor.
              </p>
            )}
          </div>
        )}

      {!isLoadingAvailability &&
        busyRanges.length ===
          0 &&
        !availabilityError && (
          <div className="mt-5 flex items-center gap-2 border border-[#D8E3D5] bg-[#F1F6EF] px-3 py-3 text-xs text-[#526A51]">
            <CheckCircle2
              size={15}
            />

            Bu konaklama için
            yaklaşan dolu tarih
            bulunmuyor.
          </div>
        )}

      {availabilityError && (
        <div className="mt-5 flex items-start gap-2 border border-[#E7D8C0] bg-[#FAF5EA] p-3 text-xs leading-5 text-[#88662F]">
          <AlertTriangle
            size={15}
            className="mt-0.5 shrink-0"
          />

          {availabilityError}{" "}
          Rezervasyon gönderilirken
          müsaitlik tekrar kontrol
          edilecek.
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>
            Giriş Tarihi
          </FieldLabel>

          <div className="relative mt-2">
            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
            />

            <input
              type="date"
              min={today}
              required
              disabled={
                isLoadingAvailability
              }
              value={
                checkIn
              }
              onChange={(
                event,
              ) =>
                onCheckInChange(
                  event.target
                    .value,
                )
              }
              className={`${inputClass} pl-10 disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>
        </div>

        <div>
          <FieldLabel>
            Çıkış Tarihi
          </FieldLabel>

          <div className="relative mt-2">
            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
            />

            <input
              type="date"
              min={
                checkIn ||
                today
              }
              required
              disabled={
                isLoadingAvailability ||
                !checkIn
              }
              value={
                checkOut
              }
              onChange={(
                event,
              ) =>
                onCheckOutChange(
                  event.target
                    .value,
                )
              }
              className={`${inputClass} pl-10 disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>
        </div>
      </div>

      {dateError && (
        <div className="mt-4 flex items-start gap-3 border border-[#E5C7C0] bg-[#F8EEEA] p-4">
          <AlertTriangle
            size={17}
            className="mt-0.5 shrink-0 text-[#98584E]"
          />

          <div>
            <p className="text-xs font-semibold text-[#98584E]">
              Bu tarihler
              müsait değil
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#8A635D]">
              {dateError}
            </p>

            <p className="mt-2 text-[10px] text-[#9A746E]">
              Lütfen farklı giriş
              veya çıkış tarihi
              seçin.
            </p>
          </div>
        </div>
      )}

      {checkIn &&
        checkOut &&
        !dateError && (
          <div className="mt-4 flex items-center gap-2 bg-[#EAF2E8] px-3 py-3 text-xs font-medium text-[#496449]">
            <CheckCircle2
              size={15}
            />

            Seçtiğiniz tarih aralığı
            şu anda müsait
            görünüyor.
          </div>
        )}

      <div className="mt-5 flex items-center justify-between border-t border-[#EEEAE3] pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
            <Users
              size={17}
            />
          </div>

          <div>
            <p className="text-xs font-medium text-[#40463F]">
              Misafir Sayısı
            </p>

            <p className="text-[10px] text-[#969990]">
              Maksimum{" "}
              {capacity}{" "}
              kişi
            </p>
          </div>
        </div>

        <div className="flex items-center border border-[#DDD9D1]">
          <button
            type="button"
            onClick={() =>
              onGuestCountChange(
                Math.max(
                  1,
                  guestCount -
                    1,
                ),
              )
            }
            className="flex h-10 w-10 items-center justify-center"
          >
            <Minus
              size={14}
            />
          </button>

          <span className="flex h-10 w-10 items-center justify-center border-x border-[#DDD9D1] text-sm font-semibold text-[#263A2D]">
            {guestCount}
          </span>

          <button
            type="button"
            onClick={() =>
              onGuestCountChange(
                Math.min(
                  capacity,
                  guestCount +
                    1,
                ),
              )
            }
            className="flex h-10 w-10 items-center justify-center"
          >
            <Plus
              size={14}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "h-11 w-full min-w-0 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm";



