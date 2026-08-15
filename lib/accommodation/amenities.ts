import {
  Baby,
  Bath,
  Car,
  ShieldCheck,
  Trees,
  Umbrella,
  Utensils,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";

export const amenityOptions = [
  {
    label: "Wi-Fi",
    value: "wifi",
    icon: Wifi,
  },
  {
    label: "Klima",
    value: "air_conditioning",
    icon: Wind,
  },
  {
    label: "Özel Banyo",
    value: "private_bathroom",
    icon: Bath,
  },
  {
    label: "Deniz Manzarası",
    value: "sea_view",
    icon: Waves,
  },
  {
    label: "Kahvaltı",
    value: "breakfast",
    icon: Utensils,
  },
  {
    label: "Kendine Ait Beach",
    value: "private_beach",
    icon: Waves,
  },
  {
    label: "Beyaz Şezlong ve Şemsiye",
    value: "white_sunbed_and_umbrella",
    icon: Umbrella,
  },
  {
    label: "Açık Otopark",
    value: "open_parking",
    icon: Car,
  },
  {
    label: "Geniş Bahçe",
    value: "large_garden",
    icon: Trees,
  },
  {
    label: "Çocuk Oyun Parkı",
    value: "children_playground",
    icon: Baby,
  },
  {
    label: "Sürekli İlaçlanan Alan",
    value: "regularly_treated_area",
    icon: ShieldCheck,
  },
  {
    label: "Denize Sıfır Restoran",
    value: "seafront_restaurant",
    icon: Utensils,
  },
] as const;

export function getAmenityConfig(value: string) {
  return amenityOptions.find((amenity) => amenity.value === value);
}

export function getAmenityLabel(value: string) {
  return (
    getAmenityConfig(value)?.label ??
    value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("tr-TR"))
  );
}
