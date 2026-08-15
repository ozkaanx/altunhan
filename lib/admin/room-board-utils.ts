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

export function getReservationForDate(room: AdminRoom, selectedDate: string) {
  return (
    room.reservations.find((reservation) => {
      if (!isReservationActive(reservation)) {
        return false;
      }

      return reservation.check_in <= selectedDate && reservation.check_out > selectedDate;
    }) ?? null
  );
}

export function getTurkeyToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
