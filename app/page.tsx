import { Header } from "@/components/shared/header";
import Hero from "@/components/shared/hero";
import Navbar from "@/components/shared/navbar";
import AboutExperience from "@/components/shared/experience";
import Accommodation from "@/components/shared/accommodation";
import LocationReviews from "@/components/shared/locationReviews";
import Footer from "@/components/shared/footer";

import { createClient } from "@/lib/supabase/server";

import type { SiteSettings } from "@/types/site-settings";
import type { Review } from "@/types/review";
import type { HomepageContent } from "@/types/homepage-content";
import Restaurant from "@/components/shared/restaurant";

import type { HomeAccommodation } from "@/types/home-accommodation";

export default async function Home() {
  const supabase = await createClient();

  const [accommodationsResult, settingsResult, reviewsResult, homepageContentResult] =
    await Promise.all([
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

      supabase.from("site_settings").select("*").eq("id", 1).single(),

      supabase
        .from("reviews")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: false,
        }),

      supabase.from("homepage_content").select("*").eq("id", 1).single(),
    ]);

  const { data: accommodations, error: accommodationsError } = accommodationsResult;

  const { data: settings, error: settingsError } = settingsResult;

  const { data: reviews, error: reviewsError } = reviewsResult;

  const { data: homepageContent, error: homepageContentError } = homepageContentResult;

  if (accommodationsError) {
    console.error("Ana sayfa konaklamaları alınamadı:", accommodationsError);
  }

  if (settingsError) {
    console.error("Site ayarları alınamadı:", settingsError);
  }

  if (reviewsError) {
    console.error("Yorumlar alınamadı:", reviewsError);
  }

  if (homepageContentError) {
    console.error("Ana sayfa içeriği alınamadı:", homepageContentError);
  }

  const content = homepageContent as HomepageContent | null;

  const siteSettings = settings as SiteSettings | null;

  return (
    <>
      <Header settings={siteSettings} />

      <Navbar />

      <main>
        <Hero content={content} settings={settings as SiteSettings | null} />

        <AboutExperience content={content} />

        <Accommodation
          accommodations={(accommodations ?? []) as HomeAccommodation[]}
          content={content}
        />
        <Restaurant />
        <LocationReviews
          settings={siteSettings}
          reviews={(reviews ?? []) as Review[]}
          content={content}
        />
      </main>

      <Footer
        settings={siteSettings}
        accommodations={(accommodations ?? []) as HomeAccommodation[]}
        content={content}
      />
    </>
  );
}
