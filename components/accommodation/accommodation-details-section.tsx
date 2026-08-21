import { AccommodationAmenities } from "@/components/accommodation/accommodation-amenities";

import type { Accommodation } from "@/types/accommodation";

type AccommodationDetailsSectionProps = {
  accommodation: Pick<Accommodation, "amenities">;
};

export function AccommodationDetailsSection({
  accommodation,
}: AccommodationDetailsSectionProps) {
  return (
    <section className="md:py-18 px-5 py-12 sm:px-6 sm:py-14 md:px-12 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <AccommodationAmenities amenities={accommodation.amenities} />
      </div>
    </section>
  );
}
