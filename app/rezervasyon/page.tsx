import type { Metadata } from "next";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { ReservationForm } from "@/components/reservation/reservation-form";
import { ReservationTrustPanel } from "@/components/reservation/reservation-trust-panel";

import { createClient } from "@/lib/supabase/server";

import type { PublicAccommodation } from "@/types/public-reservation";
import type { SiteSettings } from "@/types/site-settings";

export const metadata: Metadata = {
  title: "Rezervasyon",

  description:
    "Altunhan Farm için konaklama seçeneklerini, uygun tarihleri ve rezervasyon bilgilerini görüntüleyin.",

  alternates: {
    canonical: "/rezervasyon",
  },

  openGraph: {
    title: "Rezervasyon | Altunhan Farm",

    description:
      "Altunhan Farm için uygun tarihleri kontrol edin ve rezervasyon talebinizi oluşturun.",

    url: "/rezervasyon",

    type: "website",
  },
};

type ReservationPageProps = {
  searchParams: Promise<{
    accommodation?: string;
  }>;
};

export default async function ReservationPage({ searchParams }: ReservationPageProps) {
  const params = await searchParams;

  const requestedAccommodationSlug = params.accommodation ?? null;

  const supabase = await createClient();

  const [accommodationsResult, settingsResult] = await Promise.all([
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
          max_adults,
          max_children,
          max_total_guests,
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
  ]);

  const { data: accommodations, error: accommodationsError } = accommodationsResult;

  const { data: settings } = settingsResult;

  if (accommodationsError) {
    console.error("Konaklamalar alınamadı:", accommodationsError);
  }

  const publicAccommodations = (accommodations ?? []) as PublicAccommodation[];

  const requestedAccommodation = requestedAccommodationSlug
    ? publicAccommodations.find(
        (accommodation) => accommodation.slug === requestedAccommodationSlug,
      )
    : null;

  const initialAccommodationId = requestedAccommodation?.id ?? publicAccommodations[0]?.id ?? null;

  return (
    <main className="min-h-screen bg-[#F5F1E8]">
      <header
        className="
          border-b
          border-[#DDD8CC]
          bg-[#FAF8F2]
        "
      >
        <div
          className="
            relative
            mx-auto
            flex
            h-[68px]
            max-w-[1280px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <Link
            href="/"
            className="
              group
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-[#636A62]
              transition-colors
              hover:text-[#263A2D]
            "
          >
            <ArrowLeft
              size={14}
              className="
                transition-transform
                group-hover:-translate-x-1
              "
            />

            <span className="hidden sm:inline">Ana Sayfa</span>
            <span className="sm:hidden">Geri</span>
          </Link>

          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              text-center
            "
          >
            <p
              className="
                whitespace-nowrap
                font-serif
                text-lg
                tracking-[0.04em]
                text-[#263A2D]
                sm:text-xl
              "
            >
              Altunhan Farm
            </p>

            <p
              className="
                mt-0.5
                hidden
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-[#A8754F]
                sm:block
              "
            >
              Rezervasyon
            </p>
          </div>

          <Link
            href="/rezervasyon/takip"
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-[#636A62]
              transition-colors
              hover:text-[#263A2D]
              sm:text-[10px]
            "
          >
            <span className="hidden sm:inline">Rezervasyon Takibi</span>
            <span className="sm:hidden">Takip</span>
          </Link>
        </div>
      </header>

      <section
        className="
          border-b
          border-[#DDD8CC]
          px-4
          py-10
          sm:px-6
          sm:py-14
          lg:px-8
          lg:py-16
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-[1280px]
            gap-9
            lg:grid-cols-[minmax(0,1fr)_420px]
            lg:items-end
            lg:gap-20
          "
        >
          <div>
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
                Online Rezervasyon
              </p>
            </div>

            <h1
              className="
                mt-5
                max-w-[750px]
                font-serif
                text-[40px]
                leading-[1.03]
                text-[#263A2D]
                sm:text-5xl
                md:text-[58px]
              "
            >
              Saros&apos;ta yerinizi birkaç adımda ayırın.
            </h1>

            <p
              className="
                mt-5
                max-w-[650px]
                text-sm
                leading-7
                text-[#636A62]
                sm:text-[15px]
              "
            >
              Konaklamanızı seçin, tarihlerinizi belirleyin ve iletişim bilgilerinizi tamamlayın.
              Müsaitlik rezervasyon oluşturulmadan önce tekrar kontrol edilir.
            </p>
          </div>

          <ReservationTrustPanel />
        </div>
      </section>

      <section
        className="
          px-4
          py-8
          sm:px-6
          sm:py-10
          lg:px-8
          lg:py-12
        "
      >
        {publicAccommodations.length > 0 ? (
          <ReservationForm
            accommodations={publicAccommodations}
            settings={settings as SiteSettings | null}
            initialAccommodationId={initialAccommodationId}
          />
        ) : (
          <div
            className="
              mx-auto
              max-w-[760px]
              border
              border-[#DDD8CC]
              bg-[#FAF8F2]
              px-6
              py-16
              text-center
            "
          >
            <p
              className="
                font-serif
                text-2xl
                text-[#263A2D]
              "
            >
              Şu anda rezervasyona açık konaklama bulunmuyor.
            </p>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-sm
                leading-6
                text-[#737971]
              "
            >
              Konaklama seçeneklerimiz yeniden açıldığında bu sayfadan rezervasyon
              oluşturabilirsiniz.
            </p>

            <Link
              href="/"
              className="
                mt-7
                inline-flex
                h-11
                items-center
                justify-center
                bg-[#263A2D]
                px-6
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-white
              "
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
