import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { SliderButton } from "@/components/shared/location-reviews/slider-button";

type ReviewsHeaderProps = {
  reviewCount: number;
  label: string;
  title: string;
  onPrevious: () => void;
  onNext: () => void;
};

export function ReviewsHeader({
  reviewCount,
  label,
  title,
  onPrevious,
  onNext,
}: ReviewsHeaderProps) {
  return (
    <div className="flex min-w-0 flex-col justify-end">
      <div className="flex items-end justify-between gap-5">
        <div>
          <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A8754F]">
            {label}
          </span>

          <h2 className="mt-4 max-w-[620px] font-serif text-[20px] leading-[1.08] text-[#263A2D] sm:text-4xl md:text-[32px]">
            {title}
          </h2>
        </div>

        {reviewCount > 1 ? (
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <SliderButton label="Önceki yorum" onClick={onPrevious}>
              <FiChevronLeft size={18} aria-hidden="true" />
            </SliderButton>

            <SliderButton label="Sonraki yorum" onClick={onNext}>
              <FiChevronRight size={18} aria-hidden="true" />
            </SliderButton>
          </div>
        ) : null}
      </div>
    </div>
  );
}
