import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Check,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { HomeAccommodation } from "@/app/page";

import AccommodationGallery from "@/components/shared/accommodation-gallery";
import Footer from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import Navbar from "@/components/shared/navbar";

import { amenityOptions } from "@/lib/accommodation/amenities";
import { formatPrice } from "@/lib/formatters/price";
import { createClient } from "@/lib/supabase/server";

import type { Accommodation } from "@/types/accommodation";
import type { HomepageContent } from "@/types/homepage-content";
import type { SiteSettings } from "@/types/site-settings";

type AccommodationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getAmenityMeta(amenity: string) {
  const option = amenityOptions.find((item) => item.value === amenity);

  if (option) {
    return option;
  }

  return {
    value: amenity,
    label: amenity
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("tr-TR")),
    icon: Check,
  };
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

  const images = accommodation.accommodation_images ?? [];

  const coverImage =
    images.find((image) => image.is_cover) ??
    [...images].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))[0];

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

export default async function AccommodationDetailPage({ params }: AccommodationDetailPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const [accommodationResult, settingsResult, accommodationsResult, homepageContentResult] =
    await Promise.all([
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

  const accommodations = (accommodationsResult.data ?? []) as HomeAccommodation[];

  const images = [...(accommodation.accommodation_images ?? [])].sort((a, b) => {
    if (a.is_cover && !b.is_cover) {
      return -1;
    }

    if (!a.is_cover && b.is_cover) {
      return 1;
    }

    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });

  const reservationHref = `/rezervasyon?accommodation=${encodeURIComponent(accommodation.slug)}`;

  return (
    <>
      <Header settings={settings} />

      <Navbar />

      <main className="bg-[#F5F1E8] pb-[88px] lg:pb-0">
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
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Konaklamalara Dön
            </Link>
          </div>
        </section>

        <section className="px-5 py-7 sm:px-6 sm:py-9 md:px-12 md:py-12 lg:px-16">
          <div className="mx-auto max-w-[1500px]">
            <AccommodationGallery title={accommodation.title} images={images} />
          </div>
        </section>

        <section className="px-5 sm:px-6 md:px-12 lg:px-16">
          <div
            className="
              mx-auto
              grid
              max-w-[1500px]
              gap-9
              border-b
              border-[#D9D4CA]
              pb-12
             lg:grid-cols-[minmax(0,1fr)_380px]
lg:items-start
lg:gap-14
              lg:pb-16
            "
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#A8754F]" />

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
              </div>

              <h1
                className="
                  mt-4
                  max-w-[900px]
                  font-serif
                  text-[38px]
                  leading-[1.02]
                  text-[#263A2D]
                  sm:text-5xl
                  lg:text-[58px]
                "
              >
                {accommodation.title}
              </h1>

              {accommodation.short_description && (
                <p
                  className="
                    mt-5
                    max-w-[680px]
                    text-sm
                    leading-7
                    text-[#626860]
                    sm:text-[15px]
                  "
                >
                  {accommodation.short_description}
                </p>
              )}

              <div
                className="
                  mt-8
                  grid
                  grid-cols-3
                  border
                  border-[#D9D4CA]
                  bg-[#FAF8F2]
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

            <aside className="lg:sticky lg:top-28">
              <div
                className="
      border
      border-[#D4CEC3]
      bg-[#FAF8F2]
      p-6
      shadow-[0_12px_35px_rgba(38,58,45,0.04)]
      sm:p-7
    "
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p
                      className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[#A8754F]
          "
                    >
                      Gecelik Fiyat
                    </p>

                    <p
                      className="
            mt-3
            font-serif
            text-[40px]
            leading-none
            tracking-[-0.02em]
            text-[#263A2D]
            sm:text-[44px]
          "
                    >
                      {formatPrice(accommodation.price)}
                    </p>

                    <p className="mt-2 text-[10px] text-[#92968E]">Oda başına / gecelik</p>
                  </div>

                  <div
                    className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          bg-[#E9EDE6]
          text-[#526048]
        "
                  >
                    <BedDouble size={17} strokeWidth={1.4} />
                  </div>
                </div>

                <div className="my-6 h-px bg-[#DDD8CC]" />

                <p
                  className="
        text-xs
        leading-6
        text-[#676E66]
      "
                >
                  Tarih ve kişi bilgilerinizi seçerek konaklamanız için müsaitliği kontrol edin.
                </p>

                <Link
                  href={reservationHref}
                  className="
        group
        mt-6
        flex
        h-[52px]
        w-full
        items-center
        justify-center
        gap-3
        bg-[#263A2D]
        px-5
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.17em]
        text-white
        transition-colors
        hover:bg-[#354A3B]
      "
                >
                  Rezervasyon Yap
                  <ArrowRight
                    size={14}
                    className="
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
                  />
                </Link>

                <div
                  className="
        mt-5
        flex
        items-start
        gap-3
        border-t
        border-[#DDD8CC]
        pt-5
      "
                >
                  <div
                    className="
          mt-0.5
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#E9EDE6]
          text-[#526048]
        "
                  >
                    <Check size={11} strokeWidth={2} />
                  </div>

                  <p
                    className="
          text-[10px]
          leading-5
          text-[#7D837C]
        "
                  >
                    Müsaitlik kontrolünden sonra ödeme ve onay adımları ekranda gösterilir.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section
          className="
            px-5
            py-12
            sm:px-6
            sm:py-14
            md:px-12
            md:py-18
            lg:px-16
          "
        >
          <div
            className="
              mx-auto
              grid
              max-w-[1500px]
              gap-12
              lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]
              lg:gap-20
            "
          >
            <div className="lg:pr-4">
              <div className="flex items-center gap-3">
                <span
                  className="
                    font-serif
                    text-[12px]
                    italic
                    text-[#A8754F]
                  "
                >
                  01
                </span>

                <div className="h-px w-7 bg-[#A8754F]" />

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
              </div>

              <h2
                className="
                  mt-4
                  max-w-[520px]
                  font-serif
                  text-[32px]
                  leading-[1.08]
                  text-[#263A2D]
                  sm:text-[38px]
                "
              >
                Konaklama Hakkında
              </h2>

              <div
                className="
                  mt-6
                  border-l
                  border-[#C9B08A]
                  pl-5
                  sm:pl-6
                "
              >
                <p
                  className="
                    max-w-[580px]
                    whitespace-pre-line
                    text-[14px]
                    leading-7
                    text-[#5F665E]
                    sm:text-[15px]
                    sm:leading-8
                  "
                >
                  {accommodation.description ||
                    accommodation.short_description ||
                    "Altunhan Farm'da doğayla iç içe huzurlu bir konaklama deneyimi."}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span
                  className="
                    font-serif
                    text-[12px]
                    italic
                    text-[#A8754F]
                  "
                >
                  02
                </span>

                <div className="h-px w-7 bg-[#A8754F]" />

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
              </div>

              <h2
                className="
                  mt-4
                  font-serif
                  text-[32px]
                  leading-[1.08]
                  text-[#263A2D]
                  sm:text-[38px]
                "
              >
                Konaklama Özellikleri
              </h2>

              {accommodation.amenities?.length > 0 ? (
                <div
                  className="
                    mt-7
                    grid
                    gap-2.5
                    sm:grid-cols-2
                  "
                >
                  {accommodation.amenities.map((amenity) => {
                    const amenityMeta = getAmenityMeta(amenity);
                    const Icon = amenityMeta.icon;

                    return (
                      <div
                        key={amenity}
                        className="
                          group
                          flex
                          min-h-[58px]
                          items-center
                          gap-3.5
                          border
                          border-[#DDD8CC]
                          bg-[#FAF8F2]
                          px-3.5
                          py-2.5
                          transition-colors
                          hover:border-[#C9B08A]
                          hover:bg-[#F7F2E8]
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
                            bg-[#E9EDE6]
                            text-[#526048]
                            transition-colors
                            group-hover:bg-[#E2E8DE]
                          "
                        >
                          <Icon size={16} strokeWidth={1.5} />
                        </div>

                        <span
                          className="
                            text-[11px]
                            font-medium
                            leading-5
                            text-[#4E554E]
                            sm:text-xs
                          "
                        >
                          {amenityMeta.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="
                    mt-7
                    border
                    border-[#DDD8CC]
                    bg-[#FAF8F2]
                    p-5
                  "
                >
                  <p className="text-sm text-[#777D75]">
                    Bu konaklama için henüz özellik bilgisi eklenmemiş.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section
          className="
            px-5
            pb-14
            sm:px-6
            sm:pb-16
            md:px-12
            md:pb-20
            lg:px-16
          "
        >
          <div
            className="
              mx-auto
              flex
              max-w-[1500px]
              flex-col
              gap-7
              bg-[#263A2D]
              px-6
              py-8
              text-white
              sm:px-8
              sm:py-10
              md:flex-row
              md:items-center
              md:justify-between
              lg:px-10
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-[#C9B08A]
                "
              >
                Altunhan Farm
              </p>

              <h2
                className="
                  mt-3
                  max-w-[680px]
                  font-serif
                  text-[30px]
                  leading-tight
                  text-white
                  sm:text-[38px]
                "
              >
                Saros&apos;ta yerinizi ayırın.
              </h2>

              <p
                className="
                  mt-3
                  max-w-[560px]
                  text-xs
                  leading-6
                  text-white/60
                  sm:text-sm
                "
              >
                Tarihlerinizi seçin, müsaitliği kontrol edin ve rezervasyon talebinizi birkaç adımda
                oluşturun.
              </p>
            </div>

            <Link
              href={reservationHref}
              className="
                group
                inline-flex
                h-12
                shrink-0
                items-center
                justify-center
                gap-3
                bg-[#F5F1E8]
                px-8
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#263A2D]
                transition-colors
                hover:bg-white
              "
            >
              Rezervasyon Yap
              <ArrowRight
                size={14}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </section>
      </main>

      <Footer settings={settings} accommodations={accommodations} content={homepageContent} />
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
        <Icon size={21} strokeWidth={1.3} />
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
