"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { AccommodationImage } from "@/types/accommodation";

type AccommodationGalleryProps = {
  title: string;
  images: AccommodationImage[];
};

export default function AccommodationGallery({
  title,
  images,
}: AccommodationGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasImages = images.length > 0;

  function openGallery(index: number) {
    setActiveIndex(index);
  }

  function closeGallery() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === 0 ? images.length - 1 : current - 1;
    });
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === images.length - 1 ? 0 : current + 1;
    });
  }

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
  }, [activeIndex]);

  if (!hasImages) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#E8E2D7] text-sm text-[#8E8A81]">
        Henüz fotoğraf eklenmemiş.
      </div>
    );
  }

  const coverImage = images[0];

  const previewImages = images.slice(1, 4);

  const remainingImageCount = Math.max(images.length - 4, 0);

  /*
   * Sadece 1 fotoğraf varsa sağ tarafı boş bırakmıyoruz.
   */
  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="
            relative
            block
            aspect-[16/9]
            w-full
            overflow-hidden
            bg-[#E8E2D7]
            text-left
            lg:h-[620px]
            lg:aspect-auto
          "
        >
          <Image
            src={coverImage.image_url}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="
              object-cover
              transition-transform
              duration-500
              hover:scale-[1.02]
            "
          />
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
      {/* ============================= */}
      {/* ANA GALERİ */}
      {/* ============================= */}

      <div
        className="
          grid
          gap-2
          sm:gap-3

          lg:h-[620px]
          lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]
        "
      >
        {/* Ana fotoğraf */}
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="
            relative
            aspect-[16/10]
            overflow-hidden
            bg-[#E8E2D7]
            text-left

            lg:h-full
            lg:aspect-auto
          "
        >
          <Image
            src={coverImage.image_url}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="
              object-cover
              transition-transform
              duration-500
              hover:scale-[1.02]
            "
          />
        </button>

        {/* Küçük fotoğraflar */}
        <div
          className={`
            grid
            gap-2
            sm:gap-3

            ${
              previewImages.length === 1
                ? "grid-cols-1"
                : previewImages.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }

            lg:grid-cols-1

            ${
              previewImages.length === 1
                ? "lg:grid-rows-1"
                : previewImages.length === 2
                  ? "lg:grid-rows-2"
                  : "lg:grid-rows-3"
            }
          `}
        >
          {previewImages.map((image, index) => {
            const actualIndex = index + 1;

            const isLastPreview =
              index === previewImages.length - 1;

            const showRemainingOverlay =
              isLastPreview && remainingImageCount > 0;

            return (
              <button
                type="button"
                key={image.id}
                onClick={() => openGallery(actualIndex)}
                className="
                  group
                  relative
                  aspect-square
                  min-h-0
                  overflow-hidden
                  bg-[#E8E2D7]

                  lg:h-full
                  lg:aspect-auto
                "
              >
                <Image
                  src={image.image_url}
                  alt={`${title} - ${actualIndex + 1}`}
                  fill
                  sizes="(max-width: 1024px) 33vw, 25vw"
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />

                {showRemainingOverlay && (
                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-black/50
                      transition-colors
                      duration-300
                      group-hover:bg-black/60
                    "
                  >
                    <div className="flex flex-col items-center text-white">
                      <Images
                        size={20}
                        strokeWidth={1.5}
                      />

                      <span
                        className="
                          mt-2
                          text-xs
                          font-semibold
                          tracking-[0.08em]
                        "
                      >
                        +{remainingImageCount} Fotoğraf
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================= */}
      {/* FULLSCREEN GALERİ */}
      {/* ============================= */}

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
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/95
        px-4
        py-6
      "
      role="dialog"
      aria-modal="true"
      aria-label={`${title} fotoğraf galerisi`}
    >
      {/* Kapat */}
      <button
        type="button"
        aria-label="Galeriyi kapat"
        onClick={closeGallery}
        className="
          absolute
          right-4
          top-4
          z-20
          flex
          h-11
          w-11
          items-center
          justify-center
          border
          border-white/20
          bg-black/30
          text-white
          transition-colors
          hover:bg-white
          hover:text-black
          md:right-6
          md:top-6
        "
      >
        <X size={20} />
      </button>

      {/* Önceki */}
      {images.length > 1 && (
        <button
          type="button"
          aria-label="Önceki fotoğraf"
          onClick={showPrevious}
          className="
            absolute
            left-3
            top-1/2
            z-20
            flex
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            border
            border-white/20
            bg-black/30
            text-white
            transition-colors
            hover:bg-white
            hover:text-black
            md:left-8
            md:h-12
            md:w-12
          "
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Sonraki */}
      {images.length > 1 && (
        <button
          type="button"
          aria-label="Sonraki fotoğraf"
          onClick={showNext}
          className="
            absolute
            right-3
            top-1/2
            z-20
            flex
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            border
            border-white/20
            bg-black/30
            text-white
            transition-colors
            hover:bg-white
            hover:text-black
            md:right-8
            md:h-12
            md:w-12
          "
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Aktif fotoğraf */}
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

      {/* Sayaç */}
      <div
        className="
          absolute
          bottom-5
          left-1/2
          -translate-x-1/2
          text-xs
          tracking-[0.15em]
          text-white/70
        "
      >
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}