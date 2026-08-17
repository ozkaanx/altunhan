import { AccommodationAmenities } from "@/components/accommodation/accommodation-amenities";
import { AccommodationDescription } from "@/components/accommodation/accommodation-description";

import type { Accommodation } from "@/types/accommodation";

type AccommodationDetailsSectionProps = {
  accommodation: Pick<Accommodation, "description" | "short_description" | "amenities">;
};

export function AccommodationDetailsSection({ accommodation }: AccommodationDetailsSectionProps) {
  return (
    <section className="md:py-18 px-5 py-12 sm:px-6 sm:py-14 md:px-12 lg:px-16">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <AccommodationDescription
          description={accommodation.description}
          shortDescription={accommodation.short_description}
        />

        <AccommodationAmenities amenities={accommodation.amenities} />
      </div>
    </section>
  );
}
