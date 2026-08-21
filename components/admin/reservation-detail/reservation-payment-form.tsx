"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";

import { recordReservationPayment } from "@/app/admin/reservations/action";

import { paymentMethodLabels } from "@/components/admin/reservation-detail/reservation-payment-utils";

import type { ReservationPaymentMethod } from "@/types/reservation";

type ReservationPaymentFormProps = {
  reservationId: number;
  totalRemaining: number;
};

export function ReservationPaymentForm({
  reservationId,
  totalRemaining,
}: ReservationPaymentFormProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(String(totalRemaining));
  const [paymentMethod, setPaymentMethod] = useState<ReservationPaymentMethod>("cash");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  const handleSavePayment = async () => {
    const amount = Number(paymentAmount.replace(",", "."));

    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentError("Geçerli bir ödeme tutarı girin.");
      return;
    }

    setPaymentError(null);
    setIsSavingPayment(true);

    try {
      const result = await recordReservationPayment(
        reservationId,
        amount,
        paymentMethod,
        paymentNote,
      );

      if (!result.success) {
        setPaymentError(result.message ?? "Ödeme kaydedilemedi.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setPaymentError("Ödeme kaydedilirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsSavingPayment(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPaymentAmount(String(totalRemaining));
          setShowPaymentForm((current) => !current);
          setPaymentError(null);
        }}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white"
      >
        {showPaymentForm ? <X size={15} /> : <Plus size={15} />}
        {showPaymentForm ? "Ödeme Formunu Kapat" : "Yeni Tahsilat Ekle"}
      </button>

      {showPaymentForm && (
        <div className="mt-3 border border-[#E3E0D8] bg-[#FAF9F6] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-[10px] text-[#777C75]">Alınan Tutar</span>
              <input
                type="number"
                min="0.01"
                max={totalRemaining}
                step="0.01"
                inputMode="decimal"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                disabled={isSavingPayment}
                className="h-11 w-full border border-[#DDD9D1] bg-white px-3 text-base text-[#263A2D] outline-none"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-[10px] text-[#777C75]">Ödeme Yöntemi</span>
              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value as ReservationPaymentMethod)
                }
                disabled={isSavingPayment}
                className="h-11 w-full border border-[#DDD9D1] bg-white px-3 text-base text-[#263A2D] outline-none"
              >
                {Object.entries(paymentMethodLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-3 block">
            <span className="mb-1.5 block text-[10px] text-[#777C75]">Admin Notu</span>
            <textarea
              rows={2}
              maxLength={500}
              value={paymentNote}
              onChange={(event) => setPaymentNote(event.target.value)}
              disabled={isSavingPayment}
              placeholder="Örn. girişte nakit alındı"
              className="w-full resize-y border border-[#DDD9D1] bg-white p-3 text-base text-[#263A2D] outline-none"
            />
          </label>

          {paymentError && (
            <p role="alert" className="mt-3 text-xs text-[#98584E]">
              {paymentError}
            </p>
          )}

          <button
            type="button"
            onClick={handleSavePayment}
            disabled={isSavingPayment}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-50"
          >
            {isSavingPayment && <Loader2 size={14} className="animate-spin" />}
            Tahsilatı Kaydet
          </button>
        </div>
      )}
    </>
  );
}
