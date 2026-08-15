import { AccommodationCard } from "@/components/shared/accommodation-section/accommodation-card";

import { getHomeAccommodationGridClassName } from "@/lib/accommodation/home-accommodation-utils";

import type { HomeAccommodation } from "@/types/home-accommodation";

type AccommodationGridProps = {
  accommodations: HomeAccommodation[];
};

export function AccommodationGrid({ accommodations }: AccommodationGridProps) {
  const layoutClassName = getHomeAccommodationGridClassName(accommodations.length);

  return (
    <div className={`grid items-stretch gap-6 ${layoutClassName}`}>
      {accommodations.map((accommodation) => (
        <AccommodationCard key={accommodation.id} accommodation={accommodation} />
      ))}
    </div>
  );
}
