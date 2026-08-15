import { AccommodationEmptyState } from "@/components/shared/accommodation-section/accommodation-empty-state";
import { AccommodationGrid } from "@/components/shared/accommodation-section/accommodation-grid";
import { AccommodationReservationCta } from "@/components/shared/accommodation-section/accommodation-reservation-cta";
import { AccommodationSectionHeader } from "@/components/shared/accommodation-section/accommodation-section-header";

import type { HomeAccommodation } from "@/types/home-accommodation";
import type { HomepageContent } from "@/types/homepage-content";

type AccommodationProps = {
  accommodations: HomeAccommodation[];
  content: HomepageContent | null;
};

export default function Accommodation({ accommodations, content }: AccommodationProps) {
  const hasAccommodations = accommodations.length > 0;

  return (
    <section
      id="konaklama"
      className="
        w-full
        bg-[#F5F1E8]
        px-5
        py-16
        sm:px-6
        sm:py-20
        md:px-12
        md:py-24
        lg:px-16
      "
    >
      <div className="mx-auto max-w-[1500px]">
        <AccommodationSectionHeader
          label={content?.accommodation_label || "KONAKLAMA"}
          title={content?.accommodation_title || "Konakla. Yavaşla. Hisset."}
          description={
            content?.accommodation_description ||
            "Doğanın içinde, sade ve huzurlu konaklama seçeneklerimizi keşfedin."
          }
        />

        {hasAccommodations ? (
          <>
            <AccommodationGrid accommodations={accommodations} />
            <AccommodationReservationCta />
          </>
        ) : (
          <AccommodationEmptyState />
        )}
      </div>
    </section>
  );
}
