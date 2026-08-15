import type { HomeAccommodation } from "@/types/home-accommodation";

const DEFAULT_DESCRIPTION = "Doğayla iç içe, sakin ve konforlu bir konaklama deneyimi.";

export function getHomeAccommodationCoverImage(accommodation: HomeAccommodation) {
  const images = accommodation.accommodation_images ?? [];

  if (images.length === 0) {
    return null;
  }

  const coverImage = images.find((image) => image.is_cover);

  if (coverImage?.image_url) {
    return coverImage.image_url;
  }

  let firstImage = images[0];

  for (const image of images.slice(1)) {
    if (Number(image.sort_order ?? 0) < Number(firstImage.sort_order ?? 0)) {
      firstImage = image;
    }
  }

  return firstImage.image_url ?? null;
}

export function getHomeAccommodationDescription(accommodation: HomeAccommodation) {
  const description = accommodation.short_description?.trim();

  return description && description.length >= 8 ? description : DEFAULT_DESCRIPTION;
}

export function getHomeAccommodationHref(accommodation: HomeAccommodation) {
  return accommodation.slug ? `/konaklama/${accommodation.slug}` : "/rezervasyon";
}

export function getHomeAccommodationGridClassName(accommodationCount: number) {
  if (accommodationCount === 1) {
    return "mx-auto max-w-[430px] grid-cols-1";
  }

  if (accommodationCount === 2) {
    return "mx-auto max-w-[900px] md:grid-cols-2";
  }

  if (accommodationCount === 3) {
    return "md:grid-cols-3";
  }

  return "md:grid-cols-2 xl:grid-cols-4";
}
