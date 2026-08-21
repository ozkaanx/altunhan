"use server";

import { createClient } from "@/lib/supabase/server";

import type {
  AccommodationBusyRange,
  BedConfigurationAvailability,
  PublicBedConfiguration,
} from "@/types/public-reservation";

type AccommodationBusyRangeRpc = {
  check_in: string;
  check_out: string;
};

type AvailabilityResult =
  | {
      success: true;
      ranges: AccommodationBusyRange[];
    }
  | {
      success: false;
      ranges: [];
      message: string;
    };

export async function getAccommodationBusyRanges(
  accommodationId: number,
): Promise<AvailabilityResult> {
  if (!accommodationId) {
    return {
      success: false,
      ranges: [],
      message: "Konaklama seçilemedi.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_accommodation_busy_ranges", {
    p_accommodation_id: accommodationId,
  });

  if (error) {
    console.error("Dolu tarihler alınamadı:", error);

    return {
      success: false,
      ranges: [],
      message: "Müsaitlik bilgisi alınamadı.",
    };
  }

  const ranges =
    (data as AccommodationBusyRangeRpc[] | null)?.map((item) => ({
      checkIn: item.check_in,
      checkOut: item.check_out,
    })) ?? [];

  return {
    success: true,
    ranges,
  };
}

type BedConfigurationAvailabilityRpc = {
  bed_configuration: PublicBedConfiguration;
  max_guests: number;
  available_count: number;
  is_available: boolean;
};

type BedConfigurationAvailabilityResult =
  | {
      success: true;
      options: BedConfigurationAvailability[];
    }
  | {
      success: false;
      options: [];
      message: string;
    };

export async function getBedConfigurationAvailability(
  accommodationId: number,
  checkIn: string,
  checkOut: string,
  guestCount: number,
): Promise<BedConfigurationAvailabilityResult> {
  if (!Number.isInteger(accommodationId) || accommodationId <= 0) {
    return {
      success: false,
      options: [],
      message: "Konaklama seçilemedi.",
    };
  }

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return {
      success: false,
      options: [],
      message: "Geçerli bir tarih aralığı seçin.",
    };
  }

  if (!Number.isInteger(guestCount) || guestCount < 1) {
    return {
      success: false,
      options: [],
      message: "Misafir sayısı geçersiz.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_public_bed_configuration_availability",
    {
      p_accommodation_id: accommodationId,
      p_check_in: checkIn,
      p_check_out: checkOut,
      p_guest_count: guestCount,
    },
  );

  if (error) {
    console.error("Yatak tipi müsaitliği alınamadı:", error);

    return {
      success: false,
      options: [],
      message: error.message ?? "Yatak tipi müsaitliği alınamadı.",
    };
  }

  const options =
    (data as BedConfigurationAvailabilityRpc[] | null)?.map((item) => ({
      bedConfiguration: item.bed_configuration,
      maxGuests: Number(item.max_guests),
      availableCount: Number(item.available_count),
      isAvailable: Boolean(item.is_available),
    })) ?? [];

  return {
    success: true,
    options,
  };
}

