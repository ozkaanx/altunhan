"use client";

import { useState } from "react";

import { defaultAccommodationFormValues } from "@/lib/admin/accommodation-form-defaults";

import type { AccommodationFormValues } from "@/types/accommodation";

export function useAccommodationFormState(initialValues?: Partial<AccommodationFormValues>) {
  const [values, setValues] = useState<AccommodationFormValues>(() => ({
    ...defaultAccommodationFormValues,
    ...initialValues,
    images: initialValues?.images ?? [],
    deletedImages: initialValues?.deletedImages ?? [],
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateValue = <K extends keyof AccommodationFormValues>(
    key: K,
    value: AccommodationFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return {
    values,
    setValues,
    isSubmitting,
    setIsSubmitting,
    submitError,
    setSubmitError,
    updateValue,
  };
}
