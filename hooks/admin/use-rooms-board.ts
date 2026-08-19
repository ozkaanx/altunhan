"use client";

import { useMemo, useState } from "react";

import {
  addDaysToDate,
  getReservationsForRange,
  getTurkeyToday,
} from "@/lib/admin/room-board-utils";

import type { AdminRoom, RoomStatusFilter } from "@/types/admin-room";

export function useRoomsBoard(rooms: AdminRoom[]) {
  const [accommodationFilter, setAccommodationFilter] = useState<number | "all">("all");

  const [statusFilter, setStatusFilter] = useState<RoomStatusFilter>("all");

  const [checkIn, setCheckIn] = useState(getTurkeyToday);

  const [checkOut, setCheckOut] = useState(() => addDaysToDate(getTurkeyToday(), 1));

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
      (room) => room.is_active && getReservationsForRange(room, checkIn, checkOut).length > 0,
    ).length;

    const available = rooms.filter(
      (room) => room.is_active && getReservationsForRange(room, checkIn, checkOut).length === 0,
    ).length;

    return {
      total,
      occupied,
      available,
      inactive,
    };
  }, [rooms, checkIn, checkOut]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (accommodationFilter !== "all" && room.accommodation_id !== accommodationFilter) {
        return false;
      }

      const hasReservation = getReservationsForRange(room, checkIn, checkOut).length > 0;

      if (statusFilter === "occupied" && !hasReservation) {
        return false;
      }

      if (statusFilter === "available" && (hasReservation || !room.is_active)) {
        return false;
      }

      if (statusFilter === "inactive" && room.is_active) {
        return false;
      }

      return true;
    });
  }, [rooms, accommodationFilter, statusFilter, checkIn, checkOut]);

  const handleCheckInChange = (value: string) => {
    if (!value) {
      return;
    }

    setCheckIn(value);

    if (value && (!checkOut || checkOut <= value)) {
      setCheckOut(addDaysToDate(value, 1));
    }
  };

  const handleCheckOutChange = (value: string) => {
    if (value && value > checkIn) {
      setCheckOut(value);
    }
  };

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
    checkIn,
    checkOut,
    handleCheckInChange,
    handleCheckOutChange,
    accommodationOptions,
    stats,
    filteredRooms,
    groupedRooms,
  };
}
