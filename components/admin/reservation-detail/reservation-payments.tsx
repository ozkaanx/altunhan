"use client";

import { ReservationPaymentForm } from "@/components/admin/reservation-detail/reservation-payment-form";
import { ReservationPaymentHistory } from "@/components/admin/reservation-detail/reservation-payment-history";
import { ReservationPaymentSummary } from "@/components/admin/reservation-detail/reservation-payment-summary";
import { ReservationReceiptReview } from "@/components/admin/reservation-detail/reservation-receipt-review";
import { ReservationRefundForm } from "@/components/admin/reservation-detail/reservation-refund-form";
import { getConfirmedPaymentTotals } from "@/components/admin/reservation-detail/reservation-payment-utils";

import type { Reservation } from "@/types/reservation";

type ReservationPaymentsProps = {
  reservation: Reservation;
  isOpeningReceipt: boolean;
  receiptError: string | null;
  onOpenReceipt: (storagePath: string) => void;
};

export function ReservationPayments({
  reservation,
  isOpeningReceipt,
  receiptError,
  onOpenReceipt,
}: ReservationPaymentsProps) {
  const payments = [...(reservation.reservation_payments ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const pendingPayment = payments.find((payment) => payment.status === "pending") ?? null;
  const { collected: collectedAmount, refunded: refundedAmount } =
    getConfirmedPaymentTotals(payments);

  const netCollectedAmount = Math.max(collectedAmount - refundedAmount, 0);
  const totalPrice = Number(reservation.total_price);
  const isClosedReservation =
    reservation.status === "rejected" || reservation.status === "cancelled";
  const totalRemaining = isClosedReservation ? 0 : Math.max(totalPrice - netCollectedAmount, 0);
  const refundableAmount = netCollectedAmount;
  const canChangePayments = !isClosedReservation;

  return (
    <section className="border border-[#E3E0D8] bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">Ödeme</p>

      <ReservationPaymentSummary
        totalPrice={totalPrice}
        netCollectedAmount={netCollectedAmount}
        refundedAmount={refundedAmount}
        totalRemaining={totalRemaining}
      />

      {pendingPayment && (
        <ReservationReceiptReview
          pendingPayment={pendingPayment}
          totalRemaining={totalRemaining}
          isOpeningReceipt={isOpeningReceipt}
          onOpenReceipt={onOpenReceipt}
        />
      )}

      {receiptError && (
        <p role="alert" className="mt-2 text-xs text-[#98584E]">
          {receiptError}
        </p>
      )}

      {canChangePayments && !pendingPayment && totalRemaining > 0 && (
        <ReservationPaymentForm reservationId={reservation.id} totalRemaining={totalRemaining} />
      )}

      {!pendingPayment && (
        <ReservationRefundForm reservationId={reservation.id} refundableAmount={refundableAmount} />
      )}

      <ReservationPaymentHistory
        payments={payments}
        canChangePayments={canChangePayments}
        isOpeningReceipt={isOpeningReceipt}
        onOpenReceipt={onOpenReceipt}
      />
    </section>
  );
}
