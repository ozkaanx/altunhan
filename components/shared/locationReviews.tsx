"use client";

import Link from "next/link";
import { useRef } from "react";

import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
} from "react-icons/fi";

import type { HomepageContent } from "@/types/homepage-content";
import type { Review } from "@/types/review";
import type { SiteSettings } from "@/types/site-settings";

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
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "prev" | "next") => {
    if (!sliderRef.current) {
      return;
    }

    const firstCard = sliderRef.current.children[0] as HTMLElement;

    if (!firstCard) {
      return;
    }

    const gap = 16;

    sliderRef.current.scrollBy({
      left:
        direction === "next"
          ? firstCard.offsetWidth + gap
          : -(firstCard.offsetWidth + gap),

      behavior: "smooth",
    });
  };

  const address = settings?.address?.trim() || "Adilhan Köyü, Keşan / Edirne";

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;

  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    address,
  )}&output=embed`;

  return (
    <section
      id="iletisim"
      className="
        w-full
        border-y
        border-[#DDD8CC]
        bg-[#F5F1E8]
      "
    >
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
        {/* ====================== */}
        {/* ÜST BAŞLIKLAR */}
        {/* ====================== */}

        <div
          className="
            mb-8
            grid
            gap-10
            lg:grid-cols-[0.8fr_1.2fr]
            lg:gap-12
            xl:gap-16
          "
        >
          {/* KONUM BAŞLIK */}

          <div className="min-w-0">
            <span
              className="
                block
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#A8754F]
              "
            >
              {content?.location_label || "KONUM"}
            </span>

            <h2
              className="
                mt-4
                max-w-[460px]
                font-serif
               text-[30px]
sm:text-[34px]
md:text-[38px]
                leading-[1.05]
                text-[#263A2D]
              "
            >
              {content?.location_title || "Saros'un kıyısında, doğanın içinde."}
            </h2>

            <div
              className="
                mt-6
                flex
                items-start
                gap-3
              "
            >
              <FiMapPin
                size={18}
                strokeWidth={1.3}
                className="
                  mt-0.5
                  shrink-0
                  text-[#A8754F]
                "
              />

              <p
                className="
                  max-w-[320px]
                  text-xs
                  font-medium
                  leading-6
                  text-[#60655E]
                "
              >
                {address}
              </p>
            </div>

            <Link
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                mt-5
                inline-flex
                items-center
                gap-3
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-[#263A2D]
              "
            >
              Nasıl Gidilir?
              <FiArrowRight
                size={12}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>

          {/* YORUM BAŞLIK */}

          <div
            className="
              flex
              min-w-0
              flex-col
              justify-end
            "
          >
            <div
              className="
                flex
                items-end
                justify-between
                gap-5
              "
            >
              <div>
                <span
                  className="
                    block
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-[#A8754F]
                  "
                >
                  {content?.reviews_label || "MİSAFİRLERİMİZ NE DİYOR?"}
                </span>

                <h2
                  className="
                    mt-4
                    max-w-[620px]
                    font-serif
                    text-[20px]
                    leading-[1.08]
                    text-[#263A2D]
                    sm:text-4xl
                    md:text-[32px]
                  "
                >
                  {content?.reviews_title || "Güzel anılar, güzel sözler."}
                </h2>
              </div>

              {reviews.length > 1 && (
                <div
                  className="
                    hidden
                    shrink-0
                    items-center
                    gap-2
                    sm:flex
                  "
                >
                  <SliderButton
                    label="Önceki yorum"
                    onClick={() => scrollSlider("prev")}
                  >
                    <FiChevronLeft size={18} />
                  </SliderButton>

                  <SliderButton
                    label="Sonraki yorum"
                    onClick={() => scrollSlider("next")}
                  >
                    <FiChevronRight size={18} />
                  </SliderButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====================== */}
        {/* HARİTA + YORUMLAR */}
        {/* ====================== */}

        <div
          className="
            grid
            gap-8
            lg:grid-cols-[0.8fr_1.2fr]
            lg:items-stretch
            lg:gap-12
            xl:gap-16
          "
        >
          {/* HARİTA */}

          <div
            className="
              relative
            min-h-[260px]
sm:min-h-[300px]
lg:min-h-[340px]
              overflow-hidden
              border
              border-[#DDD8CC]
              bg-[#E8E4DB]
            "
          >
            <iframe
              src={mapsEmbedUrl}
              title="Altunhan Farm konumu"
              className="
                absolute
                inset-0
                h-full
                w-full
                border-0
                grayscale-[15%]
              "
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                border
                border-black/[0.03]
              "
            />
          </div>

          {/* YORUMLAR */}

          <div
            className="
              flex
              min-w-0
              flex-col
            "
          >
            {reviews.length === 0 ? (
              <div
                className="
                  flex
                  min-h-[320px]
                  flex-1
                  items-center
                  justify-center
                  border
                  border-[#DDD8CC]
                  bg-[#FAF8F2]
                  p-8
                  text-center
                  lg:min-h-[440px]
                "
              >
                <p
                  className="
                    max-w-[300px]
                    text-xs
                    leading-6
                    text-[#747972]
                  "
                >
                  Henüz yayınlanmış misafir yorumu bulunmuyor.
                </p>
              </div>
            ) : (
              <>
                <div
                  ref={sliderRef}
                  className="
                    flex
                    flex-1
                    snap-x
                    snap-mandatory
                    gap-4
                    overflow-x-auto
                    scroll-smooth
                    overscroll-x-contain
                    pb-1
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {reviews.map((review) => (
                    <article
                      key={review.id}
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
                      {/* Büyük tırnak */}

                      <div
                        className="
                            font-serif
                            text-5xl
                            leading-none
                            text-[#C8B49C]
                          "
                        aria-hidden="true"
                      >
                        “
                      </div>

                      {/* Yorum */}

                      <p
                        className="
                            mt-5
                            flex-1
                            font-serif
                            text-[17px]
                            leading-[1.65]
                            text-[#343C35]
                            sm:text-lg
                          "
                      >
                        {review.review_text}
                      </p>

                      {/* Kullanıcı */}

                      <div
                        className="
                            mt-8
                            border-t
                            border-[#DDD8CC]
                            pt-5
                          "
                      >
                        <div
                          className="
                              flex
                              items-center
                              justify-between
                              gap-4
                            "
                        >
                          <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.16em]
                                text-[#263A2D]
                              "
                          >
                            {review.guest_name}
                          </p>

                          <div
                            className="
                                flex
                                gap-1
                                text-[13px]
                              "
                            aria-label={`${review.rating} yıldız`}
                          >
                            {Array.from({
                              length: 5,
                            }).map((_, index) => (
                              <span
                                key={index}
                                className={
                                  index < Number(review.rating)
                                    ? "text-[#B9823F]"
                                    : "text-[#D8D2C7]"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* MOBİL KONTROLLER */}

                {reviews.length > 1 && (
                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      sm:hidden
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        uppercase
                        tracking-[0.15em]
                        text-[#92968F]
                      "
                    >
                      Kaydırarak diğer yorumları gör
                    </p>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <SliderButton
                        label="Önceki yorum"
                        onClick={() => scrollSlider("prev")}
                      >
                        <FiChevronLeft size={18} />
                      </SliderButton>

                      <SliderButton
                        label="Sonraki yorum"
                        onClick={() => scrollSlider("next")}
                      >
                        <FiChevronRight size={18} />
                      </SliderButton>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        border
        border-[#C9C3B7]
        text-[#263A2D]
        transition-colors
        duration-300
        hover:border-[#263A2D]
        hover:bg-[#263A2D]
        hover:text-white
      "
    >
      {children}
    </button>
  );
}
