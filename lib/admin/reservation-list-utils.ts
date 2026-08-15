import type { ReservationStatus } from "@/types/reservation";

export const reservationStatusFilters: Array<ReservationStatus | "all"> = [
  "all",
  "pending_approval",
  "pending_payment",
  "confirmed",
  "rejected",
  "cancelled",
];

export function getReservationStatusClass(status: ReservationStatus) {
  switch (status) {
    case "pending_payment":
      return "bg-[#F4EBDC] text-[#8A642F]";

    case "pending_approval":
      return "bg-[#EAE6F4] text-[#655D8A]";

    case "confirmed":
      return "bg-[#E6EFE6] text-[#486348]";

    case "rejected":
      return "bg-[#F3E2DE] text-[#9C5148]";

    case "cancelled":
      return "bg-[#E7E9EA] text-[#5F676B]";
  }
}

export function getVisibleReservationPages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
}
