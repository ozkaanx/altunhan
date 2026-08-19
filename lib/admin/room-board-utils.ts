import type { AdminRoom, RoomReservation } from "@/types/admin-room";

export function isReservationActive(reservation: RoomReservation) {
  if (reservation.status === "confirmed" || reservation.status === "pending_approval") {
    return true;
  }

  if (reservation.status === "pending_payment") {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    return new Date(reservation.created_at).getTime() >= oneHourAgo;
  }

  return false;
}

export function getReservationsForRange(room: AdminRoom, checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return [];
  }

  return room.reservations
    .filter((reservation) => {
      if (!isReservationActive(reservation)) {
        return false;
      }

      return reservation.check_in < checkOut && reservation.check_out > checkIn;
    })
    .sort((a, b) => a.check_in.localeCompare(b.check_in));
}

export function addDaysToDate(date: string, days: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "";
  }

  const value = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  value.setUTCDate(value.getUTCDate() + days);

  return value.toISOString().slice(0, 10);
}

export function getTurkeyToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
