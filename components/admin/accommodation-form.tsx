"use client";

import { useRouter } from "next/navigation";

import {
  AccommodationForm,
  type AccommodationFormValues,
} from "@/components/admin/accommodation-form";

import {
  updateAccommodation,
} from "@/app/admin/accommodations/action";

import {
  updateAccommodationImages,
} from "@/lib/supabase/upload-accommodation-images";

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
    // Önce konaklama bilgileri
    const result =
      await updateAccommodation(
        String(id),
        {
          title:
            values.title,

          shortDescription:
            values.shortDescription,

          description:
            values.description,

          price:
            values.price,

          capacity:
            values.capacity,

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

    // Sonra fotoğraflar
    await updateAccommodationImages({
      accommodationId: id,

      images:
        values.images,

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