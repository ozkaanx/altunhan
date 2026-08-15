import type { ReservationStatus } from "@/types/reservation";

export type ReservationTrackingResult = {
  reservationCode: string;

  guestName: string;

  accommodationTitle: string;

  checkIn: string;

  checkOut: string;

  adultCount: number;

  childCount: number;

  nightCount: number;

  totalPrice: number;

  status: ReservationStatus;

  hasReceipt: boolean;

  rejectionReason: string | null;

  cancellationReason: string | null;
};

export type ReservationTrackingResponse =
  | {
      success: true;
      reservation: ReservationTrackingResult;
    }
  | {
      success: false;
      message: string;
    };
