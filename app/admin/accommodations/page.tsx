import { createClient } from "@/lib/supabase/server";
import { AccommodationsList } from "@/components/admin/accommodations-list";
import type { Accommodation } from "@/types/accommodation";

export default async function AccommodationsPage() {
  const supabase = await createClient();

  const { data: accommodations, error } = await supabase
    .from("accommodations")
    .select(`
      *,
      accommodation_images!accommodation_images_accommodation_id_fkey (
        id,
        image_url,
        storage_path,
        sort_order,
        is_cover
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  console.log(
    "ACCOMMODATIONS:",
    JSON.stringify(accommodations, null, 2),
  );

  console.log("ERROR:", error);

  if (error) {
    console.error(
      "Konaklamalar alınamadı:",
      error,
    );

    return (
      <section>
        <div className="border border-[#E7D6D1] bg-[#F8EEEA] px-5 py-12 text-center">
          <h2 className="text-sm font-semibold text-[#8A5147]">
            Konaklamalar yüklenemedi
          </h2>

          <p className="mt-2 text-xs text-[#9B746D]">
            Veriler alınırken bir hata oluştu.
          </p>
        </div>
      </section>
    );
  }

  return (
    <AccommodationsList
      accommodations={
        (accommodations ?? []) as Accommodation[]
      }
    />
  );
}