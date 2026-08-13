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
    useRef<HTMLDivElement>(null);

  const scrollSlider = (
    direction: "prev" | "next",
  ) => {
    if (!sliderRef.current) {
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

    const gap = 12;

    sliderRef.current.scrollBy({
      left:
        direction === "next"
          ? cardWidth + gap
          : -(cardWidth + gap),
      behavior: "smooth",
    });
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
      className="w-full border-y border-[#DDD8CC] bg-[#F5F1E8]"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-6 sm:py-16 md:px-12 lg:px-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[250px_320px_minmax(0,1fr)] lg:items-stretch lg:gap-8 xl:grid-cols-[270px_360px_minmax(0,1fr)] xl:gap-10">
          {/* KONUM BİLGİSİ */}
          <div className="flex min-w-0 flex-col justify-center">
            <span className="block text-[8px] font-semibold uppercase tracking-[0.3em] text-[#A8754F] sm:text-[9px]">
              {content?.location_label ||
                "KONUM"}
            </span>

            <h2 className="mt-3 max-w-[290px] font-serif text-[30px] leading-[1.08] text-[#263A2D] sm:text-3xl lg:text-[32px]">
              {content?.location_title ||
                "Saros'un kıyısında, doğanın içinde."}
            </h2>

            <div className="mt-7">
              <div className="flex items-start gap-3">
                <FiMapPin
                  size={17}
                  strokeWidth={1.3}
                  className="mt-0.5 shrink-0 text-[#A8754F]"
                />

                <p className="max-w-[220px] text-[11px] font-semibold leading-5 text-[#263A2D] sm:text-xs">
                  {address}
                </p>
              </div>

              <Link
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#263A2D]"
              >
                Nasıl Gidilir?

                <FiArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* HARİTA */}
          <div className="relative min-h-[260px] overflow-hidden border border-[#DDD8CC] bg-[#E8E4DB] sm:min-h-[320px] lg:min-h-0">
            <iframe
              src={mapsEmbedUrl}
              title="Altunhan Farm konumu"
              className="absolute inset-0 h-full w-full border-0 grayscale-[20%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* YORUMLAR */}
          <div className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="block text-[8px] font-semibold uppercase tracking-[0.3em] text-[#A8754F] sm:text-[9px]">
                {content?.reviews_label ||
                  "MİSAFİRLERİMİZ NE DİYOR?"}
              </span>

              {reviews.length > 1 && (
                <div className="hidden items-center gap-2 lg:flex">
                  <button
                    type="button"
                    aria-label="Önceki yorum"
                    onClick={() =>
                      scrollSlider("prev")
                    }
                    className="flex h-9 w-9 items-center justify-center border border-[#CCC5B8] text-[#263A2D] transition-colors hover:bg-[#263A2D] hover:text-white"
                  >
                    <FiChevronLeft
                      size={17}
                    />
                  </button>

                  <button
                    type="button"
                    aria-label="Sonraki yorum"
                    onClick={() =>
                      scrollSlider("next")
                    }
                    className="flex h-9 w-9 items-center justify-center border border-[#CCC5B8] text-[#263A2D] transition-colors hover:bg-[#263A2D] hover:text-white"
                  >
                    <FiChevronRight
                      size={17}
                    />
                  </button>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="flex min-h-[260px] items-center justify-center border border-[#DDD8CC] bg-[#F8F4EB] p-8 text-center">
                <p className="text-xs leading-6 text-[#747972]">
                  Henüz yayınlanmış
                  misafir yorumu
                  bulunmuyor.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* DESKTOP SOL OK */}
                {reviews.length > 1 && (
                  <button
                    type="button"
                    aria-label="Önceki yorum"
                    onClick={() =>
                      scrollSlider("prev")
                    }
                    className="absolute -left-5 top-1/2 z-10 hidden h-10 w-10 -translate-x-full -translate-y-1/2 items-center justify-center text-[#526048] transition-transform hover:-translate-x-[105%] xl:flex"
                  >
                    <FiChevronLeft
                      size={25}
                      strokeWidth={1.2}
                    />
                  </button>
                )}

                <div
                  ref={sliderRef}
                  className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {reviews.map(
                    (review) => (
                      <article
                        key={review.id}
                        className="w-[85%] shrink-0 snap-start border border-[#DDD8CC] bg-[#FAF7F0] p-5 sm:w-[55%] md:w-[42%] lg:w-[calc((100%-12px)/2)] xl:w-[calc((100%-24px)/3)]"
                      >
                        <div className="flex min-h-[225px] flex-col justify-between">
                          <p className="font-serif text-[15px] leading-[1.55] text-[#343C35]">
                            “
                            {
                              review.review_text
                            }
                            ”
                          </p>

                          <div className="mt-7">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#263A2D]">
                              {
                                review.guest_name
                              }
                            </p>

                            <div className="mt-2 flex gap-1 text-[13px] text-[#B9823F]">
                              {Array.from({
                                length:
                                  review.rating,
                              }).map(
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

                {/* DESKTOP SAĞ OK */}
                {reviews.length > 1 && (
                  <button
                    type="button"
                    aria-label="Sonraki yorum"
                    onClick={() =>
                      scrollSlider("next")
                    }
                    className="absolute -right-5 top-1/2 z-10 hidden h-10 w-10 translate-x-full -translate-y-1/2 items-center justify-center text-[#526048] transition-transform hover:translate-x-[105%] xl:flex"
                  >
                    <FiChevronRight
                      size={25}
                      strokeWidth={1.2}
                    />
                  </button>
                )}
              </div>
            )}

            {/* MOBİL OKLAR */}
            {reviews.length > 1 && (
              <div className="mt-5 flex items-center justify-end gap-2 lg:hidden">
                <button
                  type="button"
                  aria-label="Önceki yorum"
                  onClick={() =>
                    scrollSlider("prev")
                  }
                  className="flex h-10 w-10 items-center justify-center border border-[#CCC5B8] text-[#263A2D]"
                >
                  <FiChevronLeft
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  aria-label="Sonraki yorum"
                  onClick={() =>
                    scrollSlider("next")
                  }
                  className="flex h-10 w-10 items-center justify-center border border-[#CCC5B8] text-[#263A2D]"
                >
                  <FiChevronRight
                    size={17}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}