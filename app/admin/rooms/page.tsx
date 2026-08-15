import { RoomsBoard } from "@/components/admin/rooms-board";

import type { AdminRoom } from "@/components/admin/rooms-board";

import { createClient } from "@/lib/supabase/server";

export default async function RoomsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
      id,
      accommodation_id,
      room_name,
      room_number,
      is_active,

      accommodations (
        id,
        title
      ),

      reservations (
        id,
        reservation_code,
        guest_name,
        check_in,
        check_out,
        status,
        created_at
      )
    `,
    )
    .order("accommodation_id", {
      ascending: true,
    })
    .order("room_number", {
      ascending: true,
    });

  const rooms: AdminRoom[] = (data ?? []).map((room) => {
    const accommodation = Array.isArray(room.accommodations)
      ? (room.accommodations[0] ?? null)
      : (room.accommodations ?? null);

    return {
      id: Number(room.id),
      accommodation_id: Number(room.accommodation_id),
      room_name: room.room_name,
      room_number: room.room_number,
      is_active: Boolean(room.is_active),

      accommodations: accommodation
        ? {
            id: Number(accommodation.id),
            title: accommodation.title,
          }
        : null,

      reservations: (room.reservations ?? []).map((reservation) => ({
        id: Number(reservation.id),
        reservation_code: reservation.reservation_code,
        guest_name: reservation.guest_name,
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        status: reservation.status,
        created_at: reservation.created_at,
      })),
    };
  });

  if (error) {
    return (
      <section>
        <div className="border border-[#E7D6D1] bg-[#F8EEEA] px-5 py-12 text-center">
          <h2 className="text-sm font-semibold text-[#8A5147]">Odalar yüklenemedi</h2>

          <p className="mt-2 text-xs text-[#9B746D]">Oda bilgileri alınırken bir hata oluştu.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        <p className="text-xs text-[#8B8E87]">Oda Yönetimi</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
          Fiziksel Odalar
        </h1>

        <p className="mt-2 text-sm text-[#71756E]">
          Oteldeki fiziksel odaları, dolulukları ve aktif rezervasyonları yönetin.
        </p>
      </div>

      <RoomsBoard rooms={rooms} />
    </section>
  );
}
