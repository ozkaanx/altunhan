import type { PublicReservationValues } from "@/lib/reservation/reservation-schema";

export type AccommodationBusyRange = {
  checkIn: string;
  checkOut: string;
};

export type PublicAccommodationImage = {
  id: number;
  image_url: string;
  sort_order: number;
  is_cover: boolean;
};

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

  accommodation_images?: PublicAccommodationImage[];
};

export type ReservationCreateInput = PublicReservationValues;

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
