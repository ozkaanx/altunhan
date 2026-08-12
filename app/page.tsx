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

export type HomeAccommodation = {
  id: number;
  title: string;
  slug: string | null;
  short_description: string | null;
  price: number;
  capacity: number;

  accommodation_images: Array<{
    id: number;
    image_url: string;
    sort_order: number;
    is_cover: boolean;
  }>;
};

export default async function Home() {
  const supabase = await createClient();

  const [
    accommodationsResult,
    settingsResult,
    reviewsResult,
  ] = await Promise.all([
    supabase
      .from("accommodations")
      .select(`
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
      `)
      .eq("is_active", true)
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single(),

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
  ]);

  const {
    data: accommodations,
    error: accommodationsError,
  } = accommodationsResult;

  const {
    data: settings,
    error: settingsError,
  } = settingsResult;

  const {
    data: reviews,
    error: reviewsError,
  } = reviewsResult;

  if (accommodationsError) {
    console.error(
      "Ana sayfa konaklamaları alınamadı:",
      accommodationsError,
    );
  }

  if (settingsError) {
    console.error(
      "Site ayarları alınamadı:",
      settingsError,
    );
  }

  if (reviewsError) {
    console.error(
      "Yorumlar alınamadı:",
      reviewsError,
    );
  }

  return (
    <>
      <Header />

      <Navbar />

      <main>
        <Hero />

        <AboutExperience />

        <Accommodation
          accommodations={
            (accommodations ?? []) as HomeAccommodation[]
          }
        />

        <LocationReviews
          settings={settings as SiteSettings | null}
          reviews={(reviews ?? []) as Review[]}
        />
      </main>

      <Footer
        settings={settings as SiteSettings | null}
        accommodations={
          (accommodations ?? []) as HomeAccommodation[]
        }
      />
    </>
  );
}