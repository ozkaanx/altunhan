"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import type { PublicAccommodationImage } from "@/types/public-reservation";

type AccommodationImageSliderProps = {
  images: PublicAccommodationImage[] | undefined;
  title: string;
};

function sortImages(images: PublicAccommodationImage[]) {
  return [...images].sort((a, b) => {
    if (a.is_cover !== b.is_cover) {
      return a.is_cover ? -1 : 1;
    }

    return Number(a.sort_order) - Number(b.sort_order);
  });
}

export function AccommodationImageSlider({
  images,
  title,
}: AccommodationImageSliderProps) {
  const sortedImages = useMemo(() => sortImages(images ?? []), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (sortedImages.length === 0) {
    return (
      <div className="flex aspect-[16/7] items-center justify-center bg-[#E8E2D7] text-xs text-[#AAA69B]">
        Altunhan Farm
      </div>
    );
  }

  const activeImage = sortedImages[Math.min(activeIndex, sortedImages.length - 1)];
  const hasMultipleImages = sortedImages.length > 1;

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? sortedImages.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === sortedImages.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div
      className="relative aspect-[16/7] overflow-hidden bg-[#E8E2D7]"
      onClick={(event) => event.stopPropagation()}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        const endX = event.changedTouches[0]?.clientX ?? null;

        touchStartX.current = null;

        if (!hasMultipleImages || startX === null || endX === null) {
          return;
        }

        const distance = startX - endX;

        if (Math.abs(distance) < 45) {
          return;
        }

        if (distance > 0) {
          showNext();
        } else {
          showPrevious();
        }
      }}
    >
      <Image
        key={activeImage.id}
        src={activeImage.image_url}
        alt={`${title} - ${activeIndex + 1}. görsel`}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      {hasMultipleImages && (
        <>
          <button
            type="button"
            aria-label="Önceki görsel"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronLeft size={17} />
          </button>

          <button
            type="button"
            aria-label="Sonraki görsel"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronRight size={17} />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`${index + 1}. görsele geç`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex(index);
                }}
                className={`h-1.5 transition-all ${
                  index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
