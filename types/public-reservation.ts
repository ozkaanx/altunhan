export type PublicAccommodation = {
  id: number;
  title: string;
  short_description: string | null;
  price: number;
  capacity: number;
  slug: string;

  max_adults: number;
  max_children: number;
  max_total_guests: number;
};

export type ReservationCreateInput = {
  accommodationId: number;

  checkIn: string;
  checkOut: string;

  adultCount: number;
  childCount: number;

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
