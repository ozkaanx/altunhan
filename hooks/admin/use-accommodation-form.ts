"use client";

import type { ChangeEvent, FormEvent } from "react";

import { useRouter } from "next/navigation";

import { createAccommodation } from "@/app/admin/accommodations/action";

import { useAccommodationFormState } from "@/hooks/admin/use-accommodation-form-state";

import { uploadAccommodationImages } from "@/lib/supabase/upload-accommodation-images";

import type { AccommodationImageValue } from "@/types/accommodation";

import type {
  AccommodationCounterKey,
  AccommodationFormProps,
} from "@/types/admin-accommodation-form";

type UseAccommodationFormParams = Pick<AccommodationFormProps, "initialValues" | "onSubmit">;

export function useAccommodationForm({ initialValues, onSubmit }: UseAccommodationFormParams) {
  const router = useRouter();

  const state = useAccommodationFormState(initialValues);

  const { values, setValues, setIsSubmitting, setSubmitError, updateValue } = state;

  const increment = (key: AccommodationCounterKey) => {
    setValues((current) => {
      const nextValue = current[key] + 1;

      if (key === "maxAdults" || key === "maxChildren") {
        const nextTotal = Math.max(current.maxTotalGuests, nextValue);

        return {
          ...current,
          [key]: nextValue,
          maxTotalGuests: nextTotal,
          capacity: nextTotal,
        };
      }

      if (key === "maxTotalGuests") {
        return {
          ...current,
          maxTotalGuests: nextValue,
          capacity: nextValue,
        };
      }

      return {
        ...current,
        [key]: nextValue,
      };
    });
  };

  const decrement = (key: AccommodationCounterKey) => {
    setValues((current) => {
      if (key === "maxAdults") {
        return {
          ...current,
          maxAdults: Math.max(1, current.maxAdults - 1),
        };
      }

      if (key === "maxChildren") {
        return {
          ...current,
          maxChildren: Math.max(0, current.maxChildren - 1),
        };
      }

      if (key === "maxTotalGuests") {
        const minimumTotal = Math.max(1, current.maxAdults, current.maxChildren);

        const nextTotal = Math.max(minimumTotal, current.maxTotalGuests - 1);

        return {
          ...current,
          maxTotalGuests: nextTotal,
          capacity: nextTotal,
        };
      }

      return {
        ...current,
        [key]: Math.max(1, current[key] - 1),
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = values.amenities.includes(amenity);

    updateValue(
      "amenities",
      exists ? values.amenities.filter((item) => item !== amenity) : [...values.amenities, amenity],
    );
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    setSubmitError(null);

    const selectedFiles = Array.from(files);
    const maxFileSize = 10 * 1024 * 1024;

    const oversizedFile = selectedFiles.find((file) => file.size > maxFileSize);

    if (oversizedFile) {
      setSubmitError("Fotoğrafların her biri en fazla 10 MB olabilir.");

      event.target.value = "";

      return;
    }

    const newImages: AccommodationImageValue[] = selectedFiles.map((file, index) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      isCover: values.images.length === 0 && index === 0,
    }));

    updateValue("images", [...values.images, ...newImages]);

    event.target.value = "";
  };

  const setCoverImage = (id: string) => {
    updateValue(
      "images",
      values.images.map((image) => ({
        ...image,
        isCover: image.id === id,
      })),
    );
  };

  const removeImage = (id: string) => {
    const imageToRemove = values.images.find((image) => image.id === id);

    if (!imageToRemove) {
      return;
    }

    let deletedImages = values.deletedImages;

    if (imageToRemove.isExisting && imageToRemove.storagePath) {
      deletedImages = [
        ...deletedImages,
        {
          id: Number(imageToRemove.id),
          storagePath: imageToRemove.storagePath,
        },
      ];
    }

    let remainingImages = values.images.filter((image) => image.id !== id);

    if (imageToRemove.file && imageToRemove.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    if (imageToRemove.isCover && remainingImages.length > 0) {
      remainingImages = remainingImages.map((image, index) => ({
        ...image,
        isCover: index === 0,
      }));
    }

    setValues((current) => ({
      ...current,
      images: remainingImages,
      deletedImages,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(values);

        return;
      }

      const result = await createAccommodation({
        title: values.title,
        shortDescription: values.shortDescription,
        description: values.description,
        price: values.price,
        maxAdults: values.maxAdults,
        maxChildren: values.maxChildren,
        maxTotalGuests: values.maxTotalGuests,
        bedCount: values.bedCount,
        bathroomCount: values.bathroomCount,
        amenities: values.amenities,
        isActive: values.isActive,
      });

      if (!result.success) {
        setSubmitError(result.message);

        return;
      }

      if (values.images.length > 0) {
        await uploadAccommodationImages(result.accommodationId, values.images);
      }

      router.push("/admin/accommodations");
      router.refresh();
    } catch (error) {
      console.error(error);

      setSubmitError(error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...state,
    increment,
    decrement,
    toggleAmenity,
    handleImageUpload,
    setCoverImage,
    removeImage,
    handleSubmit,
  };
}
