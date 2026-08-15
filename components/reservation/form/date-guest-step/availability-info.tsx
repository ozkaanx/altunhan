import { AlertTriangle, CalendarDays, CheckCircle2, Loader2 } from "lucide-react";

import { formatReservationDate } from "@/lib/reservation/date-utils";

import type { AccommodationBusyRange } from "@/types/public-reservation";

type AvailabilityInfoProps = {
  isLoading: boolean;
  busyRanges: AccommodationBusyRange[];
  error: string | null;
};

export function AvailabilityInfo({ isLoading, busyRanges, error }: AvailabilityInfoProps) {
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
        role="status"
      >
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
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
        role="alert"
      >
        <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
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
        role="status"
      >
        <CheckCircle2 size={15} aria-hidden="true" />
        Bu konaklama için yaklaşan dolu tarih bulunmuyor.
      </div>
    );
  }

  return (
    <div className="mt-5 border border-[#E7D8C0] bg-[#FAF5EA] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#9A7041]" aria-hidden="true" />

          <div>
            <p className="text-[11px] font-semibold text-[#765B35]">Dolu tarihler</p>
            <p className="mt-1 text-[9px] leading-4 text-[#8B795E]">
              Aşağıdaki tarihler rezervasyona kapalıdır.
            </p>
          </div>
        </div>

        <span className="shrink-0 text-[9px] font-medium text-[#9A7041]">
          {busyRanges.length} aralık
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
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

        {busyRanges.length > 4 ? (
          <span className="px-2.5 py-1.5 text-[9px] font-medium text-[#8B795E]">
            +{busyRanges.length - 4} tarih daha
          </span>
        ) : null}
      </div>
    </div>
  );
}
