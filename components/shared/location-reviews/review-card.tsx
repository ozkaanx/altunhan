import type { Review } from "@/types/review";

type ReviewCardProps = {
  review: Review;
};

const STAR_COUNT = 5;

export function ReviewCard({ review }: ReviewCardProps) {
  const rating = Number(review.rating);

  return (
    <article
      className="
        flex
        min-h-[260px]
        w-[88%]
        shrink-0
        snap-start
        flex-col
        border
        border-[#DDD8CC]
        bg-[#FAF8F2]
        p-6
        sm:w-[70%]
        sm:p-7
        md:w-[55%]
        lg:min-h-[340px]
        lg:w-[calc((100%-16px)/2)]
      "
    >
      <div className="font-serif text-5xl leading-none text-[#C8B49C]" aria-hidden="true">
        “
      </div>

      <p className="mt-5 flex-1 font-serif text-[17px] leading-[1.65] text-[#343C35] sm:text-lg">
        {review.review_text}
      </p>

      <div className="mt-8 border-t border-[#DDD8CC] pt-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#263A2D]">
            {review.guest_name}
          </p>

          <div className="flex gap-1 text-[13px]" aria-label={`${rating} yıldız`}>
            {Array.from({ length: STAR_COUNT }, (_, index) => (
              <span
                key={index}
                className={index < rating ? "text-[#B9823F]" : "text-[#D8D2C7]"}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
