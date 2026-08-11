import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { EditAccommodationForm } from "@/components/admin/edit-accommodation-form";

type EditAccommodationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAccommodationPage({
  params,
}: EditAccommodationPageProps) {
  const { id } = await params;

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
    .eq("id", Number(id))
    .single();

  const initialValues = {
    title: accommodation.title,
    shortDescription: accommodation.short_description ?? "",
    description: accommodation.description ?? "",
    price: Number(accommodation.price),
    capacity: accommodation.capacity,
    bedCount: accommodation.bed_count,
    bathroomCount: accommodation.bathroom_count,
    amenities: accommodation.amenities ?? [],
    isActive: accommodation.is_active,
    images: (accommodation.accommodation_images ?? [])
      .sort(
        (a: { sort_order: number }, b: { sort_order: number }) =>
          a.sort_order - b.sort_order,
      )
      .map(
        (image: {
          id: number;
          image_url: string;
          storage_path: string;
          is_cover: boolean;
        }) => ({
          id: String(image.id),
          previewUrl: image.image_url,
          existingUrl: image.image_url,
          storagePath: image.storage_path,
          isCover: image.is_cover,
          isExisting: true,
        }),
      ),
  };

  return (
    <section>
      <div className="mb-6">
        <Link
          href="/admin/accommodations"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#71766F] transition-colors hover:text-[#263A2D]"
        >
          <ArrowLeft size={15} />
          Konaklamalara Dön
        </Link>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-[#A8754F]">Konaklama</p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
              {accommodation.title}
            </h1>

            <p className="mt-2 text-sm text-[#71756E]">
              Konaklama bilgilerini, fiyatını ve özelliklerini düzenleyin.
            </p>
          </div>

          <span
            className={`
              inline-flex
              w-fit
              px-3
              py-1.5
              text-[10px]
              font-semibold
              ${
                accommodation.is_active
                  ? "bg-[#E6EFE6] text-[#496249]"
                  : "bg-[#E7E9EA] text-[#686D68]"
              }
            `}
          >
            {accommodation.is_active ? "Yayında" : "Pasif"}
          </span>
        </div>
      </div>

      <EditAccommodationForm
        id={accommodation.id}
        initialValues={initialValues}
      />
    </section>
  );
}
