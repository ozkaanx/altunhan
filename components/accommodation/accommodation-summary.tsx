import { Bath, BedDouble, Users } from "lucide-react";

import { AccommodationInfoCard } from "@/components/accommodation/accommodation-info-card";
import { AccommodationRoomAmenities } from "@/components/accommodation/accommodation-room-amenities";

import type { Accommodation } from "@/types/accommodation";
import {
  getAccommodationBedSummary,
  type AccommodationBedConfiguration,
} from "@/lib/accommodation/accommodation-bed-summary";

type AccommodationSummaryProps = {
  accommodation: Pick<
    Accommodation,
    | "title"
    | "short_description"
    | "capacity"
    | "bed_count"
    | "bathroom_count"
    | "amenities"
  >;
  bedConfigurations: AccommodationBedConfiguration[];
};

export function AccommodationSummary({
  accommodation,
  bedConfigurations,
}: AccommodationSummaryProps) {
  const hasRoomBedConfigurations = bedConfigurations.length > 0;

  const bedSummary = getAccommodationBedSummary(
    bedConfigurations,
    accommodation.bed_count,
  );

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-3">
        <div className="h-px w-8 bg-[#A8754F]" />

        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A8754F]">
          Konaklama
        </p>
      </div>

      <h1 className="mt-4 max-w-[900px] font-serif text-[38px] leading-[1.02] text-[#263A2D] sm:text-5xl lg:text-[58px]">
        {accommodation.title}
      </h1>

      {accommodation.short_description && (
        <p className="mt-5 max-w-[680px] text-sm leading-7 text-[#626860] sm:text-[15px]">
          {accommodation.short_description}
        </p>
      )}

      <div className="mt-8 grid grid-cols-3 ">
        <AccommodationInfoCard
          icon={Users}
          label="Kapasite"
          value={`Maks. ${accommodation.capacity} kişi`}
        />

        <AccommodationInfoCard
          icon={BedDouble}
          label={hasRoomBedConfigurations ? "Yatak Düzeni" : "Yatak"}
          value={bedSummary}
        />

        <AccommodationInfoCard
          icon={Bath}
          label="Banyo"
          value={`${accommodation.bathroom_count} adet`}
        />
      </div>

      <AccommodationRoomAmenities amenities={accommodation.amenities} />
    </div>
  );
}
