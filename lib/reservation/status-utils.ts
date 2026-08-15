import type { ReservationStatus } from "@/types/reservation";

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  pending_payment: "Ödeme Bekleniyor",
  pending_approval: "Onay Bekliyor",
  confirmed: "Onaylandı",
  rejected: "Reddedildi",
  cancelled: "İptal Edildi",
};

export function getReservationStatusLabel(status: ReservationStatus) {
  return reservationStatusLabels[status];
}
