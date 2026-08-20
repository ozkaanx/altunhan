export type CreatedReservation = {
  id: number;
  reservationCode: string;
  accommodationTitle: string;
  checkIn: string;
  checkOut: string;
  nightCount: number;
  totalPrice: number;
  depositTargetAmount: number;
  amountDueNow: number;
  remainingPaymentAmount: number;
};

export type ReservationContact = {
  guestName: string;
  guestIdentityNumber: string;
  guestPhone: string;
  guestEmail: string;
};
