"use client";

import { useRouter } from "next/navigation";

import {
  AccommodationForm,
  type AccommodationFormValues,
} from "@/components/admin/accommodation-form";

import { updateAccommodation } from "@/app/admin/accommodations/action";

type EditAccommodationFormProps = {
  id: string;
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
    const result = await updateAccommodation(
      id,
      values,
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    router.push("/admin/accommodations");
    router.refresh();
  };

  return (
    <AccommodationForm
      initialValues={initialValues}
      submitLabel="Değişiklikleri Kaydet"
      onSubmit={handleUpdate}
    />
  );
}