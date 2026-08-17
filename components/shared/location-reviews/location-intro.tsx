import Link from "next/link";

import { FiArrowRight, FiMapPin } from "react-icons/fi";

type LocationIntroProps = {
  address: string;
  mapsSearchUrl: string;
  label: string;
  title: string;
};

export function LocationIntro({ address, mapsSearchUrl, label, title }: LocationIntroProps) {
  return (
    <div className="min-w-0">
      <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A8754F]">
        {label}
      </span>

      <h2 className="mt-4 max-w-[460px] font-serif text-[30px] leading-[1.05] text-[#263A2D] sm:text-[34px] md:text-[38px]">
        {title}
      </h2>

      <div className="mt-6 flex items-start gap-3">
        <FiMapPin
          size={18}
          strokeWidth={1.3}
          className="mt-0.5 shrink-0 text-[#A8754F]"
          aria-hidden="true"
        />

        <p className="max-w-[320px] text-xs font-medium leading-6 text-[#60655E]">{address}</p>
      </div>

      <Link
        href={mapsSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-5 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#263A2D]"
      >
        Nasıl Gidilir?
        <FiArrowRight
          size={12}
          className="transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
