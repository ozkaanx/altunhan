import type { RefObject } from "react";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { ReviewCard } from "@/components/shared/location-reviews/review-card";
import { SliderButton } from "@/components/shared/location-reviews/slider-button";

import type { Review } from "@/types/review";

type ReviewsPanelProps = {
  reviews: Review[];
  sliderRef: RefObject<HTMLDivElement | null>;
  onPrevious: () => void;
  onNext: () => void;
};

export function ReviewsPanel({ reviews, sliderRef, onPrevious, onNext }: ReviewsPanelProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex min-w-0 flex-col">
        <div className="flex min-h-[320px] flex-1 items-center justify-center border border-[#DDD8CC] bg-[#FAF8F2] p-8 text-center lg:min-h-[440px]">
          <p className="max-w-[300px] text-xs leading-6 text-[#747972]">
            Henüz yayınlanmış misafir yorumu bulunmuyor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col">
      <div
        ref={sliderRef}
        className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviews.length > 1 ? (
        <div className="mt-5 flex items-center justify-between sm:hidden">
          <p className="text-[9px] uppercase tracking-[0.15em] text-[#92968F]">
            Kaydırarak diğer yorumları gör
          </p>

          <div className="flex items-center gap-2">
            <SliderButton label="Önceki yorum" onClick={onPrevious}>
              <FiChevronLeft size={18} aria-hidden="true" />
            </SliderButton>

            <SliderButton label="Sonraki yorum" onClick={onNext}>
              <FiChevronRight size={18} aria-hidden="true" />
            </SliderButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
