"use client";

import { SectionTitle } from "@/components/shared/sectionTitle";

import { formatPrice } from "@/lib/formatters/price";

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
  return (
    <section className="border border-[#E3E0D8] bg-white p-4 sm:p-6">
      <SectionTitle number="01" title="Konaklamanızı Seçin" />

      {accommodations.length === 0 ? (
        <div className="mt-5 border border-[#E7D8C0] bg-[#FAF5EA] p-4 text-xs leading-5 text-[#88662F]">
          Şu anda rezervasyona açık konaklama bulunmuyor.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {accommodations.map((accommodation) => {
            const selected = accommodation.id === accommodationId;

            return (
              <button
                type="button"
                key={accommodation.id}
                aria-pressed={selected}
                onClick={() => onChange(accommodation)}
                className={`border p-4 text-left transition ${
                  selected
                    ? "border-[#263A2D] bg-[#F0F2EC]"
                    : "border-[#E1DED7] bg-white hover:border-[#B9B5AD]"
                }`}
              >
                <p className="text-sm font-semibold text-[#263A2D]">{accommodation.title}</p>

                {accommodation.short_description && (
                  <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#81857F]">
                    {accommodation.short_description}
                  </p>
                )}

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-[#969990]">Gecelik</p>

                    <p className="mt-1 text-base font-semibold text-[#263A2D]">
                      {formatPrice(Number(accommodation.price))}
                    </p>
                  </div>

                  <p className="shrink-0 text-right text-[10px] text-[#858A83]">
                    Maks. {accommodation.capacity} kişi
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
