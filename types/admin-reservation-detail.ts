import type { Reservation } from "@/types/reservation";

export type ReservationRoomOption = {
  id: number;
  roomName: string;
  roomNumber: string | null;
  isCurrent: boolean;
  isAvailable: boolean;
};

export type ReservationDrawerAction = "reject" | "cancel";

export type ReservationActionResult = {
  success: boolean;
  message?: string;
};

export type ReservationDetailDrawerProps = {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
  onApprove: (reservation: Reservation) => Promise<ReservationActionResult>;
  onReject: (reservation: Reservation, reason: string) => Promise<ReservationActionResult>;
  onCancel: (reservation: Reservation, reason: string) => Promise<ReservationActionResult>;
};
