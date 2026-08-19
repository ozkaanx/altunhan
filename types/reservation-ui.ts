export type CreatedReservation = {
  id: number;
  reservationCode: string;
  accommodationTitle: string;
  checkIn: string;
  checkOut: string;
  nightCount: number;
  totalPrice: number;
  paymentPlan: "deposit" | "full";
  depositTargetAmount: number;
  amountDueNow: number;
};

export type ReservationContact = {
  guestName: string;
  guestIdentityNumber: string;
  guestPhone: string;
  guestEmail: string;
};
