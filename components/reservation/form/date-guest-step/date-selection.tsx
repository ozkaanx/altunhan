import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

import { AvailabilityInfo } from "@/components/reservation/form/date-guest-step/availability-info";
import { DateField } from "@/components/reservation/form/date-guest-step/date-field";

import { getTurkeyToday } from "@/lib/reservation/date-utils";
import { STAY_TIME_POLICY_SUMMARY } from "@/lib/reservation/stay-policy";

import type { AccommodationBusyRange } from "@/types/public-reservation";

type DateSelectionProps = {
  checkIn: string;
  checkOut: string;
  busyRanges: AccommodationBusyRange[];
  isLoadingAvailability: boolean;
  availabilityError: string | null;
  dateError: string | null;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
};

export function DateSelection({
  checkIn,
  checkOut,
  busyRanges,
  isLoadingAvailability,
  availabilityError,
  dateError,
  onCheckInChange,
  onCheckOutChange,
}: DateSelectionProps) {
  const today = getTurkeyToday();

  return (
    <>
      <AvailabilityInfo
        isLoading={isLoadingAvailability}
        busyRanges={busyRanges}
        error={availabilityError}
      />

      <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2">
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

      <div className="mt-3 flex items-center gap-2 bg-[#F3F0E9] px-3 py-2.5 text-[10px] leading-5 text-[#6D736C]">
        <Clock3 size={14} className="shrink-0 text-[#A8754F]" aria-hidden="true" />
        {STAY_TIME_POLICY_SUMMARY}
      </div>

      {dateError ? (
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
          role="alert"
        >
          <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#98584E]" aria-hidden="true" />

          <div>
            <p className="text-xs font-semibold text-[#98584E]">Bu tarihler müsait değil</p>
            <p className="mt-1 text-[11px] leading-5 text-[#8A635D]">{dateError}</p>
          </div>
        </div>
      ) : checkIn && checkOut ? (
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
          role="status"
        >
          <CheckCircle2 size={15} aria-hidden="true" />
          Seçtiğiniz tarih aralığı şu anda müsait görünüyor.
        </div>
      ) : null}
    </>
  );
}
