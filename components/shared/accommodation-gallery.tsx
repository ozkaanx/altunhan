"use client";

import Image from "next/image";

import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  AccommodationImage,
} from "@/types/accommodation";

type AccommodationGalleryProps = {
  title: string;
  images: AccommodationImage[];
};

export default function AccommodationGallery({
  title,
  images,
}: AccommodationGalleryProps) {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState<
    number | null
  >(null);

  const hasImages =
    images.length > 0;

  function openGallery(
    index: number,
  ) {
    setActiveIndex(
      index,
    );
  }

  function closeGallery() {
    setActiveIndex(
      null,
    );
  }

  function showPrevious() {
    setActiveIndex(
      (
        current,
      ) => {
        if (
          current ===
          null
        ) {
          return null;
        }

        return current ===
          0
          ? images.length -
              1
          : current -
              1;
      },
    );
  }

  function showNext() {
    setActiveIndex(
      (
        current,
      ) => {
        if (
          current ===
          null
        ) {
          return null;
        }

        return current ===
          images.length -
            1
          ? 0
          : current +
              1;
      },
    );
  }

  useEffect(() => {
    if (
      activeIndex ===
      null
    ) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        closeGallery();
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        showPrevious();
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        showNext();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    activeIndex,
  ]);

  if (
    !hasImages
  ) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#E8E2D7] text-sm text-[#8E8A81]">
        Henüz fotoğraf
        eklenmemiş.
      </div>
    );
  }

  const coverImage =
    images[0];

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-[1.5fr_0.5fr]">
        <button
          type="button"
          onClick={() =>
            openGallery(
              0,
            )
          }
          className="relative aspect-[16/10] overflow-hidden bg-[#E8E2D7] text-left lg:aspect-auto lg:min-h-[620px]"
        >
          <Image
            src={
              coverImage.image_url
            }
            alt={
              title
            }
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        </button>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {images
            .slice(
              1,
              3,
            )
            .map(
              (
                image,
                index,
              ) => (
                <button
                  type="button"
                  key={
                    image.id
                  }
                  onClick={() =>
                    openGallery(
                      index +
                        1,
                    )
                  }
                  className="relative aspect-square overflow-hidden bg-[#E8E2D7] lg:aspect-auto lg:min-h-[302px]"
                >
                  <Image
                    src={
                      image.image_url
                    }
                    alt={
                      title
                    }
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </button>
              ),
            )}
        </div>
      </div>

      {images.length >
        3 && (
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {images
            .slice(
              3,
            )
            .map(
              (
                image,
                index,
              ) => (
                <button
                  type="button"
                  key={
                    image.id
                  }
                  onClick={() =>
                    openGallery(
                      index +
                        3,
                    )
                  }
                  className="relative aspect-[4/3] overflow-hidden bg-[#E8E2D7]"
                >
                  <Image
                    src={
                      image.image_url
                    }
                    alt={
                      title
                    }
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </button>
              ),
            )}
        </div>
      )}

      {activeIndex !==
        null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-6"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Galeriyi kapat"
            onClick={
              closeGallery
            }
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center border border-white/20 bg-black/30 text-white transition-colors hover:bg-white hover:text-black"
          >
            <X
              size={20}
            />
          </button>

          {images.length >
            1 && (
            <>
              <button
                type="button"
                aria-label="Önceki fotoğraf"
                onClick={
                  showPrevious
                }
                className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/30 text-white transition-colors hover:bg-white hover:text-black md:left-8"
              >
                <ChevronLeft
                  size={
                    24
                  }
                />
              </button>

              <button
                type="button"
                aria-label="Sonraki fotoğraf"
                onClick={
                  showNext
                }
                className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/30 text-white transition-colors hover:bg-white hover:text-black md:right-8"
              >
                <ChevronRight
                  size={
                    24
                  }
                />
              </button>
            </>
          )}

          <div className="relative h-[80vh] w-full max-w-[1400px]">
            <Image
              src={
                images[
                  activeIndex
                ].image_url
              }
              alt={`${title} - ${
                activeIndex +
                1
              }`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.15em] text-white/70">
            {activeIndex +
              1}{" "}
            /{" "}
            {
              images.length
            }
          </div>
        </div>
      )}
    </>
  );
}