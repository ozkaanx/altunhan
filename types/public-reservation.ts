export type PublicAccommodation = {
  id: number;
  title: string;
  short_description: string | null;
  price: number;
  capacity: number;
  slug: string;
};

export type ReservationCreateInput = {
  accommodationId: number;
  checkIn: string;
  checkOut: string;
  guestCount: number;

  guestName: string;
  guestPhone: string;
  guestEmail: string;
};

export type ReservationCreateResult =
  | {
      success: true;

      reservation: {
        id: number;
        reservationCode: string;
        accommodationTitle: string;

        checkIn: string;
        checkOut: string;

        nightCount: number;
        totalPrice: number;
      };
    }
  | {
      success: false;
      message: string;
    };