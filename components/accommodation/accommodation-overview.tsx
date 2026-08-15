import { AccommodationReservationCard } from "@/components/accommodation/accommodation-reservation-card";
import { AccommodationSummary } from "@/components/accommodation/accommodation-summary";

import type { Accommodation } from "@/types/accommodation";

type AccommodationOverviewProps = {
  accommodation: Accommodation;
  reservationHref: string;
};

export function AccommodationOverview({
  accommodation,
  reservationHref,
}: AccommodationOverviewProps) {
  return (
    <section className="px-5 sm:px-6 md:px-12 lg:px-16">
      <div
        className="
          mx-auto
          grid
          max-w-[1500px]
          gap-9
          border-b
          border-[#D9D4CA]
          pb-12
          lg:grid-cols-[minmax(0,1fr)_380px]
          lg:items-start
          lg:gap-14
          lg:pb-16
        "
      >
        <AccommodationSummary accommodation={accommodation} />

        <AccommodationReservationCard
          price={accommodation.price}
          reservationHref={reservationHref}
        />
      </div>
    </section>
  );
}
