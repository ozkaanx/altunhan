import {
  Baby,
  Bath,
  Car,
  Coffee,
  Droplets,
  Footprints,
  Refrigerator,
  ShieldCheck,
  Sparkles,
  Trees,
  Tv,
  Umbrella,
  Utensils,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

export type AmenityGroup = "accommodation" | "room";

type AmenityOption = {
  label: string;
  value: string;
  group: AmenityGroup;
  icon: LucideIcon;
};

export const amenityOptions = [
  {
    label: "Wi-Fi",
    value: "wifi",
    group: "accommodation",
    icon: Wifi,
  },
  {
    label: "Klima",
    value: "air_conditioning",
    group: "accommodation",
    icon: Wind,
  },
  {
    label: "Özel Banyo",
    value: "private_bathroom",
    group: "accommodation",
    icon: Bath,
  },
  {
    label: "Deniz Manzarası",
    value: "sea_view",
    group: "accommodation",
    icon: Waves,
  },
  {
    label: "Kahvaltı",
    value: "breakfast",
    group: "accommodation",
    icon: Utensils,
  },
  {
    label: "Kendine Ait Beach",
    value: "private_beach",
    group: "accommodation",
    icon: Waves,
  },
  {
    label: "Beyaz Şezlong ve Şemsiye",
    value: "white_sunbed_and_umbrella",
    group: "accommodation",
    icon: Umbrella,
  },
  {
    label: "Açık Otopark",
    value: "open_parking",
    group: "accommodation",
    icon: Car,
  },
  {
    label: "Geniş Bahçe",
    value: "large_garden",
    group: "accommodation",
    icon: Trees,
  },
  {
    label: "Çocuk Oyun Parkı",
    value: "children_playground",
    group: "accommodation",
    icon: Baby,
  },
  {
    label: "Sürekli İlaçlanan Alan",
    value: "regularly_treated_area",
    group: "accommodation",
    icon: ShieldCheck,
  },
  {
    label: "Denize Sıfır Restoran",
    value: "seafront_restaurant",
    group: "accommodation",
    icon: Utensils,
  },
  {
    label: "Mini Buzdolabı",
    value: "mini_fridge",
    group: "room",
    icon: Refrigerator,
  },
  {
    label: "Televizyon",
    value: "television",
    group: "room",
    icon: Tv,
  },
  {
    label: "Terlik",
    value: "slippers",
    group: "room",
    icon: Footprints,
  },
  {
    label: "Duş Jeli",
    value: "shower_gel",
    group: "room",
    icon: Droplets,
  },
  {
    label: "Şampuan",
    value: "shampoo",
    group: "room",
    icon: Droplets,
  },
  {
    label: "Bakım Kiti",
    value: "care_kit",
    group: "room",
    icon: Sparkles,
  },
  {
    label: "Kettle",
    value: "kettle",
    group: "room",
    icon: Coffee,
  },
  {
    label: "Çay / Şeker Seti",
    value: "tea_sugar_set",
    group: "room",
    icon: Coffee,
  },
  {
    label: "Saç Kurutma Makinesi",
    value: "hair_dryer",
    group: "room",
    icon: Wind,
  },
  {
    label: "Havlu Seti",
    value: "towel_set",
    group: "room",
    icon: Bath,
  },
] as const satisfies readonly AmenityOption[];

export const accommodationAmenityOptions = amenityOptions.filter(
  (amenity) => amenity.group === "accommodation",
);

export const roomAmenityOptions = amenityOptions.filter(
  (amenity) => amenity.group === "room",
);

export function getAmenityConfig(value: string) {
  return amenityOptions.find((amenity) => amenity.value === value);
}

export function getAmenityLabel(value: string) {
  return (
    getAmenityConfig(value)?.label ??
    value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("tr-TR"))
  );
}
