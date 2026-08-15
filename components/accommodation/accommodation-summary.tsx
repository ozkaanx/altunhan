import { Bath, BedDouble, Users } from "lucide-react";

import { AccommodationInfoCard } from "@/components/accommodation/accommodation-info-card";

import type { Accommodation } from "@/types/accommodation";

type AccommodationSummaryProps = {
  accommodation: Pick<
    Accommodation,
    "title" | "short_description" | "capacity" | "bed_count" | "bathroom_count"
  >;
};

export function AccommodationSummary({ accommodation }: AccommodationSummaryProps) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-3">
        <div className="h-px w-8 bg-[#A8754F]" />

        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.25em]
            text-[#A8754F]
          "
        >
          Konaklama
        </p>
      </div>

      <h1
        className="
          mt-4
          max-w-[900px]
          font-serif
          text-[38px]
          leading-[1.02]
          text-[#263A2D]
          sm:text-5xl
          lg:text-[58px]
        "
      >
        {accommodation.title}
      </h1>

      {accommodation.short_description && (
        <p
          className="
            mt-5
            max-w-[680px]
            text-sm
            leading-7
            text-[#626860]
            sm:text-[15px]
          "
        >
          {accommodation.short_description}
        </p>
      )}

      <div
        className="
          mt-8
          grid
          grid-cols-3
          border
          border-[#D9D4CA]
          bg-[#FAF8F2]
        "
      >
        <AccommodationInfoCard
          icon={Users}
          label="Kapasite"
          value={`Maks. ${accommodation.capacity} kişi`}
        />

        <AccommodationInfoCard
          icon={BedDouble}
          label="Yatak"
          value={`${accommodation.bed_count} adet`}
        />

        <AccommodationInfoCard
          icon={Bath}
          label="Banyo"
          value={`${accommodation.bathroom_count} adet`}
        />
      </div>
    </div>
  );
}
