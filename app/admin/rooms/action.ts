"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";

import type { BedConfiguration } from "@/types/admin-room";

const allowedBedConfigurations = new Set<BedConfiguration>([
  "one_double",
  "double_single",
  "two_double",
]);

export async function updateRoomBedConfiguration(
  roomId: number,
  bedConfiguration: BedConfiguration | null,
) {
  if (!Number.isInteger(roomId) || roomId <= 0) {
    return {
      success: false as const,
      message: "Geçersiz oda.",
    };
  }

  if (bedConfiguration !== null && !allowedBedConfigurations.has(bedConfiguration)) {
    return {
      success: false as const,
      message: "Geçersiz yatak düzeni.",
    };
  }

  const auth = await requireAdmin();

  if (!auth.success) {
    return {
      success: false as const,
      message: auth.message,
    };
  }

  const { data, error } = await auth.supabase
    .from("rooms")
    .update({
      bed_configuration: bedConfiguration,
    })
    .eq("id", roomId)
    .select("id, bed_configuration, max_guests")
    .single();

  if (error || !data) {
    console.error("Oda yatak düzeni güncellenemedi:", error);

    return {
      success: false as const,
      message: error?.message ?? "Yatak düzeni güncellenemedi.",
    };
  }

  revalidatePath("/admin/rooms");

  return {
    success: true as const,
    room: {
      id: Number(data.id),
      bedConfiguration: data.bed_configuration as BedConfiguration | null,
      maxGuests: data.max_guests === null ? null : Number(data.max_guests),
    },
  };
}
