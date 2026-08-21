import { SectionHeader } from "@/components/admin/accommodation-form/form-elements";

import { accommodationAmenityOptions, roomAmenityOptions } from "@/lib/accommodation/amenities";

type AccommodationAmenitiesSectionProps = {
  selectedAmenities: string[];
  onToggle: (amenity: string) => void;
};

type AmenityOption =
  (typeof accommodationAmenityOptions)[number] | (typeof roomAmenityOptions)[number];

function AmenityButton({
  amenity,
  selected,
  onToggle,
}: {
  amenity: AmenityOption;
  selected: boolean;
  onToggle: (amenity: string) => void;
}) {
  const Icon = amenity.icon;

  return (
    <button
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
}

export function AccommodationAmenitiesSection({
  selectedAmenities,
  onToggle,
}: AccommodationAmenitiesSectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <SectionHeader
        title="Özellikler"
        description="Konaklama ve oda içi imkanları ayrı ayrı seçin."
      />

      <div className="space-y-7 p-4 sm:p-5">
        <div>
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-[#263A2D]">Konaklama Özellikleri</h3>
            <p className="mt-1 text-[10px] text-[#969990]">Tesis ve konaklamanın genel imkanları</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {accommodationAmenityOptions.map((amenity) => (
              <AmenityButton
                key={amenity.value}
                amenity={amenity}
                selected={selectedAmenities.includes(amenity.value)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-[#EEEAE3] pt-6">
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-[#263A2D]">Oda İçi İmkanlar</h3>
            <p className="mt-1 text-[10px] text-[#969990]">
              Misafirin odasında kullanabileceği ürün ve ekipmanlar
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {roomAmenityOptions.map((amenity) => (
              <AmenityButton
                key={amenity.value}
                amenity={amenity}
                selected={selectedAmenities.includes(amenity.value)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
