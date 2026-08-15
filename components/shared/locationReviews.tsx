"use client";

import { LocationIntro } from "@/components/shared/location-reviews/location-intro";
import { LocationMap } from "@/components/shared/location-reviews/location-map";
import { ReviewsHeader } from "@/components/shared/location-reviews/reviews-header";
import { ReviewsPanel } from "@/components/shared/location-reviews/reviews-panel";

import { useReviewSlider } from "@/hooks/shared/use-review-slider";

import type { HomepageContent } from "@/types/homepage-content";
import type { Review } from "@/types/review";
import type { SiteSettings } from "@/types/site-settings";

type LocationReviewsProps = {
  settings: SiteSettings | null;
  reviews: Review[];
  content: HomepageContent | null;
};

export default function LocationReviews({ settings, reviews, content }: LocationReviewsProps) {
  const { sliderRef, scrollSlider } = useReviewSlider();

  const address = settings?.address?.trim() || "Adilhan Köyü, Keşan / Edirne";
  const encodedAddress = encodeURIComponent(address);
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <section id="iletisim" className="w-full border-y border-[#DDD8CC] bg-[#F5F1E8]">
      <div
        className="
          mx-auto
          max-w-[1500px]
          px-5
          py-12
          sm:px-6
          sm:py-14
          md:px-12
          md:py-16
          lg:px-16
        "
      >
        <div className="mb-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 xl:gap-16">
          <LocationIntro
            address={address}
            mapsSearchUrl={mapsSearchUrl}
            label={content?.location_label || "KONUM"}
            title={content?.location_title || "Saros'un kıyısında, doğanın içinde."}
          />

          <ReviewsHeader
            reviewCount={reviews.length}
            label={content?.reviews_label || "MİSAFİRLERİMİZ NE DİYOR?"}
            title={content?.reviews_title || "Güzel anılar, güzel sözler."}
            onPrevious={() => scrollSlider("prev")}
            onNext={() => scrollSlider("next")}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch lg:gap-12 xl:gap-16">
          <LocationMap mapsEmbedUrl={mapsEmbedUrl} />

          <ReviewsPanel
            reviews={reviews}
            sliderRef={sliderRef}
            onPrevious={() => scrollSlider("prev")}
            onNext={() => scrollSlider("next")}
          />
        </div>
      </div>
    </section>
  );
}
