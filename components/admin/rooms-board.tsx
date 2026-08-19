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
    checkIn,
    checkOut,
    handleCheckInChange,
    handleCheckOutChange,
    accommodationOptions,
    stats,
    filteredRooms,
    groupedRooms,
  } = useRoomsBoard(rooms);

  return (
    <>
      <RoomsBoardControls
        stats={stats}
        checkIn={checkIn}
        checkOut={checkOut}
        accommodationFilter={accommodationFilter}
        statusFilter={statusFilter}
        accommodationOptions={accommodationOptions}
        roomCount={filteredRooms.length}
        onCheckInChange={handleCheckInChange}
        onCheckOutChange={handleCheckOutChange}
        onAccommodationChange={setAccommodationFilter}
        onStatusChange={setStatusFilter}
      />

      <RoomsGroups
        groupedRooms={groupedRooms}
        checkIn={checkIn}
        checkOut={checkOut}
        filteredRoomCount={filteredRooms.length}
      />
    </>
  );
}
