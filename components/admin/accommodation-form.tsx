"use client";

import { useAccommodationForm } from "@/hooks/admin/use-accommodation-form";

import { AccommodationBasicFields } from "@/components/admin/accommodation-form/accommodation-basic-fields";

import type { AccommodationFormProps } from "@/types/admin-accommodation-form";

import { AccommodationCapacitySection } from "@/components/admin/accommodation-form/accommodation-capacity-section";
import { AccommodationImagesSection } from "@/components/admin/accommodation-form/accommodation-images-section";
import { AccommodationAmenitiesSection } from "@/components/admin/accommodation-form/accommodation-amenities-section";
import { AccommodationFormFooter } from "@/components/admin/accommodation-form/accommodation-form-footer";

export function AccommodationForm({
  initialValues,
  submitLabel = "Konaklamayı Kaydet",
  onSubmit,
}: AccommodationFormProps) {
  const {
    values,
    isSubmitting,
    submitError,
    updateValue,
    increment,
    decrement,
    toggleAmenity,
    handleImageUpload,
    setCoverImage,
    removeImage,
    handleSubmit,
  } = useAccommodationForm({
    initialValues,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[900px] space-y-5">
      <AccommodationBasicFields values={values} onChange={updateValue} />
      <AccommodationCapacitySection values={values} onDecrease={decrement} onIncrease={increment} />

      <AccommodationImagesSection
        images={values.images}
        onUpload={handleImageUpload}
        onRemove={removeImage}
        onSetCover={setCoverImage}
      />

      <AccommodationAmenitiesSection
        selectedAmenities={values.amenities}
        onToggle={toggleAmenity}
      />

      <AccommodationFormFooter
        isActive={values.isActive}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitLabel={submitLabel}
        onActiveChange={(active) => updateValue("isActive", active)}
      />
    </form>
  );
}
