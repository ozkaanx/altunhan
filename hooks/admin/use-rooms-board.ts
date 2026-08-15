"use client";

import { useMemo, useState } from "react";

import { getReservationForDate, getTurkeyToday } from "@/lib/admin/room-board-utils";

import type { AdminRoom, RoomStatusFilter } from "@/types/admin-room";

export function useRoomsBoard(rooms: AdminRoom[]) {
  const [accommodationFilter, setAccommodationFilter] = useState<number | "all">("all");

  const [statusFilter, setStatusFilter] = useState<RoomStatusFilter>("all");

  const [selectedDate, setSelectedDate] = useState(getTurkeyToday);

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
      (room) => room.is_active && Boolean(getReservationForDate(room, selectedDate)),
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
      if (accommodationFilter !== "all" && room.accommodation_id !== accommodationFilter) {
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

  return {
    accommodationFilter,
    setAccommodationFilter,
    statusFilter,
    setStatusFilter,
    selectedDate,
    setSelectedDate,
    accommodationOptions,
    stats,
    filteredRooms,
    groupedRooms,
  };
}
