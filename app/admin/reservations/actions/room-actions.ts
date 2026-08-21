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
  bed_configuration: "one_double" | "double_single" | "two_double" | null;
  max_guests: number | string | null;
};

type UpdatedReservationDatesRpc = {
  updated_check_in: string;
  updated_check_out: string;
  updated_night_count: number | string;
  updated_total_price: number | string;
  updated_room_id: number | string;
  updated_room_name: string;
  updated_room_number: string | null;
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

  const baseRooms = ((data ?? []) as AvailableReservationRoomRpc[]).map((room) => ({
    id: Number(room.room_id),
    roomName: room.room_name,
    roomNumber: room.room_number,
    isCurrent: Boolean(room.is_current),
    isAvailable: Boolean(room.is_available),
  }));

  if (baseRooms.length === 0) {
    return {
      success: true as const,
      rooms: [],
    };
  }

  const { data: roomDetails, error: roomDetailsError } = await auth.supabase
    .from("rooms")
    .select("id, bed_configuration, max_guests")
    .in(
      "id",
      baseRooms.map((room) => room.id),
    );

  if (roomDetailsError) {
    console.error("Oda yatak bilgileri alınamadı:", roomDetailsError);
  }

  const roomDetailsById = new Map(
    (roomDetails ?? []).map((room) => [
      Number(room.id),
      {
        bedConfiguration: room.bed_configuration as
          | "one_double"
          | "double_single"
          | "two_double"
          | null,
        maxGuests: room.max_guests === null ? null : Number(room.max_guests),
      },
    ]),
  );

  const rooms = baseRooms.map((room) => {
    const details = roomDetailsById.get(room.id);

    return {
      ...room,
      bedConfiguration: details?.bedConfiguration ?? null,
      maxGuests: details?.maxGuests ?? null,
    };
  });

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
  guestCount: number,
) {
  if (!isValidId(accommodationId) || !checkIn || !checkOut) {
    return {
      success: false as const,
      message: "Oda tipi ve tarihler zorunludur.",
      rooms: [],
    };
  }

  if (!Number.isInteger(guestCount) || guestCount < 1) {
    return {
      success: false as const,
      message: "Misafir sayısı en az 1 olmalıdır.",
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

  const { data, error } = await auth.supabase.rpc("get_available_rooms_for_dates_v2", {
    p_accommodation_id: accommodationId,
    p_check_in: checkIn,
    p_check_out: checkOut,
    p_guest_count: guestCount,
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
    bedConfiguration: room.bed_configuration,
    maxGuests: room.max_guests === null ? null : Number(room.max_guests),
  }));

  return {
    success: true as const,
    rooms,
  };
}

export async function getAvailableRoomsForReservationDates(
  reservationId: number,
  checkIn: string,
  checkOut: string,
) {
  if (!isValidId(reservationId) || !checkIn || !checkOut) {
    return {
      success: false as const,
      message: "Rezervasyon ve tarihler zorunludur.",
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

  const { data, error } = await auth.supabase.rpc("get_available_rooms_for_reservation_dates", {
    p_reservation_id: reservationId,
    p_check_in: checkIn,
    p_check_out: checkOut,
  });

  if (error) {
    console.error("Tarih değişikliği için müsait odalar alınamadı:", error);

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

export async function updateReservationDates(
  reservationId: number,
  checkIn: string,
  checkOut: string,
  roomId: number,
) {
  if (!isValidId(reservationId) || !isValidId(roomId) || !checkIn || !checkOut) {
    return {
      success: false as const,
      message: "Rezervasyon, oda ve tarihler zorunludur.",
    };
  }

  if (checkOut <= checkIn) {
    return {
      success: false as const,
      message: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase.rpc("update_admin_reservation_dates", {
    p_reservation_id: reservationId,
    p_check_in: checkIn,
    p_check_out: checkOut,
    p_room_id: roomId,
  });

  if (error) {
    console.error("Rezervasyon tarihleri güncellenemedi:", error);

    return {
      success: false as const,
      message: error.message ?? "Rezervasyon tarihleri güncellenemedi.",
    };
  }

  const updatedReservation = ((data ?? []) as UpdatedReservationDatesRpc[])[0];

  if (!updatedReservation) {
    return {
      success: false as const,
      message: "Rezervasyon tarihleri güncellenemedi.",
    };
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/rooms");
  revalidatePath("/admin");
  revalidatePath("/rezervasyon");

  return {
    success: true as const,
    reservation: {
      checkIn: updatedReservation.updated_check_in,
      checkOut: updatedReservation.updated_check_out,
      nightCount: Number(updatedReservation.updated_night_count),
      totalPrice: Number(updatedReservation.updated_total_price),
      roomId: Number(updatedReservation.updated_room_id),
      roomName: updatedReservation.updated_room_name,
      roomNumber: updatedReservation.updated_room_number,
    },
  };
}
