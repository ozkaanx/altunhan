import type {
  AccommodationBusyRange,
} from "@/app/rezervasyon/action";

export function getTurkeyToday() {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        "Europe/Istanbul",
      year:
        "numeric",
      month:
        "2-digit",
      day:
        "2-digit",
    },
  ).format(
    new Date(),
  );
}

export function formatReservationDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day:
        "numeric",
      month:
        "short",
      year:
        "numeric",
    },
  ).format(
    new Date(
      `${value}T00:00:00`,
    ),
  );
}

export function isDateInsideBusyRange(
  date: string,
  range: AccommodationBusyRange,
) {
  return (
    date >=
      range.checkIn &&
    date <
      range.checkOut
  );
}

export function reservationOverlapsRange(
  checkIn: string,
  checkOut: string,
  range: AccommodationBusyRange,
) {
  return (
    checkIn <
      range.checkOut &&
    checkOut >
      range.checkIn
  );
}

export function calculateNightCount(
  checkIn: string,
  checkOut: string,
) {
  if (
    !checkIn ||
    !checkOut
  ) {
    return 0;
  }

  const start =
    new Date(
      `${checkIn}T00:00:00Z`,
    );

  const end =
    new Date(
      `${checkOut}T00:00:00Z`,
    );

  const millisecondsPerDay =
    1000 *
    60 *
    60 *
    24;

  return Math.max(
    0,
    Math.round(
      (
        end.getTime() -
        start.getTime()
      ) /
        millisecondsPerDay,
    ),
  );
}