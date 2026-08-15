import { SectionHeader } from "@/components/admin/accommodation-form/form-elements";

import { amenityOptions } from "@/lib/accommodation/amenities";

type AccommodationAmenitiesSectionProps = {
  selectedAmenities: string[];
  onToggle: (amenity: string) => void;
};

export function AccommodationAmenitiesSection({
  selectedAmenities,
  onToggle,
}: AccommodationAmenitiesSectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <SectionHeader title="Özellikler" description="Konaklamada bulunan imkanları seçin." />

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5">
        {amenityOptions.map((amenity) => {
          const Icon = amenity.icon;

          const selected = selectedAmenities.includes(amenity.value);

          return (
            <button
              key={amenity.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(amenity.value)}
              className={`flex min-h-20 flex-col items-center justify-center gap-2 border px-3 py-3 text-center ${
                selected
                  ? "border-[#263A2D] bg-[#EEF0EA] text-[#263A2D]"
                  : "border-[#E1DED7] bg-white text-[#777C75]"
              }`}
            >
              <Icon size={20} strokeWidth={1.5} />

              <span className="text-[11px] font-medium">{amenity.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
