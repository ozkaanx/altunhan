import {
  BedDouble,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type RoomReservation = {
  id: number;
  reservation_code: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  status:
    | "pending_payment"
    | "pending_approval"
    | "confirmed"
    | "rejected"
    | "cancelled";
  created_at: string;
};

type Room = {
  id: number;
  accommodation_id: number;
  room_name: string;
  room_number: string | null;
  is_active: boolean;

  accommodations: {
    id: number;
    title: string;
  } | null;

  reservations: RoomReservation[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(
      `${value}T00:00:00`,
    ),
  );
}

function isReservationActive(
  reservation: RoomReservation,
) {
  if (
    reservation.status ===
      "confirmed" ||
    reservation.status ===
      "pending_approval"
  ) {
    return true;
  }

  if (
    reservation.status ===
    "pending_payment"
  ) {
    const createdAt =
      new Date(
        reservation.created_at,
      ).getTime();

    return (
      createdAt >=
      Date.now() -
        60 * 60 * 1000
    );
  }

  return false;
}

export default async function RoomsPage() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("rooms")
    .select(`
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
    `)
    .order(
      "accommodation_id",
      {
        ascending: true,
      },
    )
    .order(
      "room_number",
      {
        ascending: true,
      },
    );

  if (error) {
    console.error(
      "Odalar alınamadı:",
      error,
    );

    return (
      <section>
        <div className="border border-[#E7D6D1] bg-[#F8EEEA] px-5 py-12 text-center">
          <h2 className="text-sm font-semibold text-[#8A5147]">
            Odalar yüklenemedi
          </h2>

          <p className="mt-2 text-xs text-[#9B746D]">
            Oda bilgileri alınırken
            bir hata oluştu.
          </p>
        </div>
      </section>
    );
  }

  const rooms =
    (data ?? []) as Room[];

  const groupedRooms =
    rooms.reduce<
      Record<
        string,
        {
          title: string;
          rooms: Room[];
        }
      >
    >(
      (
        groups,
        room,
      ) => {
        const key =
          String(
            room.accommodation_id,
          );

        if (
          !groups[key]
        ) {
          groups[key] = {
            title:
              room
                .accommodations
                ?.title ??
              "Konaklama",

            rooms: [],
          };
        }

        groups[
          key
        ].rooms.push(
          room,
        );

        return groups;
      },
      {},
    );

  return (
    <section>
      <div>
        <p className="text-xs text-[#8B8E87]">
          Oda Yönetimi
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
          Fiziksel Odalar
        </h1>

        <p className="mt-2 text-sm text-[#71756E]">
          Oteldeki fiziksel odaları ve
          aktif rezervasyon durumlarını
          görüntüleyin.
        </p>
      </div>

      <div className="mt-7 space-y-8">
        {Object.entries(
          groupedRooms,
        ).map(
          ([
            key,
            group,
          ]) => {
            const occupiedCount =
              group.rooms.filter(
                (room) =>
                  room.reservations.some(
                    isReservationActive,
                  ),
              ).length;

            return (
              <div
                key={key}
                className="border border-[#E3E0D8] bg-white"
              >
                <div className="flex flex-col gap-3 border-b border-[#EEEAE3] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-[#263A2D]">
                      {
                        group.title
                      }
                    </h2>

                    <p className="mt-1 text-xs text-[#8B8E87]">
                      {
                        group.rooms
                          .length
                      }{" "}
                      fiziksel oda
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#F1EFEA] px-3 py-2 text-xs font-medium text-[#666C65]">
                      {
                        occupiedCount
                      }
                      /
                      {
                        group.rooms
                          .length
                      }{" "}
                      dolu
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.rooms.map(
                    (
                      room,
                    ) => {
                      const activeReservation =
                        room.reservations.find(
                          isReservationActive,
                        ) ??
                        null;

                      const isOccupied =
                        Boolean(
                          activeReservation,
                        );

                      return (
                        <article
                          key={
                            room.id
                          }
                          className="border border-[#E6E2DA] bg-[#FAF9F6] p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                                  isOccupied
                                    ? "bg-[#F4EBDC] text-[#8A642F]"
                                    : "bg-[#E6EFE6] text-[#486348]"
                                }`}
                              >
                                <BedDouble
                                  size={
                                    18
                                  }
                                />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-[#263A2D]">
                                  {
                                    room.room_name
                                  }
                                </p>

                                <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#969990]">
                                  {
                                    room.room_number
                                  }
                                </p>
                              </div>
                            </div>

                            {isOccupied ? (
                              <span className="inline-flex shrink-0 items-center gap-1 bg-[#F4EBDC] px-2 py-1 text-[10px] font-medium text-[#8A642F]">
                                <Clock3
                                  size={
                                    12
                                  }
                                />
                                Dolu
                              </span>
                            ) : (
                              <span className="inline-flex shrink-0 items-center gap-1 bg-[#E6EFE6] px-2 py-1 text-[10px] font-medium text-[#486348]">
                                <CheckCircle2
                                  size={
                                    12
                                  }
                                />
                                Müsait
                              </span>
                            )}
                          </div>

                          {activeReservation ? (
                            <div className="mt-4 border-t border-[#E8E4DC] pt-4">
                              <p className="text-[10px] uppercase tracking-[0.1em] text-[#969990]">
                                Aktif
                                Rezervasyon
                              </p>

                              <p className="mt-2 text-xs font-semibold text-[#263A2D]">
                                {
                                  activeReservation.reservation_code
                                }
                              </p>

                              <p className="mt-1 text-xs text-[#6D726B]">
                                {
                                  activeReservation.guest_name
                                }
                              </p>

                              <p className="mt-2 text-[11px] text-[#8B8E87]">
                                {formatDate(
                                  activeReservation.check_in,
                                )}
                                {" → "}
                                {formatDate(
                                  activeReservation.check_out,
                                )}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-4 border-t border-[#E8E4DC] pt-4">
                              <p className="text-xs text-[#969990]">
                                Aktif
                                rezervasyon
                                bulunmuyor.
                              </p>
                            </div>
                          )}

                          {!room.is_active && (
                            <div className="mt-3 flex items-center gap-2 bg-[#F3E2DE] p-2 text-[10px] text-[#9C5148]">
                              <XCircle
                                size={
                                  13
                                }
                              />

                              Oda kullanım
                              dışı
                            </div>
                          )}
                        </article>
                      );
                    },
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}