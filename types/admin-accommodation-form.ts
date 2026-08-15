import type { AccommodationFormValues } from "@/types/accommodation";

export type AccommodationFormProps = {
  initialValues?: Partial<AccommodationFormValues>;
  submitLabel?: string;
  onSubmit?: (values: AccommodationFormValues) => void | Promise<void>;
};

export type AccommodationCounterKey =
  "maxAdults" | "maxChildren" | "maxTotalGuests" | "bedCount" | "bathroomCount";
