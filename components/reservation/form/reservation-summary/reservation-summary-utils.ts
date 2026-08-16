import type { PublicAccommodation, PublicAccommodationImage } from "@/types/public-reservation";

type GuestCountValidation = {
  accommodation: PublicAccommodation | undefined;
  adultCount: number;
  childCount: number;
};

type SubmitLabelOptions = {
  isSubmitting: boolean;
  isLoadingAvailability: boolean;
  dateError: string | null;
  hasInvalidGuests: boolean;
  checkIn: string;
  checkOut: string;
  isContactComplete: boolean;
};

export function getCoverImage(images: PublicAccommodationImage[] | undefined) {
  if (!images?.length) {
    return null;
  }

  const cover = images.find((image) => image.is_cover);

  return (
    cover?.image_url ??
    [...images].sort((a, b) => Number(a.sort_order) - Number(b.sort_order))[0]?.image_url ??
    null
  );
}

export function hasInvalidGuestCount({
  accommodation,
  adultCount,
  childCount,
}: GuestCountValidation) {
  if (!accommodation) {
    return false;
  }

  const totalGuests = adultCount + childCount;

  return (
    adultCount < 1 ||
    adultCount > accommodation.max_adults ||
    childCount < 0 ||
    childCount > accommodation.max_children ||
    totalGuests > accommodation.max_total_guests
  );
}

export function getReservationSubmitLabel({
  isSubmitting,
  isLoadingAvailability,
  dateError,
  hasInvalidGuests,
  checkIn,
  checkOut,
  isContactComplete,
}: SubmitLabelOptions) {
  if (isSubmitting) {
    return "Rezervasyon Oluşturuluyor...";
  }

  if (isLoadingAvailability) {
    return "Müsaitlik Kontrol Ediliyor...";
  }

  if (dateError) {
    return "Farklı Tarih Seçin";
  }

  if (hasInvalidGuests) {
    return "Misafir Sayısını Kontrol Edin";
  }

  if (!checkIn || !checkOut) {
    return "Tarihlerinizi Seçin";
  }

  if (!isContactComplete) {
    return "Bilgilerinizi Tamamlayın";
  }

  return "Rezervasyon Talebi Oluştur";
}
