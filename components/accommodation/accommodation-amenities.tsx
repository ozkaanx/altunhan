import { getAmenityMeta } from "@/lib/accommodation/amenity-meta";

import type { Accommodation } from "@/types/accommodation";

type AccommodationAmenitiesProps = {
  amenities: Accommodation["amenities"];
};

export function AccommodationAmenities({ amenities }: AccommodationAmenitiesProps) {
  const amenityItems = amenities ?? [];

  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="
            font-serif
            text-[12px]
            italic
            text-[#A8754F]
          "
        >
          02
        </span>

        <div className="h-px w-7 bg-[#A8754F]" />

        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.24em]
            text-[#A8754F]
          "
        >
          Olanaklar
        </p>
      </div>

      <h2
        className="
          mt-4
          font-serif
          text-[32px]
          leading-[1.08]
          text-[#263A2D]
          sm:text-[38px]
        "
      >
        Konaklama Özellikleri
      </h2>

      {amenityItems.length > 0 ? (
        <div
          className="
            mt-7
            grid
            gap-2.5
            sm:grid-cols-2
          "
        >
          {amenityItems.map((amenity) => {
            const amenityMeta = getAmenityMeta(amenity);

            const Icon = amenityMeta.icon;

            return (
              <div
                key={amenity}
                className="
                  group
                  flex
                  min-h-[58px]
                  items-center
                  gap-3.5
                  border
                  border-[#DDD8CC]
                  bg-[#FAF8F2]
                  px-3.5
                  py-2.5
                  transition-colors
                  hover:border-[#C9B08A]
                  hover:bg-[#F7F2E8]
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    bg-[#E9EDE6]
                    text-[#526048]
                    transition-colors
                    group-hover:bg-[#E2E8DE]
                  "
                >
                  <Icon size={16} strokeWidth={1.5} />
                </div>

                <span
                  className="
                    text-[11px]
                    font-medium
                    leading-5
                    text-[#4E554E]
                    sm:text-xs
                  "
                >
                  {amenityMeta.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="
            mt-7
            border
            border-[#DDD8CC]
            bg-[#FAF8F2]
            p-5
          "
        >
          <p className="text-sm text-[#777D75]">
            Bu konaklama için henüz özellik bilgisi eklenmemiş.
          </p>
        </div>
      )}
    </div>
  );
}
