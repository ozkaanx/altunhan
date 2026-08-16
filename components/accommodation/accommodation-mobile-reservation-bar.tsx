import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";

type AccommodationMobileReservationBarProps = {
  price: number;
  reservationHref: string;
};

export function AccommodationMobileReservationBar({
  price,
  reservationHref,
}: AccommodationMobileReservationBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#D4CEC3] bg-[#FAF8F2]/95 px-4 pt-3 shadow-[0_-12px_30px_rgba(38,58,45,0.1)] backdrop-blur-md pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-4">
        <div className="min-w-0 shrink-0">
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#A8754F]">
            Gecelik
          </p>
          <p className="mt-1 font-serif text-xl leading-none text-[#263A2D]">
            {formatPrice(price)}
          </p>
        </div>

        <Link
          href={reservationHref}
          className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 bg-[#263A2D] px-4 text-[9px] font-semibold uppercase tracking-[0.13em] text-white"
        >
          Müsaitliği Kontrol Et
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
