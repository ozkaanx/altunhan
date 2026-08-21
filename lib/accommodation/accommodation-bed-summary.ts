export type AccommodationBedConfiguration =
  | "one_double"
  | "double_single"
  | "two_double";

export function getAccommodationBedSummary(
  configurations: AccommodationBedConfiguration[],
  fallbackBedCount: number,
) {
  const values = new Set(configurations);

  if (values.size === 0) {
    return `${fallbackBedCount} adet`;
  }

  if (values.size === 1) {
    if (values.has("one_double")) {
      return "1 çift kişilik";
    }

    if (values.has("double_single")) {
      return "1 çift + 1 tek";
    }

    return "2 çift kişilik";
  }

  if (values.size === 2 && values.has("one_double") && values.has("two_double")) {
    return "1 veya 2 çift kişilik";
  }

  if (values.size === 2 && values.has("one_double") && values.has("double_single")) {
    return "1 çift veya çift + tek";
  }

  if (values.size === 2 && values.has("double_single") && values.has("two_double")) {
    return "Çift + tek veya 2 çift";
  }

  return "Birden fazla yatak düzeni";
}
