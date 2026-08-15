"use client";

import type { AdminRoom } from "@/types/admin-room";

import { useRoomsBoard } from "@/hooks/admin/use-rooms-board";

import { RoomsBoardControls } from "@/components/admin/rooms-board/rooms-board-controls";
import { RoomsGroups } from "@/components/admin/rooms-board/rooms-groups";

export function RoomsBoard({ rooms }: { rooms: AdminRoom[] }) {
  const {
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
  } = useRoomsBoard(rooms);

  return (
    <>
      <RoomsBoardControls
        stats={stats}
        selectedDate={selectedDate}
        accommodationFilter={accommodationFilter}
        statusFilter={statusFilter}
        accommodationOptions={accommodationOptions}
        roomCount={filteredRooms.length}
        onDateChange={setSelectedDate}
        onAccommodationChange={setAccommodationFilter}
        onStatusChange={setStatusFilter}
      />

      <RoomsGroups
        groupedRooms={groupedRooms}
        selectedDate={selectedDate}
        filteredRoomCount={filteredRooms.length}
      />
    </>
  );
}
