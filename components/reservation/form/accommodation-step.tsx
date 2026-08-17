"use client";

import Image from "next/image";

import { Check, Users } from "lucide-react";

import { SectionTitle } from "@/components/shared/sectionTitle";

import { formatPrice } from "@/lib/formatters/price";
import { cn } from "@/lib/utils";

import type { PublicAccommodation, PublicAccommodationImage } from "@/types/public-reservation";

type AccommodationStepProps = {
  accommodations: PublicAccommodation[];
  accommodationId: number | null;
  onChange: (accommodation: PublicAccommodation) => void;
};

function getCoverImage(images: PublicAccommodationImage[] | undefined) {
  if (!images?.length) {
    return null;
  }

  const cover = images.find((image) => image.is_cover);

  if (cover) {
    return cover.image_url;
  }

  return [...images].sort((a, b) => Number(a.sort_order) - Number(b.sort_order))[0]?.image_url;
}

export function AccommodationStep({
  accommodations,
  accommodationId,
  onChange,
}: AccommodationStepProps) {
  return (
    <section className="border border-farm-line bg-farm-paper p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionTitle number="01" title="Konaklamanızı Seçin" />

          <p className="mt-3 max-w-[560px] text-[11px] leading-5 text-[#81867F]">
            Size uygun konaklama tipini seçin. Tarih ve misafir bilgilerinizi bir sonraki bölümde
            belirleyebilirsiniz.
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

            const image = getCoverImage(accommodation.accommodation_images);

            return (
              <button
                type="button"
                key={accommodation.id}
                aria-pressed={selected}
                onClick={() => onChange(accommodation)}
                className={cn(
                  "group relative overflow-hidden border text-left transition-all duration-300",
                  selected
                    ? "border-farm-forest bg-[#F2F3ED] shadow-[0_10px_30px_rgba(38,58,45,0.07)]"
                    : "border-farm-line bg-white hover:border-[#B8B2A8]",
                )}
              >
                <div className="relative aspect-[16/7] overflow-hidden bg-[#E8E2D7]">
                  {image ? (
                    <Image
                      src={image}
                      alt={accommodation.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#AAA69B]">
                      Altunhan Farm
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                  {selected && (
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-farm-forest px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white">
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
                        Gecelik
                      </p>

                      <p className="mt-1 whitespace-nowrap text-sm font-semibold text-farm-forest">
                        {formatPrice(accommodation.price)}
                      </p>
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
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
