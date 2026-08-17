import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { EditAccommodationForm } from "@/components/admin/edit-accommodation-form";

import { createClient } from "@/lib/supabase/server";

import type { AccommodationFormValues } from "@/types/accommodation";

type EditAccommodationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAccommodationPage({ params }: EditAccommodationPageProps) {
  const { id } = await params;

  const accommodationId = Number(id);

  if (!Number.isInteger(accommodationId) || accommodationId < 1) {
    notFound();
  }

  const supabase = await createClient();

  const { data: accommodation, error } = await supabase
    .from("accommodations")
    .select(
      `
      *,
      accommodation_images!accommodation_images_accommodation_id_fkey (
        id,
        image_url,
        storage_path,
        sort_order,
        is_cover
      )
    `,
    )
    .eq("id", accommodationId)
    .single();

  if (error || !accommodation) {
    notFound();
  }

  const maxTotalGuests = Number(accommodation.max_total_guests ?? accommodation.capacity ?? 1);

  const maxAdults = Number(accommodation.max_adults ?? maxTotalGuests);

  const maxChildren = Number(accommodation.max_children ?? 0);

  const initialValues: AccommodationFormValues = {
    title: accommodation.title,

    shortDescription: accommodation.short_description ?? "",

    description: accommodation.description ?? "",

    price: Number(accommodation.price),

    capacity: maxTotalGuests,

    maxAdults,
    maxChildren,
    maxTotalGuests,

    bedCount: Number(accommodation.bed_count),

    bathroomCount: Number(accommodation.bathroom_count),

    amenities: accommodation.amenities ?? [],

    isActive: accommodation.is_active,

    deletedImages: [],

    images: (accommodation.accommodation_images ?? [])
      .sort(
        (
          a: {
            sort_order: number;
          },
          b: {
            sort_order: number;
          },
        ) => a.sort_order - b.sort_order,
      )
      .map((image: { id: number; image_url: string; storage_path: string; is_cover: boolean }) => ({
        id: String(image.id),

        previewUrl: image.image_url,

        existingUrl: image.image_url,

        storagePath: image.storage_path,

        isCover: image.is_cover,

        isExisting: true,
      })),
  };

  return (
    <section>
      <div className="mb-6">
        <Link
          href="/admin/accommodations"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#71766F]"
        >
          <ArrowLeft size={15} />
          Konaklamalara Dön
        </Link>

        <div className="mt-5">
          <p className="text-xs text-[#A8754F]">Konaklama</p>

          <h1 className="mt-1 text-2xl font-semibold text-[#263A2D]">{accommodation.title}</h1>

          <p className="mt-2 text-sm text-[#71756E]">
            Konaklama bilgilerini, kapasite kurallarını ve fotoğraflarını düzenleyin.
          </p>
        </div>
      </div>

      <EditAccommodationForm id={accommodationId} initialValues={initialValues} />
    </section>
  );
}
