import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, Bath, BedDouble, Check, Users } from "lucide-react";

import { Header } from "@/components/shared/header";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

import { createClient } from "@/lib/supabase/server";

import type { Accommodation } from "@/types/accommodation";

import type { SiteSettings } from "@/types/site-settings";

import type { HomeAccommodation } from "@/app/page";
import type { HomepageContent } from "@/types/homepage-content";

import AccommodationGallery from "@/components/shared/accommodation-gallery";

import type { Metadata } from "next";

type AccommodationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: AccommodationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: accommodation } = await supabase
    .from("accommodations")
    .select(
      `
      title,
      short_description,
      accommodation_images!accommodation_images_accommodation_id_fkey (
        image_url,
        sort_order,
        is_cover
      )
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!accommodation) {
    return {
      title: "Konaklama Bulunamadı | Altunhan Farm",
    };
  }

  const images = accommodation.accommodation_images ?? [];

  const coverImage =
    images.find((image) => image.is_cover) ??
    [...images].sort(
      (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
    )[0];

  const description =
    accommodation.short_description ||
    `${accommodation.title} - Altunhan Farm, Saros'ta doğayla iç içe konaklama.`;

  return {
    title: accommodation.title,

    description,

    openGraph: {
      title: accommodation.title,
      description,
      type: "website",

      images: coverImage?.image_url
        ? [
            {
              url: coverImage.image_url,
              alt: accommodation.title,
            },
          ]
        : [],
    },
  };
}

export default async function AccommodationDetailPage({
  params,
}: AccommodationDetailPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const [
    accommodationResult,
    settingsResult,
    accommodationsResult,
    homepageContentResult,
  ] = await Promise.all([
    supabase
      .from("accommodations")
      .select(
        `
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
      `,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single(),

    supabase.from("site_settings").select("*").eq("id", 1).single(),

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

    supabase.from("homepage_content").select("*").eq("id", 1).single(),
  ]);

  if (accommodationResult.error || !accommodationResult.data) {
    notFound();
  }

  const accommodation = accommodationResult.data as Accommodation;
  const settings = settingsResult.data as SiteSettings | null;
  const homepageContent = homepageContentResult.data as HomepageContent | null;

  const accommodations = (accommodationsResult.data ??
    []) as HomeAccommodation[];

  const images = [...(accommodation.accommodation_images ?? [])].sort(
    (a, b) => {
      if (a.is_cover && !b.is_cover) {
        return -1;
      }

      if (!a.is_cover && b.is_cover) {
        return 1;
      }

      return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
    },
  );

  const coverImage = images[0]?.image_url ?? null;

  return (
    <>
      <Header />

      <Navbar />

      <main className="bg-[#F5F1E8]">
        <section className="border-b border-[#DDD8CC] px-6 py-6 md:px-12 lg:px-16">
          <div className="mx-auto max-w-[1500px]">
            <Link
              href="/#konaklama"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5F675E]"
            >
              <ArrowLeft size={14} />
              Konaklamalara Dön
            </Link>
          </div>
        </section>

        <section className="px-6 py-10 md:px-12 md:py-14 lg:px-16">
          <AccommodationGallery title={accommodation.title} images={images} />
        </section>

        <section className="px-6 pb-20 md:px-12 md:pb-24 lg:px-16">
          <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A8754F]">
                Konaklama
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-[#263A2D] md:text-5xl lg:text-6xl">
                {accommodation.title}
              </h1>

              {accommodation.short_description && (
                <p className="mt-5 max-w-2xl text-base leading-7 text-[#626860]">
                  {accommodation.short_description}
                </p>
              )}

              <div className="mt-8 grid grid-cols-3 gap-3">
                <InfoCard
                  icon={Users}
                  label="Kapasite"
                  value={`${accommodation.capacity} kişi`}
                />

                <InfoCard
                  icon={BedDouble}
                  label="Yatak"
                  value={`${accommodation.bed_count} adet`}
                />

                <InfoCard
                  icon={Bath}
                  label="Banyo"
                  value={`${accommodation.bathroom_count} adet`}
                />
              </div>

              {accommodation.description && (
                <div className="mt-10 border-t border-[#DDD8CC] pt-8">
                  <h2 className="font-serif text-3xl text-[#263A2D]">
                    Konaklama Hakkında
                  </h2>

                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#646A63]">
                    {accommodation.description}
                  </p>
                </div>
              )}

              {accommodation.amenities?.length > 0 && (
                <div className="mt-10 border-t border-[#DDD8CC] pt-8">
                  <h2 className="font-serif text-3xl text-[#263A2D]">
                    Özellikler
                  </h2>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {accommodation.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 border border-[#DED9D0] bg-[#F8F4EB] px-4 py-4"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#E9EDE6] text-[#526048]">
                          <Check size={14} />
                        </div>

                        <span className="text-xs font-medium text-[#505750]">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <div className="border border-[#DCD7CE] bg-white p-6">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#8B9089]">
                  Gecelik
                </p>

                <p className="mt-2 font-serif text-4xl text-[#263A2D]">
                  {Number(accommodation.price).toLocaleString("tr-TR")} TL
                </p>

                <p className="mt-3 text-xs leading-5 text-[#858A83]">
                  Uygun tarihleri rezervasyon ekranından kontrol edebilirsiniz.
                </p>

                <Link
                  href={`/rezervasyon?accommodation=${encodeURIComponent(
                    accommodation.slug,
                  )}`}
                  className="mt-6 flex h-12 w-full items-center justify-center bg-[#263A2D] text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#354A3B]"
                >
                  Rezervasyon Yap
                </Link>

                <div className="mt-5 border-t border-[#ECE8E1] pt-5">
                  <p className="text-[10px] leading-5 text-[#858A83]">
                    Rezervasyon sonrası ödeme bilgileri ve onay süreci
                    tarafınıza gösterilecektir.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer
        settings={settings}
        accommodations={accommodations}
        content={homepageContent}
      />
    </>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[#DDD8CC] bg-[#F8F4EB] p-4 text-center">
      <Icon size={20} strokeWidth={1.3} className="mx-auto text-[#526048]" />

      <p className="mt-3 text-[9px] uppercase tracking-[0.12em] text-[#969A93]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#263A2D]">{value}</p>
    </div>
  );
}
