import Link from "next/link";

import { ArrowRight } from "lucide-react";

type AccommodationReservationCtaProps = {
  reservationHref: string;
};

export function AccommodationReservationCta({ reservationHref }: AccommodationReservationCtaProps) {
  return (
    <section className="px-5 pb-14 sm:px-6 sm:pb-16 md:px-12 md:pb-20 lg:px-16">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-7 bg-[#263A2D] px-6 py-8 text-white sm:px-8 sm:py-10 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#C9B08A]">
            Altunhan Farm
          </p>

          <h2 className="mt-3 max-w-[680px] font-serif text-[30px] leading-tight text-white sm:text-[38px]">
            Saros&apos;ta yerinizi ayırın.
          </h2>

          <p className="mt-3 max-w-[560px] text-xs leading-6 text-white/60 sm:text-sm">
            Tarihlerinizi seçin, müsaitliği kontrol edin ve rezervasyon talebinizi birkaç adımda
            oluşturun.
          </p>
        </div>

        <Link
          href={reservationHref}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 bg-[#F5F1E8] px-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#263A2D] transition-colors hover:bg-white"
        >
          Rezervasyon Yap
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
