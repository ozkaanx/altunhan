import type { Metadata } from "next";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ReservationForm } from "@/components/reservation/reservation-form";
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

export default async function ReservationPage({
  searchParams,
}: ReservationPageProps) {
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
      capacity
    `,
      )
      .eq("is_active", true)
      .order("created_at", {
        ascending: true,
      }),

    supabase.from("site_settings").select("*").eq("id", 1).single(),
  ]);

  const { data: accommodations, error: accommodationsError } =
    accommodationsResult;

  const { data: settings  } = settingsResult;

  if (accommodationsError) {
    console.error("Konaklamalar alınamadı:", accommodationsError);
  }

  const publicAccommodations = (accommodations ?? []) as PublicAccommodation[];

  const requestedAccommodation = requestedAccommodationSlug
    ? publicAccommodations.find(
        (accommodation) => accommodation.slug === requestedAccommodationSlug,
      )
    : null;

  const initialAccommodationId =
    requestedAccommodation?.id ?? publicAccommodations[0]?.id ?? null;

  return (
    <main className="min-h-screen bg-[#F4F2ED]">
      <div className="border-b border-[#E2DED6] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#71766F]"
          >
            <ArrowLeft size={14} />
            Altunhan Farm
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 max-w-[680px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8754F]">
            Altunhan Farm
          </p>

          <h1 className="mt-3 font-serif text-4xl leading-tight text-[#263A2D] sm:text-5xl">
            Rezervasyon
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#71756E]">
            Konaklamanızı ve tarihlerinizi seçin. Müsaitliği kontrol ettikten
            sonra rezervasyon talebinizi oluşturabilirsiniz.
          </p>
        </div>

        {accommodations?.length ? (
          <ReservationForm
            accommodations={publicAccommodations}
            settings={settings as SiteSettings | null}
            initialAccommodationId={initialAccommodationId}
          />
        ) : (
          <div className="border border-[#E3E0D8] bg-white px-5 py-16 text-center">
            <p className="text-sm font-semibold text-[#263A2D]">
              Şu anda rezervasyona açık konaklama bulunmuyor.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex h-10 items-center justify-center bg-[#263A2D] px-5 text-xs font-semibold text-white"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
