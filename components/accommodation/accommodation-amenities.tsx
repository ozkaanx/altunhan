"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getAmenityMeta } from "@/lib/accommodation/amenity-meta";
import { getAmenityConfig } from "@/lib/accommodation/amenities";

import type { Accommodation } from "@/types/accommodation";

type AccommodationAmenitiesProps = {
  amenities: Accommodation["amenities"];
};

export function AccommodationAmenities({ amenities }: AccommodationAmenitiesProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const accommodationAmenities = (amenities ?? []).filter(
    (amenity) => getAmenityConfig(amenity)?.group !== "room",
  );

  const scrollSlider = (direction: "left" | "right") => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollBy({
      left: direction === "left" ? -slider.clientWidth * 0.8 : slider.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-serif text-[12px] italic text-[#A8754F]">02</span>

            <div className="h-px w-7 bg-[#A8754F]" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A8754F]">
              Olanaklar
            </p>
          </div>

          <h2 className="mt-4 font-serif text-[32px] leading-[1.08] text-[#263A2D] sm:text-[38px]">
            Konaklama Özellikleri
          </h2>
        </div>

        {accommodationAmenities.length > 1 && (
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              aria-label="Önceki konaklama özelliği"
              className="flex h-10 w-10 items-center justify-center border border-[#D9D4CA] bg-white text-[#526048] transition-colors hover:border-[#A8754F] hover:text-[#A8754F]"
            >
              <ChevronLeft size={17} strokeWidth={1.6} />
            </button>

            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="Sonraki konaklama özelliği"
              className="flex h-10 w-10 items-center justify-center border border-[#D9D4CA] bg-white text-[#526048] transition-colors hover:border-[#A8754F] hover:text-[#A8754F]"
            >
              <ChevronRight size={17} strokeWidth={1.6} />
            </button>
          </div>
        )}
      </div>

      {accommodationAmenities.length > 0 ? (
        <div
          ref={sliderRef}
          className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {accommodationAmenities.map((amenity) => {
            const amenityMeta = getAmenityMeta(amenity);
            const Icon = amenityMeta.icon;

            return (
              <div
                key={amenity}
                className="group flex min-h-[76px] min-w-[88%] snap-start items-center gap-3.5 border border-[#DDD8CC] bg-[#FAF8F2] px-4 py-3 transition-colors hover:border-[#C9B08A] hover:bg-[#F7F2E8] sm:min-w-[48%] lg:min-w-[calc((100%-36px)/4)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E9EDE6] text-[#526048] transition-colors group-hover:bg-[#E2E8DE]">
                  <Icon size={17} strokeWidth={1.5} />
                </div>

                <span className="text-xs font-medium leading-5 text-[#4E554E]">
                  {amenityMeta.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-7 border border-[#DDD8CC] bg-[#FAF8F2] p-5">
          <p className="text-sm text-[#777D75]">
            Bu konaklama için henüz özellik bilgisi eklenmemiş.
          </p>
        </div>
      )}
    </div>
  );
}
