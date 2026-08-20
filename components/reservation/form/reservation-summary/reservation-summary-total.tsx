import { ArrowRight, Loader2 } from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";

type ReservationSummaryTotalProps = {
  estimatedNightCount: number;
  estimatedTotal: number;
  estimatedDeposit: number;
  isDisabled: boolean;
  isSubmitting: boolean;
  submitLabel: string;
};

export function ReservationSummaryTotal({
  estimatedNightCount,
  estimatedTotal,
  estimatedDeposit,
  isDisabled,
  isSubmitting,
  submitLabel,
}: ReservationSummaryTotalProps) {
  const hasEstimate = estimatedNightCount > 0;

  return (
    <div className="mt-5 bg-[#263A2D] p-5 text-white">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55">
        Toplam Tutar
      </p>

      <div className="mt-2 flex items-end justify-between gap-4">
        <p className="font-serif text-[34px] leading-none tracking-[-0.02em]">
          {hasEstimate ? formatPrice(estimatedTotal) : "—"}
        </p>

        {hasEstimate && (
          <p className="pb-0.5 text-[9px] text-white/50">{estimatedNightCount} gece</p>
        )}
      </div>

      {hasEstimate && (
        <div className="mt-4 border-t border-white/15 pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/55">
              Şimdi Ödenecek Kapora
            </p>
            <p className="text-sm font-semibold text-white">{formatPrice(estimatedDeposit)}</p>
          </div>

          <p className="mt-3 text-[9px] leading-5 text-white/55">
            Bir gece için toplamın yarısı; daha uzun konaklamalarda bir gecelik ücret kapora olarak
            alınır. Rezervasyon, kapora doğrulandıktan sonra kesinleşir.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className="group mt-5 flex h-[52px] w-full items-center justify-center gap-2.5 bg-[#FAF8F2] px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#263A2D] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45"
      >
        {isSubmitting ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          !isDisabled && (
            <ArrowRight
              size={14}
              className="order-2 transition-transform group-hover:translate-x-1"
            />
          )
        )}

        {submitLabel}
      </button>
    </div>
  );
}
