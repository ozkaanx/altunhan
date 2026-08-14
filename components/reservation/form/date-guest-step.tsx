"use client";

import {
  AlertTriangle,
  Baby,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  User,
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

  adultCount: number;
  childCount: number;

  selectedAccommodation:
    | PublicAccommodation
    | undefined;

  busyRanges:
    AccommodationBusyRange[];

  isLoadingAvailability:
    boolean;

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

  onAdultCountChange: (
    value: number,
  ) => void;

  onChildCountChange: (
    value: number,
  ) => void;
};

export function DateGuestStep({
  checkIn,
  checkOut,

  adultCount,
  childCount,

  selectedAccommodation,

  busyRanges,

  isLoadingAvailability,
  availabilityError,
  dateError,

  onCheckInChange,
  onCheckOutChange,

  onAdultCountChange,
  onChildCountChange,
}: DateGuestStepProps) {
  const today =
    getTurkeyToday();

  const maxAdults =
    selectedAccommodation
      ?.max_adults ?? 1;

  const maxChildren =
    selectedAccommodation
      ?.max_children ?? 0;

  const maxTotalGuests =
    selectedAccommodation
      ?.max_total_guests ??
    1;

  const totalGuests =
    adultCount +
    childCount;

  const canIncreaseAdult =
    Boolean(
      selectedAccommodation,
    ) &&
    adultCount <
      maxAdults &&
    totalGuests <
      maxTotalGuests;

  const canIncreaseChild =
    Boolean(
      selectedAccommodation,
    ) &&
    childCount <
      maxChildren &&
    totalGuests <
      maxTotalGuests;

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

          Müsaitlik kontrol
          ediliyor...
        </div>
      )}

      {!isLoadingAvailability &&
        busyRanges.length >
          0 && (
          <div className="mt-5 border border-[#E7D8C0] bg-[#FAF5EA] p-4">
            <div className="flex items-start gap-3">
              <CalendarDays
                size={
                  17
                }
                className="mt-0.5 shrink-0 text-[#9A7041]"
              />

              <div>
                <p className="text-xs font-semibold text-[#765B35]">
                  Dolu
                  Tarihler
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#8B795E]">
                  Aşağıdaki
                  aralıklar
                  rezervasyona
                  kapalıdır.
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
                dolu tarih
                aralığı daha
                bulunuyor.
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

            Bu konaklama
            için yaklaşan
            dolu tarih
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
          Rezervasyon
          gönderilirken
          müsaitlik tekrar
          kontrol edilecek.
        </div>
      )}

      <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <FieldLabel>
            Giriş Tarihi
          </FieldLabel>

          <label
            className={`
              mt-2 flex h-11 w-full min-w-0
              items-center overflow-hidden
              border border-[#DDD9D1]
              bg-[#FAF9F6]
              transition
              focus-within:border-[#263A2D]
              ${
                isLoadingAvailability
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }
            `}
          >
            <span className="pointer-events-none flex h-full w-10 shrink-0 items-center justify-center">
              <CalendarDays
                size={
                  16
                }
                className="text-[#9B9E98]"
              />
            </span>

            <input
              type="date"
              min={
                today
              }
              required
              disabled={
                isLoadingAvailability
              }
              value={
                checkIn
              }
              onChange={(
                event,
              ) => {
                onCheckInChange(
                  event
                    .currentTarget
                    .value,
                );
              }}
              onClick={(
                event,
              ) => {
                try {
                  event.currentTarget.showPicker?.();
                } catch {
                  // Safari native picker kullanır.
                }
              }}
              className="
                h-full
                w-0
                min-w-0
                flex-1
                border-0
                bg-transparent
                p-0
                pr-3
                text-base
                text-[#263A2D]
                outline-none
                disabled:cursor-not-allowed
                sm:text-sm
              "
            />
          </label>
        </div>

        <div className="min-w-0">
          <FieldLabel>
            Çıkış Tarihi
          </FieldLabel>

          <label
            className={`
              mt-2 flex h-11 w-full min-w-0
              items-center overflow-hidden
              border border-[#DDD9D1]
              bg-[#FAF9F6]
              transition
              focus-within:border-[#263A2D]
              ${
                isLoadingAvailability
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }
            `}
          >
            <span className="pointer-events-none flex h-full w-10 shrink-0 items-center justify-center">
              <CalendarDays
                size={
                  16
                }
                className="text-[#9B9E98]"
              />
            </span>

            <input
              type="date"
              min={
                checkIn ||
                today
              }
              required
              disabled={
                isLoadingAvailability
              }
              value={
                checkOut
              }
              onChange={(
                event,
              ) => {
                onCheckOutChange(
                  event
                    .currentTarget
                    .value,
                );
              }}
              onClick={(
                event,
              ) => {
                try {
                  event.currentTarget.showPicker?.();
                } catch {
                  // Safari native picker kullanır.
                }
              }}
              className="
                h-full
                w-0
                min-w-0
                flex-1
                border-0
                bg-transparent
                p-0
                pr-3
                text-base
                text-[#263A2D]
                outline-none
                disabled:cursor-not-allowed
                sm:text-sm
              "
            />
          </label>
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
              Lütfen farklı
              giriş veya
              çıkış tarihi
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

            Seçtiğiniz tarih
            aralığı şu anda
            müsait görünüyor.
          </div>
        )}

      <div className="mt-5 border-t border-[#EEEAE3] pt-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
            <Users
              size={17}
            />
          </div>

          <div>
            <p className="text-xs font-medium text-[#40463F]">
              Misafir
              Bilgileri
            </p>

            <p className="mt-1 text-[10px] leading-4 text-[#969990]">
              En fazla{" "}
              {maxAdults}{" "}
              yetişkin ·{" "}
              {maxChildren}{" "}
              çocuk · toplam{" "}
              {
                maxTotalGuests
              }{" "}
              kişi
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <GuestCounter
            icon={
              <User
                size={
                  17
                }
              />
            }
            title="Yetişkin"
            description={`En fazla ${maxAdults}`}
            value={
              adultCount
            }
            decreaseDisabled={
              adultCount <=
              1
            }
            increaseDisabled={
              !canIncreaseAdult
            }
            onDecrease={() =>
              onAdultCountChange(
                adultCount -
                  1,
              )
            }
            onIncrease={() =>
              onAdultCountChange(
                adultCount +
                  1,
              )
            }
          />

          <GuestCounter
            icon={
              <Baby
                size={
                  17
                }
              />
            }
            title="Çocuk"
            description={`En fazla ${maxChildren}`}
            value={
              childCount
            }
            decreaseDisabled={
              childCount <=
              0
            }
            increaseDisabled={
              !canIncreaseChild
            }
            onDecrease={() =>
              onChildCountChange(
                childCount -
                  1,
              )
            }
            onIncrease={() =>
              onChildCountChange(
                childCount +
                  1,
              )
            }
          />
        </div>

        <div className="mt-3 flex items-center justify-between bg-[#F7F5EF] px-3 py-2.5">
          <span className="text-[10px] text-[#81857F]">
            Seçilen toplam
            misafir
          </span>

          <span className="text-xs font-semibold text-[#263A2D]">
            {totalGuests}{" "}
            kişi
          </span>
        </div>
      </div>
    </section>
  );
}

type GuestCounterProps = {
  icon:
    React.ReactNode;

  title: string;

  description:
    string;

  value: number;

  decreaseDisabled:
    boolean;

  increaseDisabled:
    boolean;

  onDecrease:
    () => void;

  onIncrease:
    () => void;
};

function GuestCounter({
  icon,
  title,
  description,
  value,
  decreaseDisabled,
  increaseDisabled,
  onDecrease,
  onIncrease,
}: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between border border-[#E3E0D8] bg-[#FAF9F6] p-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-[#A8754F]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-[#40463F]">
            {title}
          </p>

          <p className="mt-0.5 text-[9px] text-[#969990]">
            {description}
          </p>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center border border-[#DDD9D1] bg-white">
        <button
          type="button"
          aria-label={`${title} azalt`}
          disabled={
            decreaseDisabled
          }
          onClick={
            onDecrease
          }
          className="flex h-9 w-9 items-center justify-center transition hover:bg-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus
            size={13}
          />
        </button>

        <span className="flex h-9 w-9 items-center justify-center border-x border-[#DDD9D1] text-sm font-semibold text-[#263A2D]">
          {value}
        </span>

        <button
          type="button"
          aria-label={`${title} artır`}
          disabled={
            increaseDisabled
          }
          onClick={
            onIncrease
          }
          className="flex h-9 w-9 items-center justify-center transition hover:bg-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus
            size={13}
          />
        </button>
      </div>
    </div>
  );
}