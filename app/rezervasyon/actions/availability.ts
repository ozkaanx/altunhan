"use server";

import {
  createClient,
} from "@/lib/supabase/server";

export type AccommodationBusyRange = {
  checkIn: string;
  checkOut: string;
};

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
      message:
        "Konaklama seçilemedi.",
    };
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_accommodation_busy_ranges",
    {
      p_accommodation_id:
        accommodationId,
    },
  );

  if (error) {
    console.error(
      "Dolu tarihler alınamadı:",
      error,
    );

    return {
      success: false,
      ranges: [],
      message:
        "Müsaitlik bilgisi alınamadı.",
    };
  }

  const ranges =
    (
      data as
        | AccommodationBusyRangeRpc[]
        | null
    )?.map(
      (item) => ({
        checkIn:
          item.check_in,
        checkOut:
          item.check_out,
      }),
    ) ?? [];

  return {
    success: true,
    ranges,
  };
}