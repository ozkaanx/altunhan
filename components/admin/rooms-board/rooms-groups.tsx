import Link from "next/link";

import { BedDouble, DoorClosed } from "lucide-react";

import { StatusBadge } from "@/components/admin/rooms-board/room-board-elements";

import { getReservationForDate } from "@/lib/admin/room-board-utils";
import { formatReservationDate } from "@/lib/reservation/date-utils";

import type { AdminRoom } from "@/types/admin-room";

type RoomGroup = {
  title: string;
  rooms: AdminRoom[];
};

type RoomsGroupsProps = {
  groupedRooms: Record<string, RoomGroup>;
  selectedDate: string;
  filteredRoomCount: number;
};

export function RoomsGroups({ groupedRooms, selectedDate, filteredRoomCount }: RoomsGroupsProps) {
  return (
    <div className="mt-7 space-y-8">
      {Object.entries(groupedRooms).map(([groupKey, group]) => {
        const occupiedCount = group.rooms.filter((room) =>
          getReservationForDate(room, selectedDate),
        ).length;

        return (
          <div key={groupKey} className="overflow-hidden border border-[#E3E0D8] bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-[#E8E4DC] px-4 py-4">
              <div>
                <h2 className="font-serif text-2xl text-[#263A2D]">{group.title}</h2>

                <p className="mt-1 text-xs text-[#8B8E87]">{group.rooms.length} oda gösteriliyor</p>
              </div>

              <span className="bg-[#F1EFEA] px-3 py-2 text-xs font-medium text-[#666C65]">
                {occupiedCount}/{group.rooms.length} dolu
              </span>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.rooms.map((room) => {
                const activeReservation = getReservationForDate(room, selectedDate);

                const isOccupied = Boolean(activeReservation);

                return (
                  <article key={room.id} className="border border-[#E6E2DA] bg-[#FAF9F6] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                            !room.is_active
                              ? "bg-[#F3E2DE] text-[#9C5148]"
                              : isOccupied
                                ? "bg-[#F4EBDC] text-[#8A642F]"
                                : "bg-[#E6EFE6] text-[#486348]"
                          }`}
                        >
                          <DoorClosed size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#263A2D]">
                            {room.room_name}
                          </p>

                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#969990]">
                            {room.room_number ?? "—"}
                          </p>
                        </div>
                      </div>

                      {!room.is_active ? (
                        <StatusBadge type="inactive" />
                      ) : isOccupied ? (
                        <StatusBadge type="occupied" />
                      ) : (
                        <StatusBadge type="available" />
                      )}
                    </div>

                    {activeReservation ? (
                      <div className="mt-4 border-t border-[#E8E4DC] pt-4">
                        <p className="text-[10px] uppercase tracking-[0.1em] text-[#969990]">
                          Aktif Rezervasyon
                        </p>

                        <Link
                          href={`/admin/reservations?reservation=${activeReservation.id}`}
                          className="mt-2 inline-block break-all text-xs font-semibold text-[#263A2D] underline-offset-4 hover:underline"
                        >
                          {activeReservation.reservation_code}
                        </Link>

                        <p className="mt-1 text-xs text-[#6D726B]">
                          {activeReservation.guest_name}
                        </p>

                        <p className="mt-2 text-[11px] text-[#8B8E87]">
                          {formatReservationDate(activeReservation.check_in)}
                          {" → "}
                          {formatReservationDate(activeReservation.check_out)}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 border-t border-[#E8E4DC] pt-4">
                        <p className="text-xs text-[#969990]">Aktif rezervasyon bulunmuyor.</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}

      {filteredRoomCount === 0 && (
        <div className="border border-[#E3E0D8] bg-white px-5 py-14 text-center">
          <BedDouble size={26} className="mx-auto text-[#A7AAA4]" />

          <p className="mt-4 text-sm font-semibold text-[#263A2D]">Filtreye uygun oda bulunamadı</p>

          <p className="mt-2 text-xs text-[#8B8E87]">Oda tipi veya durum filtresini değiştirin.</p>
        </div>
      )}
    </div>
  );
}
