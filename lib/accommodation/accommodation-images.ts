import type { Accommodation } from "@/types/accommodation";

type AccommodationImage = NonNullable<Accommodation["accommodation_images"]>[number];

export function sortAccommodationImages(
  images: Accommodation["accommodation_images"],
): AccommodationImage[] {
  return [...(images ?? [])].sort((a, b) => {
    if (a.is_cover && !b.is_cover) {
      return -1;
    }

    if (!a.is_cover && b.is_cover) {
      return 1;
    }

    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });
}
