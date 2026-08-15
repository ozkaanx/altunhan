import Link from "next/link";

import { FiArrowRight } from "react-icons/fi";

export function AccommodationReservationCta() {
  return (
    <div className="mt-10 text-center md:mt-14">
      <Link
        href="/rezervasyon"
        className="
          inline-flex
          h-12
          items-center
          justify-center
          gap-3
          border
          border-[#263A2D]
          px-7
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-[#263A2D]
          transition-colors
          hover:bg-[#263A2D]
          hover:text-white
        "
      >
        Rezervasyon Yap
        <FiArrowRight size={13} aria-hidden="true" />
      </Link>
    </div>
  );
}
