"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type AccommodationInput = {
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  capacity: number;
  bedCount: number;
  bathroomCount: number;
  amenities: string[];
  isActive: boolean;
};

function createSlug(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createAccommodation(values: AccommodationInput) {
  const supabase = await createClient();

  const slug = createSlug(values.title);

  const { data, error } = await supabase
    .from("accommodations")
    .insert({
      title: values.title,
      slug,
      short_description: values.shortDescription || null,
      description: values.description || null,
      price: values.price,
      capacity: values.capacity,
      bed_count: values.bedCount,
      bathroom_count: values.bathroomCount,
      amenities: values.amenities,
      is_active: values.isActive,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Konaklama eklenemedi:", error);

    return {
      success: false as const,
      message: error?.message ?? "Konaklama kaydedilemedi.",
    };
  }

  revalidatePath("/admin/accommodations");

  return {
    success: true as const,
    accommodationId: Number(data.id),
  };
}

export async function updateAccommodation(
  id: number,
  values: AccommodationInput,
) {
  const supabase = await createClient();

  const slug = createSlug(values.title);

  const { data, error } = await supabase
    .from("accommodations")
    .update({
      title: values.title,
      slug,
      short_description: values.shortDescription || null,
      description: values.description || null,
      price: values.price,
      capacity: values.capacity,
      bed_count: values.bedCount,
      bathroom_count: values.bathroomCount,
      amenities: values.amenities,
      is_active: values.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id");

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (!data?.length) {
    return {
      success: false,
      message: "Kayıt güncellenemedi. UPDATE yetkisini kontrol edin.",
    };
  }

  revalidatePath("/admin/accommodations");

  revalidatePath(`/admin/accommodations/${id}`);

  return {
    success: true,
  };
}
