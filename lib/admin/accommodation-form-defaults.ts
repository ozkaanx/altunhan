import type { AccommodationFormValues } from "@/types/accommodation";

export const defaultAccommodationFormValues: AccommodationFormValues = {
  title: "",
  shortDescription: "",
  description: "",
  price: 0,
  capacity: 2,
  maxAdults: 2,
  maxChildren: 0,
  maxTotalGuests: 2,
  bedCount: 1,
  bathroomCount: 1,
  isActive: true,
  amenities: [],
  images: [],
  deletedImages: [],
};
