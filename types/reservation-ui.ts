export type CreatedReservation = {
  id: number;
  reservationCode: string;
  accommodationTitle: string;
  checkIn: string;
  checkOut: string;
  nightCount: number;
  totalPrice: number;
};

export type ReservationContact = {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
};
