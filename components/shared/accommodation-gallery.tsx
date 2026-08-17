"use client";

import Image from "next/image";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import type { AccommodationImage } from "@/types/accommodation";

const galleryControlClass =
  "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/30 text-white transition-colors hover:bg-white hover:text-black md:h-12 md:w-12";

type AccommodationGalleryProps = {
  title: string;
  images: AccommodationImage[];
};

export default function AccommodationGallery({ title, images }: AccommodationGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasImages = images.length > 0;

  function openGallery(index: number) {
    setActiveIndex(index);
  }

  const closeGallery = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === 0 ? images.length - 1 : current - 1;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === images.length - 1 ? 0 : current + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeGallery, showNext, showPrevious]);

  if (!hasImages) {
    return (
      <div className="flex min-h-[380px] items-center justify-center border border-[#DDD8CC] bg-[#E8E2D7] text-sm text-[#8E8A81]">
        Henüz fotoğraf eklenmemiş.
      </div>
    );
  }

  const coverImage = images[0];

  const previewImages = images.slice(1, 4);

  const previewGridClass = {
    1: "grid-cols-1 lg:grid-rows-1",
    2: "grid-cols-2 lg:grid-rows-2",
    3: "grid-cols-3 lg:grid-rows-3",
  }[previewImages.length];

  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="group relative block aspect-[16/10] w-full overflow-hidden bg-[#E8E2D7] text-left lg:aspect-auto lg:h-[600px]"
        >
          <Image
            src={coverImage.image_url}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />

          <GalleryButton imageCount={images.length} />
        </button>

        {activeIndex !== null && (
          <GalleryModal
            title={title}
            images={images}
            activeIndex={activeIndex}
            closeGallery={closeGallery}
            showPrevious={showPrevious}
            showNext={showNext}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="grid gap-2 sm:gap-3 lg:h-[600px] lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]">
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="group relative aspect-[16/10] overflow-hidden bg-[#E8E2D7] text-left lg:aspect-auto lg:h-full"
        >
          <Image
            src={coverImage.image_url}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </button>

        <div className={cn("grid gap-2 sm:gap-3 lg:grid-cols-1", previewGridClass)}>
          {previewImages.map((image, index) => {
            const actualIndex = index + 1;

            const isLastPreview = index === previewImages.length - 1;

            return (
              <button
                type="button"
                key={image.id}
                onClick={() => openGallery(actualIndex)}
                className="group relative aspect-square min-h-0 overflow-hidden bg-[#E8E2D7] lg:aspect-auto lg:h-full"
              >
                <Image
                  src={image.image_url}
                  alt={`${title} - ${actualIndex + 1}`}
                  fill
                  sizes="(max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

                {isLastPreview && <GalleryButton imageCount={images.length} />}
              </button>
            );
          })}
        </div>
      </div>

      {activeIndex !== null && (
        <GalleryModal
          title={title}
          images={images}
          activeIndex={activeIndex}
          closeGallery={closeGallery}
          showPrevious={showPrevious}
          showNext={showNext}
        />
      )}
    </>
  );
}

function GalleryButton({ imageCount }: { imageCount: number }) {
  return (
    <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2.5 border border-white/40 bg-farm-paper/95 px-3 py-2.5 text-farm-forest shadow-sm backdrop-blur-sm sm:bottom-4 sm:right-4">
      <Images size={14} strokeWidth={1.5} />

      <div className="text-left">
        <p className="text-[8px] font-semibold uppercase tracking-[0.13em]">Tüm Fotoğraflar</p>

        <p className="mt-0.5 text-[9px] text-[#7B8179]">{imageCount} fotoğraf</p>
      </div>
    </div>
  );
}

type GalleryModalProps = {
  title: string;
  images: AccommodationImage[];
  activeIndex: number;
  closeGallery: () => void;
  showPrevious: () => void;
  showNext: () => void;
};

function GalleryModal({
  title,
  images,
  activeIndex,
  closeGallery,
  showPrevious,
  showNext,
}: GalleryModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} fotoğraf galerisi`}
    >
      <button
        type="button"
        aria-label="Galeriyi kapat"
        onClick={closeGallery}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border border-white/20 bg-black/30 text-white transition-colors hover:bg-white hover:text-black md:right-6 md:top-6"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <button
          type="button"
          aria-label="Önceki fotoğraf"
          onClick={showPrevious}
          className={cn(galleryControlClass, "left-3 md:left-8")}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {images.length > 1 && (
        <button
          type="button"
          aria-label="Sonraki fotoğraf"
          onClick={showNext}
          className={cn(galleryControlClass, "right-3 md:right-8")}
        >
          <ChevronRight size={24} />
        </button>
      )}

      <div className="relative h-[82vh] w-full max-w-[1400px]">
        <Image
          src={images[activeIndex].image_url}
          alt={`${title} - ${activeIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.15em] text-white/70">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}
