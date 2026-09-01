import Link from "next/link";

import { ArrowRight, BedDouble, Check } from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";
import {
  getSeptemberPromotionalNightlyPrice,
  isSeptemberPromotionVisible,
} from "@/lib/reservation/september-promotion";

type AccommodationReservationCardProps = {
  price: number;
  reservationHref: string;
};

export function AccommodationReservationCard({
  price,
  reservationHref,
}: AccommodationReservationCardProps) {
  const showPromotion = isSeptemberPromotionVisible();

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="border border-[#D4CEC3] bg-[#FAF8F2] p-6 shadow-[0_12px_35px_rgba(38,58,45,0.04)] sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A8754F]">
              Gecelik Fiyat
            </p>

            {showPromotion ? (
              <>
                <p className="mt-3 text-xs text-[#92968E] line-through">{formatPrice(price)}</p>
                <p className="mt-1 font-serif text-[40px] leading-none tracking-[-0.02em] text-[#263A2D] sm:text-[44px]">
                  {formatPrice(getSeptemberPromotionalNightlyPrice(price))}
                </p>
                <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#A8754F]">
                  Eylül gecelerinde %20 indirim
                </p>
              </>
            ) : (
              <p className="mt-3 font-serif text-[40px] leading-none tracking-[-0.02em] text-[#263A2D] sm:text-[44px]">
                {formatPrice(price)}
              </p>
            )}

            <p className="mt-2 text-[10px] text-[#92968E]">Oda başına / gecelik</p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E9EDE6] text-[#526048]">
            <BedDouble size={17} strokeWidth={1.4} />
          </div>
        </div>

        <div className="my-6 h-px bg-[#DDD8CC]" />

        <p className="text-xs leading-6 text-[#676E66]">
          Tarih ve kişi bilgilerinizi seçerek konaklamanız için müsaitliği kontrol edin.
        </p>

        <Link
          href={reservationHref}
          className="group mt-6 flex h-[52px] w-full items-center justify-center gap-3 bg-[#263A2D] px-5 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition-colors hover:bg-[#354A3B]"
        >
          Rezervasyon Yap
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <div className="mt-5 flex items-start gap-3 border-t border-[#DDD8CC] pt-5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E9EDE6] text-[#526048]">
            <Check size={11} strokeWidth={2} />
          </div>

          <p className="text-[10px] leading-5 text-[#7D837C]">
            Müsaitlik kontrolünden sonra ödeme ve onay adımları ekranda gösterilir.
          </p>
        </div>
      </div>
    </aside>
  );
}
