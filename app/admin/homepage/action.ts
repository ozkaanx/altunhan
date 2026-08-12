"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  HomepageContentFormValues,
} from "@/types/homepage-content";

export async function updateHomepageContent(
  values: HomepageContentFormValues,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("homepage_content")
    .update({
      hero_label: values.heroLabel.trim(),
      hero_title: values.heroTitle.trim(),
      hero_description:
        values.heroDescription.trim(),

      experience_title:
        values.experienceTitle.trim(),
      experience_description:
        values.experienceDescription.trim(),

      feature_1_title:
        values.feature1Title.trim(),
      feature_1_description:
        values.feature1Description.trim(),

      feature_2_title:
        values.feature2Title.trim(),
      feature_2_description:
        values.feature2Description.trim(),

      feature_3_title:
        values.feature3Title.trim(),
      feature_3_description:
        values.feature3Description.trim(),

      accommodation_label:
        values.accommodationLabel.trim(),
      accommodation_title:
        values.accommodationTitle.trim(),
      accommodation_description:
        values.accommodationDescription.trim(),

      location_label:
        values.locationLabel.trim(),
      location_title:
        values.locationTitle.trim(),

      reviews_label:
        values.reviewsLabel.trim(),
      reviews_title:
        values.reviewsTitle.trim(),

      footer_label:
        values.footerLabel.trim(),
      footer_title:
        values.footerTitle.trim(),
      footer_description:
        values.footerDescription.trim(),

      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    throw new Error(
      `Ana sayfa güncellenemedi: ${error.message}`,
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
}