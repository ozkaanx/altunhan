"use client";

import { Check, Users } from "lucide-react";

import { AccommodationImageSlider } from "@/components/reservation/form/accommodation-image-slider";
import { SectionTitle } from "@/components/shared/sectionTitle";

import { formatPrice } from "@/lib/formatters/price";
import {
  getSeptemberPromotionalNightlyPrice,
  isSeptemberPromotionVisible,
} from "@/lib/reservation/september-promotion";
import { cn } from "@/lib/utils";

import type { PublicAccommodation } from "@/types/public-reservation";

type AccommodationStepProps = {
  accommodations: PublicAccommodation[];
  accommodationId: number | null;
  onChange: (accommodation: PublicAccommodation) => void;
};

export function AccommodationStep({
  accommodations,
  accommodationId,
  onChange,
}: AccommodationStepProps) {
  const showPromotion = isSeptemberPromotionVisible();

  return (
    <section className="border border-farm-line bg-farm-paper p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionTitle number="01" title="Konaklamanızı Seçin" />

          <p className="mt-3 max-w-[560px] text-[11px] leading-5 text-[#81867F]">
            Size uygun konaklama tipini seçin. Görselleri inceleyebilir, ardından tarih ve misafir
            bilgilerinizi belirleyebilirsiniz.
          </p>
        </div>

        <p className="text-[9px] uppercase tracking-[0.14em] text-[#9A9D96]">
          {accommodations.length} seçenek
        </p>
      </div>

      {accommodations.length === 0 ? (
        <div className="mt-6 border border-[#E7D8C0] bg-[#FAF5EA] p-4 text-xs leading-5 text-[#88662F]">
          Şu anda rezervasyona açık konaklama bulunmuyor.
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {accommodations.map((accommodation) => {
            const selected = accommodation.id === accommodationId;

            return (
              <article
                key={accommodation.id}
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                onClick={() => onChange(accommodation)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) {
                    return;
                  }

                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onChange(accommodation);
                  }
                }}
                className={cn(
                  "group relative cursor-pointer overflow-hidden border text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-farm-forest/40",
                  selected
                    ? "border-farm-forest bg-[#F2F3ED] shadow-[0_10px_30px_rgba(38,58,45,0.07)]"
                    : "border-farm-line bg-white hover:border-[#B8B2A8]",
                )}
              >
                <div className="relative">
                  <AccommodationImageSlider
                    images={accommodation.accommodation_images}
                    title={accommodation.title}
                  />

                  {selected && (
                    <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 bg-farm-forest px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white">
                      <Check size={11} strokeWidth={2} />
                      Seçildi
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-farm-clay">
                        Altunhan Farm
                      </p>

                      <h3 className="mt-1.5 font-serif text-xl leading-tight text-farm-forest">
                        {accommodation.title}
                      </h3>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[8px] uppercase tracking-[0.12em] text-[#999D95]">
                        {showPromotion ? "Eylül Geceliği" : "Gecelik"}
                      </p>

                      {showPromotion ? (
                        <>
                          <p className="mt-1 whitespace-nowrap text-[9px] text-[#999D95] line-through">
                            {formatPrice(accommodation.price)}
                          </p>
                          <p className="mt-0.5 whitespace-nowrap text-sm font-semibold text-farm-forest">
                            {formatPrice(getSeptemberPromotionalNightlyPrice(accommodation.price))}
                          </p>
                          <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#A8754F]">
                            %20 İndirim
                          </p>
                        </>
                      ) : (
                        <p className="mt-1 whitespace-nowrap text-sm font-semibold text-farm-forest">
                          {formatPrice(accommodation.price)}
                        </p>
                      )}
                    </div>
                  </div>

                  {accommodation.short_description && (
                    <p className="mt-3 line-clamp-2 min-h-[40px] text-[10px] leading-5 text-[#7B8079]">
                      {accommodation.short_description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-[#ECE8E0] pt-3">
                    <span className="flex items-center gap-1.5 text-[9px] text-[#727870]">
                      <Users size={13} strokeWidth={1.5} />
                      Maks. {accommodation.capacity} kişi
                    </span>

                    <span
                      className={cn(
                        "text-[9px] font-semibold uppercase tracking-[0.12em]",
                        selected ? "text-farm-forest" : "text-[#949890]",
                      )}
                    >
                      {selected ? "Seçiminiz" : "Seç"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
