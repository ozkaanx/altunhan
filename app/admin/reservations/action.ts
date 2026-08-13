"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

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

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      success: false as const,

      supabase,

      message: "Bu işlem için yönetici girişi yapmanız gerekiyor.",
    };
  }

  return {
    success: true as const,

    supabase,
  };
}

export async function approveReservation(id: number) {
  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false,
      message: auth.message,
    };
  }

  const { supabase } = auth;

  const { data, error } = await supabase
    .from("reservations")
    .update({
      status: "confirmed",

      rejection_reason: null,

      cancellation_reason: null,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending_approval")
    .select("id");

  if (error) {
    console.error("Rezervasyon onaylanamadı:", error);

    return {
      success: false,
      message: error.message,
    };
  }

  if (!data?.length) {
    return {
      success: false,
      message: "Rezervasyon bulunamadı veya artık onay beklemiyor.",
    };
  }

  revalidatePath("/admin/reservations");

  revalidatePath("/admin");

  revalidatePath("/rezervasyon/takip");

  return {
    success: true,
  };
}

export async function rejectReservation(id: number, reason: string) {
  const cleanReason = reason.trim();

  if (cleanReason.length < 5) {
    return {
      success: false,
      message: "Lütfen en az 5 karakterlik bir red sebebi yazın.",
    };
  }

  if (cleanReason.length > 500) {
    return {
      success: false,
      message: "Red sebebi en fazla 500 karakter olabilir.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false,
      message: auth.message,
    };
  }

  const { supabase } = auth;

  const { data, error } = await supabase
    .from("reservations")
    .update({
      status: "rejected",

      rejection_reason: cleanReason,

      cancellation_reason: null,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending_approval")
    .select("id");

  if (error) {
    console.error("Rezervasyon reddedilemedi:", error);

    return {
      success: false,
      message: error.message,
    };
  }

  if (!data?.length) {
    return {
      success: false,
      message: "Rezervasyon bulunamadı veya artık onay beklemiyor.",
    };
  }

  revalidatePath("/admin/reservations");

  revalidatePath("/admin");

  revalidatePath("/rezervasyon/takip");

  return {
    success: true,
  };
}

export async function cancelReservation(id: number, reason: string) {
  const cleanReason = reason.trim();

  if (cleanReason.length < 5) {
    return {
      success: false,
      message: "Lütfen en az 5 karakterlik bir iptal sebebi yazın.",
    };
  }

  if (cleanReason.length > 500) {
    return {
      success: false,
      message: "İptal sebebi en fazla 500 karakter olabilir.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false,
      message: auth.message,
    };
  }

  const { supabase } = auth;

  const { data, error } = await supabase
    .from("reservations")
    .update({
      status: "cancelled",

      cancellation_reason: cleanReason,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "confirmed")
    .select("id");

  if (error) {
    console.error("Rezervasyon iptal edilemedi:", error);

    return {
      success: false,
      message: error.message,
    };
  }

  if (!data?.length) {
    return {
      success: false,
      message:
        "Rezervasyon bulunamadı veya artık iptal edilebilir durumda değil.",
    };
  }

  revalidatePath("/admin/reservations");

  revalidatePath("/admin");

  revalidatePath("/rezervasyon/takip");

  return {
    success: true,
  };
}

export async function getAvailableRooms(reservationId: number) {
  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
      rooms: [],
    };
  }

  const { supabase } = auth;

  const { data, error } = await supabase.rpc(
    "get_available_rooms_for_reservation",
    {
      p_reservation_id: reservationId,
    },
  );

  if (error) {
    console.error("Müsait odalar alınamadı:", error);

    return {
      success: false as const,
      message: error.message ?? "Müsait odalar alınamadı.",
      rooms: [],
    };
  }

  return {
    success: true as const,
    rooms: ((data ?? []) as AvailableReservationRoomRpc[]).map((room) => ({
      id: Number(room.room_id),
      roomName: room.room_name,
      roomNumber: room.room_number,
      isCurrent: Boolean(room.is_current),
      isAvailable: Boolean(room.is_available),
    })),
  };
}

export async function changeReservationRoom(
  reservationId: number,
  roomId: number,
) {
  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { supabase } = auth;

  const { data, error } = await supabase.rpc("change_reservation_room", {
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

export async function getReceiptSignedUrl(storagePath: string) {
  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false,

      message: auth.message,

      url: null,
    };
  }

  const { supabase } = auth;

  const { data, error } = await supabase.storage
    .from("reservation-receipts")
    .createSignedUrl(storagePath, 60 * 10);

  if (error || !data) {
    console.error("Dekont URL oluşturulamadı:", error);

    return {
      success: false,

      message: error?.message ?? "Dekont açılamadı.",

      url: null,
    };
  }

  return {
    success: true,

    url: data.signedUrl,
  };
}

export type CreateAdminReservationInput = {
  accommodationId: number;

  roomId: number | null;

  checkIn: string;

  checkOut: string;

  guestCount: number;

  guestName: string;

  guestPhone: string;

  guestEmail: string;

  status: "pending_payment" | "pending_approval" | "confirmed";

  source: "phone" | "whatsapp" | "walk_in" | "admin";

  adminNote: string;
};

export async function createAdminReservation(
  values: CreateAdminReservationInput,
) {
  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,

      message: auth.message,
    };
  }

  const { supabase } = auth;

  const { data, error } = await supabase.rpc("create_admin_reservation", {
    p_accommodation_id: values.accommodationId,

    p_room_id: values.roomId,

    p_check_in: values.checkIn,

    p_check_out: values.checkOut,

    p_guest_count: values.guestCount,

    p_guest_name: values.guestName,

    p_guest_phone: values.guestPhone,

    p_guest_email: values.guestEmail || null,

    p_status: values.status,

    p_source: values.source,

    p_admin_note: values.adminNote || null,
  });

  if (error) {
    console.error("Manuel rezervasyon oluşturulamadı:", error);

    return {
      success: false as const,

      message: error.message,
    };
  }

  const reservation = data?.[0];

  if (!reservation) {
    return {
      success: false as const,

      message: "Rezervasyon oluşturulamadı.",
    };
  }

  revalidatePath("/admin/reservations");

  revalidatePath("/admin/rooms");

  revalidatePath("/admin");

  revalidatePath("/rezervasyon");

  return {
    success: true as const,

    reservation: {
      id: Number(reservation.reservation_id),

      reservationCode: reservation.reservation_code,

      roomId: Number(reservation.room_id),

      roomName: reservation.room_name,

      roomNumber: reservation.room_number,

      totalPrice: Number(reservation.total_price),
    },
  };
}

export async function getAvailableRoomsForDates(
  accommodationId: number,
  checkIn: string,
  checkOut: string,
) {
  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
      rooms: [],
    };
  }

  if (!accommodationId || !checkIn || !checkOut) {
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

  const { supabase } = auth;

  const { data, error } = await supabase.rpc("get_available_rooms_for_dates", {
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

  return {
    success: true as const,
    rooms: ((data ?? []) as AvailableRoomRpc[]).map((room) => ({
      id: Number(room.room_id),
      roomName: room.room_name,
      roomNumber: room.room_number,
    })),
  };
}
