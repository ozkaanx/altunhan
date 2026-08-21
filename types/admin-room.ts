import type { ReservationStatus } from "@/types/reservation";

export type RoomReservation = {
  id: number;
  reservation_code: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  status: ReservationStatus;
  created_at: string;
};

export type BedConfiguration = "one_double" | "double_single" | "two_double";

export type AdminRoom = {
  id: number;
  accommodation_id: number;
  room_name: string;
  room_number: string | null;
  is_active: boolean;
  bed_configuration: BedConfiguration | null;
  max_guests: number | null;
  accommodations: {
    id: number;
    title: string;
  } | null;
  reservations: RoomReservation[];
};

export type RoomStatusFilter = "all" | "available" | "occupied" | "inactive";
