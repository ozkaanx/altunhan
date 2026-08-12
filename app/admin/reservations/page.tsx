import { createClient } from "@/lib/supabase/server";
import { ReservationsList } from "@/components/admin/reservations-list";

import type { Reservation } from "@/types/reservation";

export default async function ReservationsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reservations")
    .select(
      `
  *,
  accommodations (
    id,
    title
  ),
  rooms (
    id,
    room_name,
    room_number
  )
`,
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Rezervasyonlar alınamadı:", error);

    return (
      <section>
        <div className="border border-[#E7D6D1] bg-[#F8EEEA] px-5 py-14 text-center">
          <h2 className="text-sm font-semibold text-[#8A5147]">
            Rezervasyonlar yüklenemedi
          </h2>

          <p className="mt-2 text-xs text-[#9B746D]">
            Veriler alınırken bir hata oluştu.
          </p>
        </div>
      </section>
    );
  }

  return <ReservationsList reservations={(data ?? []) as Reservation[]} />;
}
