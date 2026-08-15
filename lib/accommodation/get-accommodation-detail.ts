import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

import type { Accommodation } from "@/types/accommodation";
import type { HomeAccommodation } from "@/types/home-accommodation";
import type { HomepageContent } from "@/types/homepage-content";
import type { SiteSettings } from "@/types/site-settings";

const ACCOMMODATION_DETAIL_SELECT = `
  id,
  title,
  slug,
  short_description,
  description,
  price,
  capacity,
  bed_count,
  bathroom_count,
  amenities,
  is_active,
  created_at,
  updated_at,
  accommodation_images!accommodation_images_accommodation_id_fkey (
    id,
    image_url,
    storage_path,
    sort_order,
    is_cover
  )
`;

export const getAccommodationBySlug = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("accommodations")
    .select(ACCOMMODATION_DETAIL_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Konaklama detayı alınamadı:", error);

    return null;
  }

  return data as Accommodation | null;
});

export async function getAccommodationDetailPageData(slug: string) {
  const supabase = await createClient();

  const [accommodation, settingsResult, accommodationsResult, homepageContentResult] =
    await Promise.all([
      getAccommodationBySlug(slug),

      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),

      supabase
        .from("accommodations")
        .select(
          `
          id,
          title,
          slug,
          short_description,
          price,
          capacity,
          accommodation_images!accommodation_images_accommodation_id_fkey (
            id,
            image_url,
            sort_order,
            is_cover
          )
        `,
        )
        .eq("is_active", true)
        .order("created_at", {
          ascending: true,
        }),

      supabase.from("homepage_content").select("*").eq("id", 1).maybeSingle(),
    ]);

  const errors = [
    settingsResult.error,
    accommodationsResult.error,
    homepageContentResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error("Konaklama sayfası verileri alınamadı:", errors);
  }

  return {
    accommodation,

    settings: settingsResult.data as SiteSettings | null,

    accommodations: (accommodationsResult.data ?? []) as HomeAccommodation[],

    homepageContent: homepageContentResult.data as HomepageContent | null,
  };
}
