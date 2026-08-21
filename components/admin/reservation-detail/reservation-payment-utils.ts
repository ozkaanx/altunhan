import type { ReservationPayment, ReservationPaymentMethod } from "@/types/reservation";

export const paymentMethodLabels: Record<ReservationPaymentMethod, string> = {
  bank_transfer: "Havale / EFT",
  cash: "Nakit",
  card: "Kart",
  other: "Diğer",
};

export const paymentTypeLabels: Record<ReservationPayment["payment_type"], string> = {
  deposit: "Kapora",
  balance: "Kalan Ödeme",
  full: "Tam Ödeme",
  refund: "İade",
};

export const paymentStatusLabels: Record<ReservationPayment["status"], string> = {
  pending: "Kontrol Bekliyor",
  confirmed: "Onaylandı",
  rejected: "Reddedildi",
};

export function getConfirmedPaymentTotals(payments: ReservationPayment[]) {
  return payments.reduce(
    (totals, payment) => {
      if (payment.status !== "confirmed") {
        return totals;
      }

      if (payment.payment_type === "refund") {
        totals.refunded += Number(payment.amount);
      } else {
        totals.collected += Number(payment.amount);
      }

      return totals;
    },
    { collected: 0, refunded: 0 },
  );
}

export function formatPaymentDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
