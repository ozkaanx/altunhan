type Gtag = {
  (command: "event", eventName: string, eventParams?: Record<string, unknown>): void;

  (
    command: "get",
    targetId: string,
    fieldName: "client_id" | "session_id",
    callback: (value: string | number | undefined) => void,
  ): void;
};

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

type ReservationCreatedEvent = {
  reservationCode: string;
  accommodationTitle: string;
  nightCount: number;
  totalPrice: number;
};

export function trackReservationCreated({
  reservationCode,
  accommodationTitle,
  nightCount,
  totalPrice,
}: ReservationCreatedEvent) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "reservation_created", {
    value: totalPrice,
    currency: "TRY",

    transaction_id: reservationCode,

    accommodation_name: accommodationTitle,
    nights: nightCount,
  });
}

type ReservationStartedEvent = {
  accommodationTitle?: string;
};

export function trackReservationStarted({ accommodationTitle }: ReservationStartedEvent = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "reservation_started", {
    ...(accommodationTitle
      ? {
          accommodation_name: accommodationTitle,
        }
      : {}),
  });
}
