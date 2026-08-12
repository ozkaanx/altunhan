import { Header } from "@/components/shared/header";
import Hero from "@/components/shared/hero";
import Navbar from "@/components/shared/navbar";
import AboutExperience from "@/components/shared/experience";
import Accommodation from "@/components/shared/accommodation";
import LocationReviews from "@/components/shared/locationReviews";
import Footer from "@/components/shared/footer";

import { createClient } from "@/lib/supabase/server";

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

  const {
    data: accommodations,
    error,
  } = await supabase
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
    });

  if (error) {
    console.error(
      "Ana sayfa konaklamaları alınamadı:",
      error,
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

        <LocationReviews />
      </main>

      <Footer />
    </>
  );
}