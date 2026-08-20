import type { ReservationPaymentMethod } from "@/types/reservation";

export type AdminReservationAccommodation = {
  id: number;
  title: string;
  capacity: number;
  price: number;
  max_adults: number;
  max_children: number;
  max_total_guests: number;
};

export type AdminAvailableRoom = {
  id: number;
  roomName: string;
  roomNumber: string | null;
};

export type ReservationSource = "phone" | "whatsapp" | "walk_in" | "admin";

export type AdminInitialPaymentMethod = ReservationPaymentMethod;

export type AdminReservationFormProps = {
  accommodations: AdminReservationAccommodation[];
};
