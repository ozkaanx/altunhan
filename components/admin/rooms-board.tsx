"use client";

import Link from "next/link";

import {
  BedDouble,
  CheckCircle2,
  Clock3,
  DoorClosed,
  XCircle,
} from "lucide-react";

import { useMemo, useState } from "react";

export type RoomReservation = {
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

export type AdminRoom = {
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

type StatusFilter = "all" | "available" | "occupied" | "inactive";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function isReservationActive(reservation: RoomReservation) {
  if (
    reservation.status === "confirmed" ||
    reservation.status === "pending_approval"
  ) {
    return true;
  }

  if (reservation.status === "pending_payment") {
    return (
      new Date(reservation.created_at).getTime() >= Date.now() - 60 * 60 * 1000
    );
  }

  return false;
}

function getReservationForDate(room: AdminRoom, selectedDate: string) {
  return (
    room.reservations.find((reservation) => {
      if (!isReservationActive(reservation)) {
        return false;
      }

      return (
        reservation.check_in <= selectedDate &&
        reservation.check_out > selectedDate
      );
    }) ?? null
  );
}

export function RoomsBoard({ rooms }: { rooms: AdminRoom[] }) {
  const [accommodationFilter, setAccommodationFilter] = useState<
    number | "all"
  >("all");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [selectedDate, setSelectedDate] = useState(getTurkeyToday());

  const accommodationOptions = useMemo(() => {
    const map = new Map<number, string>();

    rooms.forEach((room) => {
      map.set(room.accommodation_id, room.accommodations?.title ?? "Konaklama");
    });

    return Array.from(map.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [rooms]);

  const stats = useMemo(() => {
    const total = rooms.length;

    const inactive = rooms.filter((room) => !room.is_active).length;

    const occupied = rooms.filter(
      (room) =>
        room.is_active && Boolean(getReservationForDate(room, selectedDate)),
    ).length;

    const available = rooms.filter(
      (room) => room.is_active && !getReservationForDate(room, selectedDate),
    ).length;

    return {
      total,
      occupied,
      available,
      inactive,
    };
  }, [rooms, selectedDate]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (
        accommodationFilter !== "all" &&
        room.accommodation_id !== accommodationFilter
      ) {
        return false;
      }

      const reservation = getReservationForDate(room, selectedDate);

      if (statusFilter === "occupied" && !reservation) {
        return false;
      }

      if (statusFilter === "available" && (reservation || !room.is_active)) {
        return false;
      }

      if (statusFilter === "inactive" && room.is_active) {
        return false;
      }

      return true;
    });
  }, [rooms, accommodationFilter, statusFilter, selectedDate]);

  const groupedRooms = useMemo(() => {
    return filteredRooms.reduce<
      Record<
        string,
        {
          title: string;
          rooms: AdminRoom[];
        }
      >
    >((groups, room) => {
      const key = String(room.accommodation_id);

      if (!groups[key]) {
        groups[key] = {
          title: room.accommodations?.title ?? "Konaklama",

          rooms: [],
        };
      }

      groups[key].rooms.push(room);

      return groups;
    }, {});
  }, [filteredRooms]);

  function getTurkeyToday() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }

  return (
    <>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Toplam Oda" value={stats.total} icon={BedDouble} />

        <StatCard label="Dolu" value={stats.occupied} icon={Clock3} />

        <StatCard label="Müsait" value={stats.available} icon={CheckCircle2} />

        <StatCard label="Kullanım Dışı" value={stats.inactive} icon={XCircle} />
      </div>

      <div className="mt-5 flex flex-col gap-3 border border-[#E3E0D8] bg-white p-4 lg:flex-row lg:items-center">
        <div className="w-full lg:max-w-[210px]">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#92968F]">
            Doluluk Tarihi
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none"
          />
        </div>
        <div className="w-full lg:max-w-[280px]">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#92968F]">
            Oda Tipi
          </label>

          <select
            value={accommodationFilter}
            onChange={(event) => {
              const value = event.target.value;

              setAccommodationFilter(value === "all" ? "all" : Number(value));
            }}
            className="h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none"
          >
            <option value="all">Tüm oda tipleri</option>

            {accommodationOptions.map((accommodation) => (
              <option key={accommodation.id} value={accommodation.id}>
                {accommodation.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 flex flex-col gap-4 border border-[#E3E0D8] bg-white p-4 lg:flex-row lg:items-end">
          {[
            ["all", "Tümü"],
            ["available", "Müsait"],
            ["occupied", "Dolu"],
            ["inactive", "Kullanım Dışı"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value as StatusFilter)}
              className={`h-10 px-4 text-xs font-semibold ${
                statusFilter === value
                  ? "bg-[#263A2D] text-white"
                  : "border border-[#DDD9D1] bg-white text-[#626860]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-[#8B8E87] lg:ml-auto">
          {filteredRooms.length} oda gösteriliyor
        </p>
      </div>

      <div className="mt-7 space-y-8">
        {Object.entries(groupedRooms).map(([key, group]) => {
          const occupiedCount = group.rooms.filter((room) =>
            Boolean(getReservationForDate(room, selectedDate)),
          ).length;

          return (
            <div key={key} className="border border-[#E3E0D8] bg-white">
              <div className="flex flex-col gap-3 border-b border-[#EEEAE3] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-[#263A2D]">
                    {group.title}
                  </h2>

                  <p className="mt-1 text-xs text-[#8B8E87]">
                    {group.rooms.length} oda gösteriliyor
                  </p>
                </div>

                <span className="bg-[#F1EFEA] px-3 py-2 text-xs font-medium text-[#666C65]">
                  {occupiedCount}/{group.rooms.length} dolu
                </span>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.rooms.map((room) => {
                  const activeReservation = getReservationForDate(
                    room,
                    selectedDate,
                  );

                  const isOccupied = Boolean(activeReservation);

                  return (
                    <article
                      key={room.id}
                      className="border border-[#E6E2DA] bg-[#FAF9F6] p-4"
                    >
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
                            {formatDate(activeReservation.check_in)}
                            {" → "}
                            {formatDate(activeReservation.check_out)}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 border-t border-[#E8E4DC] pt-4">
                          <p className="text-xs text-[#969990]">
                            Aktif rezervasyon bulunmuyor.
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredRooms.length === 0 && (
          <div className="border border-[#E3E0D8] bg-white px-5 py-14 text-center">
            <BedDouble size={26} className="mx-auto text-[#A7AAA4]" />

            <p className="mt-4 text-sm font-semibold text-[#263A2D]">
              Filtreye uygun oda bulunamadı
            </p>

            <p className="mt-2 text-xs text-[#8B8E87]">
              Oda tipi veya durum filtresini değiştirin.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof BedDouble;
}) {
  return (
    <div className="border border-[#E3E0D8] bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#92968F]">
          {label}
        </p>

        <Icon size={17} className="text-[#A8754F]" />
      </div>

      <p className="mt-3 text-3xl font-semibold text-[#263A2D]">{value}</p>
    </div>
  );
}

function StatusBadge({
  type,
}: {
  type: "available" | "occupied" | "inactive";
}) {
  if (type === "occupied") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 bg-[#F4EBDC] px-2 py-1 text-[10px] font-medium text-[#8A642F]">
        <Clock3 size={12} />
        Dolu
      </span>
    );
  }

  if (type === "inactive") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 bg-[#F3E2DE] px-2 py-1 text-[10px] font-medium text-[#9C5148]">
        <XCircle size={12} />
        Kapalı
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 bg-[#E6EFE6] px-2 py-1 text-[10px] font-medium text-[#486348]">
      <CheckCircle2 size={12} />
      Müsait
    </span>
  );
}
