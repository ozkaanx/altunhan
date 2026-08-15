import { Check, type LucideIcon } from "lucide-react";

import { amenityOptions } from "@/lib/accommodation/amenities";

type AmenityMeta = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export function getAmenityMeta(amenity: string): AmenityMeta {
  const option = amenityOptions.find((item) => item.value === amenity);

  if (option) {
    return option;
  }

  return {
    value: amenity,
    label: amenity
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("tr-TR")),
    icon: Check,
  };
}
