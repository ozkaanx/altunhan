"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

import { ReservationPaymentVoidForm } from "@/components/admin/reservation-detail/reservation-payment-void-form";
import {
  formatPaymentDate,
  paymentMethodLabels,
  paymentStatusLabels,
  paymentTypeLabels,
} from "@/components/admin/reservation-detail/reservation-payment-utils";

import { formatPrice } from "@/lib/formatters/price";

import type { ReservationPayment } from "@/types/reservation";

type ReservationPaymentHistoryProps = {
  payments: ReservationPayment[];
  canChangePayments: boolean;
  isOpeningReceipt: boolean;
  onOpenReceipt: (storagePath: string) => void;
};

export function ReservationPaymentHistory({
  payments,
  canChangePayments,
  isOpeningReceipt,
  onOpenReceipt,
}: ReservationPaymentHistoryProps) {
  const [voidingPaymentId, setVoidingPaymentId] = useState<number | null>(null);
  const [isVoiding, setIsVoiding] = useState(false);

  return (
    <div className="mt-5 border-t border-[#EEEAE3] pt-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
        Ödeme Geçmişi
      </p>

      {payments.length > 0 ? (
        <div className="mt-3 space-y-2">
          {payments.map((payment) => (
            <div key={payment.id} className="border border-[#E8E4DC] bg-[#FAF9F6] p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-xs font-semibold ${
                      payment.payment_type === "refund" ? "text-[#98584E]" : "text-[#263A2D]"
                    }`}
                  >
                    {paymentTypeLabels[payment.payment_type]} ·
                    {payment.payment_type === "refund" ? " -" : " "}
                    {formatPrice(payment.amount)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#858A83]">
                    {paymentMethodLabels[payment.payment_method]} ·{" "}
                    {formatPaymentDate(payment.paid_at ?? payment.created_at)}
                  </p>
                  {payment.status === "pending" &&
                    Number(payment.requested_amount) !== Number(payment.amount) && (
                      <p className="mt-1 text-[10px] text-[#858A83]">
                        Beklenen: {formatPrice(payment.requested_amount)}
                      </p>
                    )}
                </div>

                <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6B716A]">
                  {payment.status === "rejected" &&
                  payment.admin_note?.includes("Tahsilat iptali:")
                    ? "İptal Edildi"
                    : paymentStatusLabels[payment.status]}
                </span>
              </div>

              {payment.receipt_storage_path && (
                <button
                  type="button"
                  onClick={() => onOpenReceipt(payment.receipt_storage_path!)}
                  disabled={isOpeningReceipt}
                  className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#263A2D] disabled:opacity-50"
                >
                  <ExternalLink size={13} />
                  Dekontu Gör
                </button>
              )}

              {payment.admin_note && (
                <p className="mt-2 text-[10px] leading-4 text-[#777C75]">{payment.admin_note}</p>
              )}

              {canChangePayments &&
                payment.status === "confirmed" &&
                payment.payment_type !== "refund" && (
                  <button
                    type="button"
                    onClick={() => setVoidingPaymentId(payment.id)}
                    disabled={isVoiding}
                    className="mt-3 text-[10px] font-semibold text-[#98584E] disabled:opacity-50"
                  >
                    Tahsilatı İptal Et
                  </button>
                )}

              {voidingPaymentId === payment.id && (
                <ReservationPaymentVoidForm
                  paymentId={payment.id}
                  isVoiding={isVoiding}
                  onBusyChange={setIsVoiding}
                  onCancel={() => setVoidingPaymentId(null)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs italic text-[#969990]">Henüz ödeme kaydı bulunmuyor.</p>
      )}
    </div>
  );
}
