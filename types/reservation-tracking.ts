import type {
  ReservationPaymentPlan,
  ReservationPaymentStatus,
  ReservationStatus,
} from "@/types/reservation";

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

  paymentPlan: ReservationPaymentPlan;

  depositTargetAmount: number;

  confirmedPaymentAmount: number;

  amountDueNow: number;

  remainingPaymentAmount: number;

  paymentStatus: ReservationPaymentStatus;

  status: ReservationStatus;

  hasReceipt: boolean;

  hasPendingReceipt: boolean;

  lastPaymentNote: string | null;

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
