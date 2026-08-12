"use client";

import { useRef } from "react";
import Link from "next/link";

import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
} from "react-icons/fi";

import type { SiteSettings } from "@/types/site-settings";
import type { Review } from "@/types/review";
import type { HomepageContent } from "@/types/homepage-content";

type LocationReviewsProps = {
  settings: SiteSettings | null;
  reviews: Review[];
  content: HomepageContent | null;
};

export default function LocationReviews({
  settings,
  reviews,
  content,
}: LocationReviewsProps) {
  const sliderRef =
    useRef<HTMLDivElement>(
      null,
    );

  const scrollSlider = (
    direction:
      | "prev"
      | "next",
  ) => {
    if (
      !sliderRef.current
    ) {
      return;
    }

    const firstCard =
      sliderRef.current
        .children[0] as HTMLElement;

    if (!firstCard) {
      return;
    }

    const cardWidth =
      firstCard.offsetWidth;

    const gap = 16;

    sliderRef.current.scrollBy(
      {
        left:
          direction ===
          "next"
            ? cardWidth +
              gap
            : -(
                cardWidth +
                gap
              ),

        behavior:
          "smooth",
      },
    );
  };

  const address =
    settings?.address?.trim() ||
    "Adilhan Köyü, Keşan / Edirne";

  const mapsSearchUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;

  const mapsEmbedUrl =
    `https://www.google.com/maps?q=${encodeURIComponent(
      address,
    )}&output=embed`;

  return (
    <section
      id="iletisim"
      className="w-full bg-[#F5F1E8] px-6 py-20 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="min-w-0">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A8754F]">
              {content?.location_label ||
                "KONUM"}
            </span>

            <h2 className="mt-3 max-w-[430px] font-serif text-4xl leading-[1.05] text-[#263A2D] md:text-5xl">
              {content?.location_title ||
                "Saros'un kıyısında, doğanın içinde."}
            </h2>

            <div className="mt-7 flex items-start gap-3">
              <FiMapPin
                size={18}
                strokeWidth={
                  1.3
                }
                className="mt-0.5 shrink-0 text-[#A8754F]"
              />

              <div>
                <p className="max-w-[320px] text-xs font-semibold leading-5 tracking-wide text-[#263A2D]">
                  {address}
                </p>

                <Link
                  href={
                    mapsSearchUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-5 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#263A2D]"
                >
                  Nasıl Gidilir?

                  <FiArrowRight
                    size={
                      12
                    }
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden border border-[#DDD8CC]">
              <iframe
                src={
                  mapsEmbedUrl
                }
                title="Altunhan Farm konumu"
                className="absolute inset-0 h-full w-full border-0 grayscale-[30%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-end justify-between">
              <div>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A8754F]">
                  {content?.reviews_label ||
                    "MİSAFİRLERİMİZ NE DİYOR?"}
                </span>

                <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-[#263A2D] md:text-5xl">
                  {content?.reviews_title ||
                    "Güzel anılar, güzel sözler."}
                </h2>
              </div>

              {reviews.length >
                1 && (
                <div className="hidden gap-2 md:flex">
                  <button
                    type="button"
                    aria-label="Önceki yorum"
                    onClick={() =>
                      scrollSlider(
                        "prev",
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center border border-[#CFC8BA] text-[#263A2D] transition-all duration-300 hover:bg-[#263A2D] hover:text-white"
                  >
                    <FiChevronLeft
                      size={
                        18
                      }
                    />
                  </button>

                  <button
                    type="button"
                    aria-label="Sonraki yorum"
                    onClick={() =>
                      scrollSlider(
                        "next",
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center border border-[#CFC8BA] text-[#263A2D] transition-all duration-300 hover:bg-[#263A2D] hover:text-white"
                  >
                    <FiChevronRight
                      size={
                        18
                      }
                    />
                  </button>
                </div>
              )}
            </div>

            {reviews.length ===
            0 ? (
              <div className="mt-8 border border-[#DDD8CC] bg-[#F8F4EB] p-8 text-center">
                <p className="text-sm text-[#747972]">
                  Henüz yayınlanmış
                  misafir yorumu
                  bulunmuyor.
                </p>
              </div>
            ) : (
              <div
                ref={
                  sliderRef
                }
                className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {reviews.map(
                  (
                    review,
                  ) => (
                    <article
                      key={
                        review.id
                      }
                      className="w-full shrink-0 snap-start border border-[#DDD8CC] bg-[#F8F4EB] p-6 md:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)]"
                    >
                      <div className="flex min-h-[220px] flex-col justify-between">
                        <p className="font-serif text-[17px] leading-[1.45] text-[#3A423A]">
                          “
                          {
                            review.review_text
                          }
                          ”
                        </p>

                        <div className="mt-8">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#263A2D]">
                            {
                              review.guest_name
                            }
                          </p>

                          <div className="mt-2 flex gap-1 text-[#B9823F]">
                            {Array.from(
                              {
                                length:
                                  review.rating,
                              },
                            ).map(
                              (
                                _,
                                index,
                              ) => (
                                <span
                                  key={
                                    index
                                  }
                                >
                                  ★
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}

            {reviews.length >
              1 && (
              <div className="mt-5 flex gap-2 md:hidden">
                <button
                  type="button"
                  aria-label="Önceki yorum"
                  onClick={() =>
                    scrollSlider(
                      "prev",
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center border border-[#CFC8BA] text-[#263A2D]"
                >
                  <FiChevronLeft />
                </button>

                <button
                  type="button"
                  aria-label="Sonraki yorum"
                  onClick={() =>
                    scrollSlider(
                      "next",
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center border border-[#CFC8BA] text-[#263A2D]"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}