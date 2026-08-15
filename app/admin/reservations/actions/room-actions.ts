"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";

type AvailableReservationRoomRpc = {
  room_id: number | string;
  room_name: string;
  room_number: string | null;
  is_current: boolean;
  is_available: boolean;
};

type AvailableRoomRpc = {
  room_id: number | string;
  room_name: string;
  room_number: string | null;
};

function isValidId(value: number) {
  return Number.isInteger(value) && value > 0;
}

export async function getAvailableRooms(reservationId: number) {
  if (!isValidId(reservationId)) {
    return {
      success: false as const,
      message: "Geçersiz rezervasyon.",
      rooms: [],
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
      rooms: [],
    };
  }

  const { data, error } = await auth.supabase.rpc("get_available_rooms_for_reservation", {
    p_reservation_id: reservationId,
  });

  if (error) {
    console.error("Müsait odalar alınamadı:", error);

    return {
      success: false as const,
      message: error.message ?? "Müsait odalar alınamadı.",
      rooms: [],
    };
  }

  const rooms = ((data ?? []) as AvailableReservationRoomRpc[]).map((room) => ({
    id: Number(room.room_id),
    roomName: room.room_name,
    roomNumber: room.room_number,
    isCurrent: Boolean(room.is_current),
    isAvailable: Boolean(room.is_available),
  }));

  return {
    success: true as const,
    rooms,
  };
}

export async function changeReservationRoom(reservationId: number, roomId: number) {
  if (!isValidId(reservationId) || !isValidId(roomId)) {
    return {
      success: false as const,
      message: "Rezervasyon veya oda bilgisi geçersiz.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase.rpc("change_reservation_room", {
    p_reservation_id: reservationId,
    p_room_id: roomId,
  });

  if (error || !data) {
    console.error("Rezervasyon odası değiştirilemedi:", error);

    return {
      success: false as const,
      message: error?.message ?? "Oda değiştirilemedi.",
    };
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/rooms");
  revalidatePath("/admin");

  return {
    success: true as const,
  };
}

export async function getAvailableRoomsForDates(
  accommodationId: number,
  checkIn: string,
  checkOut: string,
) {
  if (!isValidId(accommodationId) || !checkIn || !checkOut) {
    return {
      success: false as const,
      message: "Oda tipi ve tarihler zorunludur.",
      rooms: [],
    };
  }

  if (checkOut <= checkIn) {
    return {
      success: false as const,
      message: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
      rooms: [],
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
      rooms: [],
    };
  }

  const { data, error } = await auth.supabase.rpc("get_available_rooms_for_dates", {
    p_accommodation_id: accommodationId,
    p_check_in: checkIn,
    p_check_out: checkOut,
  });

  if (error) {
    console.error("Müsait odalar alınamadı:", error);

    return {
      success: false as const,
      message: error.message,
      rooms: [],
    };
  }

  const rooms = ((data ?? []) as AvailableRoomRpc[]).map((room) => ({
    id: Number(room.room_id),
    roomName: room.room_name,
    roomNumber: room.room_number,
  }));

  return {
    success: true as const,
    rooms,
  };
}
