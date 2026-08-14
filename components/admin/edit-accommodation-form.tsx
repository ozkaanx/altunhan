"use client";

import { useRouter } from "next/navigation";

import { updateAccommodation } from "@/app/admin/accommodations/action";

import { AccommodationForm } from "@/components/admin/accommodation-form";

import { updateAccommodationImages } from "@/lib/supabase/upload-accommodation-images";

import type {
  AccommodationFormValues,
} from "@/types/accommodation";

type EditAccommodationFormProps = {
  id: number;
  initialValues: AccommodationFormValues;
};

export function EditAccommodationForm({
  id,
  initialValues,
}: EditAccommodationFormProps) {
  const router = useRouter();

  const handleUpdate = async (
    values: AccommodationFormValues,
  ) => {
    const result =
      await updateAccommodation(
        id,
        {
          title:
            values.title,

          shortDescription:
            values.shortDescription,

          description:
            values.description,

          price:
            values.price,

          maxAdults:
            values.maxAdults,

          maxChildren:
            values.maxChildren,

          maxTotalGuests:
            values.maxTotalGuests,

          bedCount:
            values.bedCount,

          bathroomCount:
            values.bathroomCount,

          amenities:
            values.amenities,

          isActive:
            values.isActive,
        },
      );

    if (!result.success) {
      throw new Error(
        result.message,
      );
    }

    await updateAccommodationImages({
      accommodationId: id,
      images: values.images,
      deletedImages:
        values.deletedImages,
    });

    router.push(
      "/admin/accommodations",
    );

    router.refresh();
  };

  return (
    <AccommodationForm
      initialValues={
        initialValues
      }
      submitLabel="Değişiklikleri Kaydet"
      onSubmit={
        handleUpdate
      }
    />
  );
}