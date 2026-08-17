import { formatPrice } from "@/lib/formatters/price";
import { formatReservationDate } from "@/lib/reservation/date-utils";
import { CHECK_IN_POLICY_TEXT, CHECK_OUT_POLICY_TEXT } from "@/lib/reservation/stay-policy";

import type { PublicAccommodation } from "@/types/public-reservation";

type ReservationSummaryDetailsProps = {
  accommodation: PublicAccommodation | undefined;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  estimatedNightCount: number;
};

export function ReservationSummaryDetails({
  accommodation,
  checkIn,
  checkOut,
  adultCount,
  childCount,
  estimatedNightCount,
}: ReservationSummaryDetailsProps) {
  const guestText =
    childCount > 0 ? `${adultCount} yetişkin · ${childCount} çocuk` : `${adultCount} yetişkin`;

  return (
    <>
      <div className="space-y-3">
        <SummaryRow
          label="Giriş"
          value={
            checkIn ? `${formatReservationDate(checkIn)} · ${CHECK_IN_POLICY_TEXT}` : "Tarih seçin"
          }
        />
        <SummaryRow
          label="Çıkış"
          value={
            checkOut
              ? `${formatReservationDate(checkOut)} · ${CHECK_OUT_POLICY_TEXT}`
              : "Tarih seçin"
          }
        />
        <SummaryRow label="Misafir" value={guestText} />
        <SummaryRow
          label="Konaklama"
          value={estimatedNightCount > 0 ? `${estimatedNightCount} gece` : "—"}
        />
      </div>

      <div className="mt-5 border-t border-[#E2DED5] pt-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] text-[#858A83]">Gecelik fiyat</span>
          <span className="text-xs font-medium text-[#263A2D]">
            {accommodation ? formatPrice(accommodation.price) : "—"}
          </span>
        </div>

        {estimatedNightCount > 0 && (
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="text-[10px] text-[#858A83]">Hesaplama</span>
            <span className="text-[10px] text-[#6D736C]">{estimatedNightCount} gece</span>
          </div>
        )}
      </div>
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] text-[#969990]">{label}</span>
      <span className="max-w-[210px] text-right text-[11px] font-medium text-[#263A2D]">
        {value}
      </span>
    </div>
  );
}
