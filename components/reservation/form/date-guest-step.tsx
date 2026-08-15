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

import type { AccommodationBusyRange } from "@/app/rezervasyon/action";

import { FieldLabel } from "@/components/shared/fieldLabel";
import { SectionTitle } from "@/components/shared/sectionTitle";

import { formatReservationDate, getTurkeyToday } from "@/lib/reservation/date-utils";

import type { PublicAccommodation } from "@/types/public-reservation";

type DateGuestStepProps = {
  checkIn: string;
  checkOut: string;

  adultCount: number;
  childCount: number;

  selectedAccommodation: PublicAccommodation | undefined;

  busyRanges: AccommodationBusyRange[];

  isLoadingAvailability: boolean;

  availabilityError: string | null;
  dateError: string | null;

  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;

  onAdultCountChange: (value: number) => void;
  onChildCountChange: (value: number) => void;
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
  const today = getTurkeyToday();

  const maxAdults = selectedAccommodation?.max_adults ?? 1;
  const maxChildren = selectedAccommodation?.max_children ?? 0;

  const maxTotalGuests = selectedAccommodation?.max_total_guests ?? 1;

  const totalGuests = adultCount + childCount;

  const canIncreaseAdult =
    Boolean(selectedAccommodation) && adultCount < maxAdults && totalGuests < maxTotalGuests;

  const canIncreaseChild =
    Boolean(selectedAccommodation) && childCount < maxChildren && totalGuests < maxTotalGuests;

  return (
    <section
      className="
        border
        border-[#DDD8CC]
        bg-[#FAF8F2]
        p-4
        sm:p-6
      "
    >
      <SectionTitle number="02" title="Tarih ve Misafir" />

      <p
        className="
          mt-3
          max-w-[580px]
          text-[11px]
          leading-5
          text-[#81867F]
        "
      >
        Giriş ve çıkış tarihlerinizi belirleyin, ardından konaklayacak misafir sayısını seçin.
      </p>

      <AvailabilityInfo
        isLoading={isLoadingAvailability}
        busyRanges={busyRanges}
        error={availabilityError}
      />

      <div
        className="
          mt-6
          grid
          min-w-0
          gap-3
          sm:grid-cols-2
        "
      >
        <DateField
          label="Giriş Tarihi"
          value={checkIn}
          min={today}
          disabled={isLoadingAvailability}
          onChange={onCheckInChange}
        />

        <DateField
          label="Çıkış Tarihi"
          value={checkOut}
          min={checkIn || today}
          disabled={isLoadingAvailability}
          onChange={onCheckOutChange}
        />
      </div>

      {dateError && (
        <div
          className="
            mt-4
            flex
            items-start
            gap-3
            border
            border-[#E5C7C0]
            bg-[#F8EEEA]
            p-4
          "
        >
          <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#98584E]" />

          <div>
            <p className="text-xs font-semibold text-[#98584E]">Bu tarihler müsait değil</p>

            <p
              className="
                mt-1
                text-[11px]
                leading-5
                text-[#8A635D]
              "
            >
              {dateError}
            </p>
          </div>
        </div>
      )}

      {checkIn && checkOut && !dateError && (
        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            border
            border-[#D8E3D5]
            bg-[#EEF4EC]
            px-4
            py-3
            text-[11px]
            font-medium
            text-[#496449]
          "
        >
          <CheckCircle2 size={15} />
          Seçtiğiniz tarih aralığı şu anda müsait görünüyor.
        </div>
      )}

      <div
        className="
          mt-7
          border-t
          border-[#E3DED5]
          pt-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                bg-[#E9EDE6]
                text-[#526048]
              "
            >
              <Users size={17} strokeWidth={1.5} />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#263A2D]">Misafir Sayısı</p>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  leading-4
                  text-[#969990]
                "
              >
                En fazla {maxAdults} yetişkin · {maxChildren} çocuk
              </p>
            </div>
          </div>

          <p
            className="
              text-[10px]
              font-medium
              text-[#737970]
            "
          >
            Toplam kapasite {maxTotalGuests} kişi
          </p>
        </div>

        <div
          className="
            mt-5
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          <GuestCounter
            icon={<User size={17} />}
            title="Yetişkin"
            description={`En fazla ${maxAdults} kişi`}
            value={adultCount}
            decreaseDisabled={adultCount <= 1}
            increaseDisabled={!canIncreaseAdult}
            onDecrease={() => onAdultCountChange(adultCount - 1)}
            onIncrease={() => onAdultCountChange(adultCount + 1)}
          />

          <GuestCounter
            icon={<Baby size={17} />}
            title="Çocuk"
            description={`En fazla ${maxChildren} kişi`}
            value={childCount}
            decreaseDisabled={childCount <= 0}
            increaseDisabled={!canIncreaseChild}
            onDecrease={() => onChildCountChange(childCount - 1)}
            onIncrease={() => onChildCountChange(childCount + 1)}
          />
        </div>

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            bg-[#F1EFE8]
            px-4
            py-3
          "
        >
          <span className="text-[10px] text-[#7E837C]">Seçilen toplam misafir</span>

          <span className="text-xs font-semibold text-[#263A2D]">{totalGuests} kişi</span>
        </div>
      </div>
    </section>
  );
}

function AvailabilityInfo({
  isLoading,
  busyRanges,
  error,
}: {
  isLoading: boolean;
  busyRanges: AccommodationBusyRange[];
  error: string | null;
}) {
  if (isLoading) {
    return (
      <div
        className="
          mt-5
          flex
          items-center
          gap-2
          border
          border-[#E4E1D9]
          bg-[#F3F1EB]
          px-4
          py-3
          text-[11px]
          text-[#737871]
        "
      >
        <Loader2 size={14} className="animate-spin" />
        Müsaitlik bilgileri kontrol ediliyor...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          mt-5
          flex
          items-start
          gap-2
          border
          border-[#E7D8C0]
          bg-[#FAF5EA]
          p-4
          text-[11px]
          leading-5
          text-[#88662F]
        "
      >
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />

        <span>{error} Rezervasyon gönderilirken müsaitlik yeniden kontrol edilecek.</span>
      </div>
    );
  }

  if (busyRanges.length === 0) {
    return (
      <div
        className="
          mt-5
          flex
          items-center
          gap-2
          border
          border-[#D8E3D5]
          bg-[#F1F6EF]
          px-4
          py-3
          text-[11px]
          text-[#526A51]
        "
      >
        <CheckCircle2 size={15} />
        Bu konaklama için yaklaşan dolu tarih bulunmuyor.
      </div>
    );
  }

  return (
    <div
      className="
        mt-5
        border
        border-[#E7D8C0]
        bg-[#FAF5EA]
        p-4
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div className="flex items-start gap-3">
          <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#9A7041]" />

          <div>
            <p className="text-[11px] font-semibold text-[#765B35]">Dolu tarihler</p>

            <p
              className="
                mt-1
                text-[9px]
                leading-4
                text-[#8B795E]
              "
            >
              Aşağıdaki tarihler rezervasyona kapalıdır.
            </p>
          </div>
        </div>

        <span
          className="
            shrink-0
            text-[9px]
            font-medium
            text-[#9A7041]
          "
        >
          {busyRanges.length} aralık
        </span>
      </div>

      <div
        className="
          mt-3
          flex
          flex-wrap
          gap-1.5
        "
      >
        {busyRanges.slice(0, 4).map((range) => (
          <span
            key={`${range.checkIn}-${range.checkOut}`}
            className="
              border
              border-[#E7DAC5]
              bg-white/70
              px-2.5
              py-1.5
              text-[9px]
              font-medium
              text-[#765B35]
            "
          >
            {formatReservationDate(range.checkIn)} → {formatReservationDate(range.checkOut)}
          </span>
        ))}

        {busyRanges.length > 4 && (
          <span
            className="
              px-2.5
              py-1.5
              text-[9px]
              font-medium
              text-[#8B795E]
            "
          >
            +{busyRanges.length - 4} tarih daha
          </span>
        )}
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  min,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  min: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <FieldLabel>{label}</FieldLabel>

      <label
        className={`
          mt-2
          flex
          h-[54px]
          w-full
          min-w-0
          items-center
          overflow-hidden
          border
          border-[#D9D5CD]
          bg-white
          transition-colors
          focus-within:border-[#263A2D]

          ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        `}
      >
        <span
          className="
            pointer-events-none
            flex
            h-full
            w-12
            shrink-0
            items-center
            justify-center
            border-r
            border-[#EEEAE3]
          "
        >
          <CalendarDays size={16} strokeWidth={1.5} className="text-[#A8754F]" />
        </span>

        <input
          type="date"
          min={min}
          required
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          onClick={(event) => {
            try {
              event.currentTarget.showPicker?.();
            } catch {}
          }}
          className="
            h-full
            w-0
            min-w-0
            flex-1
            border-0
            bg-transparent
            px-3
            text-base
            text-[#263A2D]
            outline-none
            disabled:cursor-not-allowed
            sm:text-sm
          "
        />
      </label>
    </div>
  );
}

type GuestCounterProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: number;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
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
    <div
      className="
        flex
        items-center
        justify-between
        border
        border-[#DDD8CC]
        bg-white
        p-3
        sm:p-4
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            bg-[#F2EFE8]
            text-[#A8754F]
          "
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#263A2D]">{title}</p>

          <p className="mt-0.5 text-[9px] text-[#969990]">{description}</p>
        </div>
      </div>

      <div
        className="
          ml-3
          flex
          shrink-0
          items-center
          border
          border-[#D9D5CD]
        "
      >
        <button
          type="button"
          aria-label={`${title} azalt`}
          disabled={decreaseDisabled}
          onClick={onDecrease}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            transition-colors
            hover:bg-[#F1EFE9]
            disabled:cursor-not-allowed
            disabled:opacity-25
          "
        >
          <Minus size={13} />
        </button>

        <span
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            border-x
            border-[#D9D5CD]
            text-sm
            font-semibold
            text-[#263A2D]
          "
        >
          {value}
        </span>

        <button
          type="button"
          aria-label={`${title} artır`}
          disabled={increaseDisabled}
          onClick={onIncrease}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            transition-colors
            hover:bg-[#F1EFE9]
            disabled:cursor-not-allowed
            disabled:opacity-25
          "
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}
