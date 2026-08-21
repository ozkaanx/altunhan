import { getAmenityMeta } from "@/lib/accommodation/amenity-meta";
import { getAmenityConfig } from "@/lib/accommodation/amenities";

import type { Accommodation } from "@/types/accommodation";

type AccommodationRoomAmenitiesProps = {
  amenities: Accommodation["amenities"];
};

export function AccommodationRoomAmenities({ amenities }: AccommodationRoomAmenitiesProps) {
  const roomAmenities = (amenities ?? []).filter(
    (amenity) => getAmenityConfig(amenity)?.group === "room",
  );

  if (roomAmenities.length === 0) {
    return null;
  }

  return (
    <div className="mt-7">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-[22px] leading-tight text-[#263A2D] sm:text-[25px]">
          Oda İçi İmkanlar
        </h2>

        <div className="h-px flex-1 bg-[#D9D4CA]" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-1 sm:grid-cols-3">
        {roomAmenities.map((amenity) => {
          const amenityMeta = getAmenityMeta(amenity);
          const Icon = amenityMeta.icon;

          return (
            <div
              key={amenity}
              className="flex min-h-11 items-center gap-2.5 border-b border-[#E2DED5] py-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#E9EDE6] text-[#526048]">
                <Icon size={14} strokeWidth={1.5} />
              </div>

              <span className="text-[11px] font-medium leading-4 text-[#4E554E] sm:text-xs">
                {amenityMeta.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
