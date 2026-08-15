"use client";

import { Save } from "lucide-react";

import { useAccommodationForm } from "@/hooks/admin/use-accommodation-form";

import { AccommodationBasicFields } from "@/components/admin/accommodation-form/accommodation-basic-fields";

import type {
  AccommodationFormProps,
} from "@/types/admin-accommodation-form";

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
      <AccommodationCapacitySection
        values={values}
        onDecrease={decrement}
        onIncrease={increment}
      />

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

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-[#DDD9D1] bg-[#F3F1EC]/95 p-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        {submitError && (
          <div className="mb-3 border border-[#E7D6D1] bg-[#F8EEEA] px-4 py-3 text-xs text-[#8A5147]">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-60 sm:ml-auto sm:w-auto sm:px-8"
        >
          <Save size={16} />

          {isSubmitting ? "Kaydediliyor..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
