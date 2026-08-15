import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Users,
} from "lucide-react";

import type { HomeAccommodation } from "@/app/page";

import AccommodationGallery from "@/components/shared/accommodation-gallery";
import Footer from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import Navbar from "@/components/shared/navbar";

import { createClient } from "@/lib/supabase/server";

import type { Accommodation } from "@/types/accommodation";
import type { HomepageContent } from "@/types/homepage-content";
import type { SiteSettings } from "@/types/site-settings";

type AccommodationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const amenityLabels: Record<string, string> = {
  wifi: "Wi-Fi",
  air_conditioning: "Klima",
  private_bathroom: "Özel Banyo",
  sea_view: "Deniz Manzarası",
  breakfast: "Kahvaltı",
  private_beach: "Kendine Ait Beach",
  white_sunbed_and_umbrella: "Beyaz Şezlong ve Şemsiye",
  open_parking: "Açık Otopark",
  large_garden: "Geniş Bahçe",
  children_playground: "Çocuk Oyun Parkı",
  regularly_treated_area: "Sürekli İlaçlanan Alan",
  seafront_restaurant: "Denize Sıfır Restoran",
};

function getAmenityLabel(amenity: string) {
  return (
    amenityLabels[amenity] ??
    amenity
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toLocaleUpperCase("tr-TR"),
      )
  );
}

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

  const images =
    accommodation.accommodation_images ?? [];

  const coverImage =
    images.find((image) => image.is_cover) ??
    [...images].sort(
      (a, b) =>
        Number(a.sort_order ?? 0) -
        Number(b.sort_order ?? 0),
    )[0];

  const description =
    accommodation.short_description ||
    `${accommodation.title} - Altunhan Farm, Saros'ta doğayla iç içe konaklama.`;

  return {
    title: accommodation.title,
    description,

    alternates: {
      canonical: `/konaklama/${slug}`,
    },

    openGraph: {
      title: accommodation.title,
      description,
      type: "website",
      url: `/konaklama/${slug}`,

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

    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single(),

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

    supabase
      .from("homepage_content")
      .select("*")
      .eq("id", 1)
      .single(),
  ]);

  if (
    accommodationResult.error ||
    !accommodationResult.data
  ) {
    notFound();
  }

  const accommodation =
    accommodationResult.data as Accommodation;

  const settings =
    settingsResult.data as SiteSettings | null;

  const homepageContent =
    homepageContentResult.data as HomepageContent | null;

  const accommodations =
    (accommodationsResult.data ??
      []) as HomeAccommodation[];

  const images = [
    ...(accommodation.accommodation_images ?? []),
  ].sort((a, b) => {
    if (a.is_cover && !b.is_cover) {
      return -1;
    }

    if (!a.is_cover && b.is_cover) {
      return 1;
    }

    return (
      Number(a.sort_order ?? 0) -
      Number(b.sort_order ?? 0)
    );
  });

  const reservationHref =
    `/rezervasyon?accommodation=${encodeURIComponent(
      accommodation.slug,
    )}`;

  return (
    <>
      <Header settings={settings} />

      <Navbar />

      <main className="bg-[#F5F1E8]">
        <section className="border-b border-[#DDD8CC] px-5 py-5 sm:px-6 md:px-12 lg:px-16">
          <div className="mx-auto max-w-[1500px]">
            <Link
              href="/#konaklama"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[#5F675E]
                transition-colors
                hover:text-[#263A2D]
              "
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />

              Konaklamalara Dön
            </Link>
          </div>
        </section>

        <section className="px-5 py-7 sm:px-6 sm:py-9 md:px-12 md:py-12 lg:px-16">
          <AccommodationGallery
            title={accommodation.title}
            images={images}
          />
        </section>


        <section className="px-5 sm:px-6 md:px-12 lg:px-16">
          <div
            className="
              mx-auto
              grid
              max-w-[1500px]
              gap-8
              border-b
              border-[#DDD8CC]
              pb-10
              lg:grid-cols-[minmax(0,1fr)_360px]
              lg:items-start
              lg:gap-16
              lg:pb-12
            "
          >
            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#A8754F]
                "
              >
                Konaklama
              </p>

              <h1
                className="
                  mt-3
                  max-w-[900px]
                  font-serif
                  text-[36px]
                  leading-[1.03]
                  text-[#263A2D]
                  sm:text-4xl
                  md:text-5xl
                  lg:text-[56px]
                "
              >
                {accommodation.title}
              </h1>

              {accommodation.short_description && (
                <p
                  className="
                    mt-5
                    max-w-[720px]
                    text-sm
                    leading-7
                    text-[#626860]
                    sm:text-base
                  "
                >
                  {accommodation.short_description}
                </p>
              )}


              <div
                className="
                  mt-7
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-3
                "
              >
                <InfoCard
                  icon={Users}
                  label="Kapasite"
                  value={`Maks. ${accommodation.capacity} kişi`}
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
            </div>


            <aside className="lg:sticky lg:top-6">
              <div
                className="
                  border
                  border-[#D8D2C8]
                  bg-[#FAF8F2]
                  p-5
                  sm:p-6
                "
              >
                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                    lg:block
                  "
                >
                  <div>
                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#8B9089]
                      "
                    >
                      Gecelik
                    </p>

                    <p
                      className="
                        mt-2
                        font-serif
                        text-[34px]
                        leading-none
                        text-[#263A2D]
                        sm:text-4xl
                      "
                    >
                      {Number(
                        accommodation.price,
                      ).toLocaleString(
                        "tr-TR",
                      )}{" "}
                      TL
                    </p>
                  </div>
                </div>

                <p
                  className="
                    mt-4
                    text-[11px]
                    leading-5
                    text-[#777D75]
                  "
                >
                  Tarih ve kişi bilgilerinizi seçerek
                  müsaitliği anında kontrol edebilirsiniz.
                </p>

                <Link
                  href={reservationHref}
                  className="
                    mt-5
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    bg-[#263A2D]
                    px-5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-white
                    transition-colors
                    hover:bg-[#354A3B]
                  "
                >
                  Rezervasyon Yap
                </Link>

                <div
                  className="
                    mt-5
                    border-t
                    border-[#DDD8CC]
                    pt-4
                  "
                >
                  <p
                    className="
                      text-[10px]
                      leading-5
                      text-[#858A83]
                    "
                  >
                    Rezervasyon oluşturulduktan sonra
                    ödeme ve onay adımları ekranda
                    gösterilecektir.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>


        <section className="px-5 py-10 sm:px-6 sm:py-12 md:px-12 md:py-16 lg:px-16">
          <div
            className="
              mx-auto
              grid
              max-w-[1500px]
              gap-10
              lg:grid-cols-[0.8fr_1.2fr]
              lg:gap-16
            "
          >

            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-[#A8754F]
                "
              >
                Altunhan Farm
              </p>

              <h2
                className="
                  mt-3
                  font-serif
                  text-[30px]
                  leading-tight
                  text-[#263A2D]
                  sm:text-[34px]
                "
              >
                Konaklama Hakkında
              </h2>

              <p
                className="
                  mt-5
                  whitespace-pre-line
                  text-sm
                  leading-7
                  text-[#646A63]
                "
              >
                {accommodation.description ||
                  accommodation.short_description ||
                  "Altunhan Farm'da doğayla iç içe huzurlu bir konaklama deneyimi."}
              </p>
            </div>


            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-[#A8754F]
                "
              >
                Olanaklar
              </p>

              <h2
                className="
                  mt-3
                  font-serif
                  text-[30px]
                  leading-tight
                  text-[#263A2D]
                  sm:text-[34px]
                "
              >
                Konaklama Özellikleri
              </h2>

              {accommodation.amenities?.length > 0 ? (
                <div
                  className="
                    mt-6
                    grid
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  {accommodation.amenities.map(
                    (amenity) => (
                      <div
                        key={amenity}
                        className="
                          flex
                          min-h-14
                          items-center
                          gap-3
                          border
                          border-[#DED9D0]
                          bg-[#F8F4EB]
                          px-4
                          py-3
                        "
                      >
                        <div
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            bg-[#E9EDE6]
                            text-[#526048]
                          "
                        >
                          <Check
                            size={14}
                            strokeWidth={2}
                          />
                        </div>

                        <span
                          className="
                            text-xs
                            font-medium
                            leading-5
                            text-[#505750]
                          "
                        >
                          {getAmenityLabel(
                            amenity,
                          )}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="mt-5 text-sm text-[#777D75]">
                  Bu konaklama için henüz özellik
                  bilgisi eklenmemiş.
                </p>
              )}
            </div>
          </div>
        </section>


        <section
          className="
            border-t
            border-[#DDD8CC]
            bg-[#FAF8F2]
            px-5
            py-12
            sm:px-6
            md:px-12
            md:py-14
            lg:px-16
          "
        >
          <div
            className="
              mx-auto
              flex
              max-w-[1500px]
              flex-col
              gap-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-[#A8754F]
                "
              >
                Altunhan Farm
              </p>

              <h2
                className="
                  mt-3
                  max-w-[650px]
                  font-serif
                  text-[28px]
                  leading-tight
                  text-[#263A2D]
                  sm:text-[34px]
                "
              >
                Saros&apos;ta yerinizi ayırın.
              </h2>
            </div>

            <Link
              href={reservationHref}
              className="
                inline-flex
                h-12
                shrink-0
                items-center
                justify-center
                bg-[#263A2D]
                px-8
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-white
                transition-colors
                hover:bg-[#354A3B]
              "
            >
              Rezervasyon Yap
            </Link>
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
    <div
      className="
        flex
        items-center
        gap-4
        border
        border-[#DDD8CC]
        bg-[#F8F4EB]
        px-4
        py-4
        sm:flex-col
        sm:justify-center
        sm:text-center
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          text-[#526048]
        "
      >
        <Icon
          size={21}
          strokeWidth={1.3}
        />
      </div>

      <div>
        <p
          className="
            text-[9px]
            uppercase
            tracking-[0.14em]
            text-[#969A93]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            text-xs
            font-semibold
            text-[#263A2D]
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}