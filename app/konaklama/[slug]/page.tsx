import type { Metadata } from "next";

import { notFound } from "next/navigation";

import Footer from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import Navbar from "@/components/shared/navbar";

import {
  getAccommodationBySlug,
  getAccommodationDetailPageData,
} from "@/lib/accommodation/get-accommodation-detail";

import { AccommodationDetailHero } from "@/components/accommodation/accommodation-detail-hero";
import { AccommodationOverview } from "@/components/accommodation/accommodation-overview";
import { AccommodationDetailsSection } from "@/components/accommodation/accommodation-details-section";
import { AccommodationReservationCta } from "@/components/accommodation/accommodation-reservation-cta";
import { sortAccommodationImages } from "@/lib/accommodation/accommodation-images";
import { AccommodationGuestInformation } from "@/components/accommodation/accommodation-guest-information";
import { AccommodationMobileReservationBar } from "@/components/accommodation/accommodation-mobile-reservation-bar";

type AccommodationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: AccommodationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const accommodation = await getAccommodationBySlug(slug);

  if (!accommodation) {
    return {
      title: "Konaklama Bulunamadı | Altunhan Farm",
    };
  }

  const images = sortAccommodationImages(accommodation.accommodation_images);

  const coverImage = images[0];

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

  const { accommodation, settings, accommodations, homepageContent } =
    await getAccommodationDetailPageData(slug);

  if (!accommodation) {
    notFound();
  }

  const images = sortAccommodationImages(accommodation.accommodation_images);

  const reservationHref = `/rezervasyon?accommodation=${encodeURIComponent(accommodation.slug)}`;

  return (
    <>
      <Header settings={settings} />

      <Navbar />

      <main className="bg-[#F5F1E8] pb-[88px] lg:pb-0">
        <AccommodationDetailHero title={accommodation.title} images={images} />
        <AccommodationOverview accommodation={accommodation} reservationHref={reservationHref} />
        <AccommodationDetailsSection accommodation={accommodation} />
        <AccommodationGuestInformation settings={settings} />
        <AccommodationReservationCta reservationHref={reservationHref} />
      </main>

      <AccommodationMobileReservationBar
        price={accommodation.price}
        reservationHref={reservationHref}
      />

      <Footer settings={settings} accommodations={accommodations} content={homepageContent} />
    </>
  );
}
