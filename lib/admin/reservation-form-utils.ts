import type { AdminReservationAccommodation } from "@/types/admin-reservation";

export function getTurkeyToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getDefaultAdultCount(
  accommodation: AdminReservationAccommodation | null | undefined,
) {
  if (!accommodation) {
    return 1;
  }

  return Math.max(1, Math.min(2, accommodation.max_adults, accommodation.max_total_guests));
}
