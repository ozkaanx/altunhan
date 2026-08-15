"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type { ReviewFormValues } from "@/types/review";

export async function createReview(values: ReviewFormValues) {
  const supabase = await createClient();

  const { error } = await supabase.from("reviews").insert({
    guest_name: values.guestName.trim(),

    review_text: values.reviewText.trim(),

    rating: values.rating,

    is_active: values.isActive,

    sort_order: values.sortOrder,
  });

  if (error) {
    throw new Error(`Yorum eklenemedi: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function updateReview(id: number, values: ReviewFormValues) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reviews")
    .update({
      guest_name: values.guestName.trim(),

      review_text: values.reviewText.trim(),

      rating: values.rating,

      is_active: values.isActive,

      sort_order: values.sortOrder,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Yorum güncellenemedi: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    throw new Error(`Yorum silinemedi: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function toggleReviewStatus(id: number, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reviews")
    .update({
      is_active: isActive,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Yorum durumu güncellenemedi: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}
