import type { Reservation, ReservationStatus } from "@/types/reservation";

export type ReservationsListProps = {
  reservations: Reservation[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pendingCount: number;
  activeStatus: ReservationStatus | "all";
  initialSearch: string;
  pageSize: number;
};
