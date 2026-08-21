"use client";

import { useState } from "react";

import { Loader2, RotateCcw, X } from "lucide-react";

import { recordReservationRefund } from "@/app/admin/reservations/action";

import { formatPrice } from "@/lib/formatters/price";

import type { ReservationPaymentMethod } from "@/types/reservation";

type ReservationRefundFormProps = {
  reservationId: number;
  refundableAmount: number;
};

const refundMethodLabels: Record<ReservationPaymentMethod, string> = {
  bank_transfer: "Havale / EFT",
  cash: "Nakit",
  card: "Kart",
  other: "Diğer",
};

export function ReservationRefundForm({
  reservationId,
  refundableAmount,
}: ReservationRefundFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(String(refundableAmount));
  const [paymentMethod, setPaymentMethod] =
    useState<ReservationPaymentMethod>("bank_transfer");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (refundableAmount <= 0) {
    return null;
  }

  const handleToggle = () => {
    if (!isOpen) {
      setAmount(String(refundableAmount));
      setPaymentMethod("bank_transfer");
      setReason("");
      setError(null);
    }

    setIsOpen((current) => !current);
  };

  const handleSave = async () => {
    const parsedAmount = Number(amount.replace(",", "."));
    const cleanReason = reason.trim();

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Geçerli bir iade tutarı girin.");
      return;
    }

    if (parsedAmount > refundableAmount) {
      setError(`En fazla ${formatPrice(refundableAmount)} iade edilebilir.`);
      return;
    }

    if (cleanReason.length < 3) {
      setError("En az 3 karakterlik bir iade sebebi girin.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const result = await recordReservationRefund(
        reservationId,
        parsedAmount,
        paymentMethod,
        cleanReason,
      );

      if (!result.success) {
        setError(result.message ?? "İade kaydedilemedi.");
        return;
      }

      window.location.reload();
    } catch (refundError) {
      console.error(refundError);
      setError("İade kaydedilirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98584E]">
            İade
          </p>
          <p className="mt-1 text-xs leading-5 text-[#8A635D]">
            İade edilebilir net tahsilat: {formatPrice(refundableAmount)}
          </p>
        </div>

        <RotateCcw size={17} className="shrink-0 text-[#98584E]" />
      </div>

      <p className="mt-2 text-[10px] leading-4 text-[#9A746E]">
        İade ayrı bir finansal hareket olarak kaydedilir; eski tahsilat silinmez ve gelir
        raporunda iade olarak düşülür.
      </p>

      <button
        type="button"
        onClick={handleToggle}
        disabled={isSaving}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 border border-[#C99E96] bg-white text-xs font-semibold text-[#98584E] disabled:opacity-50"
      >
        {isOpen ? <X size={14} /> : <RotateCcw size={14} />}
        {isOpen ? "İade Formunu Kapat" : "İade Kaydı Ekle"}
      </button>

      {isOpen && (
        <div className="mt-3 border-t border-[#E4CFC9] pt-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-[10px] text-[#8A635D]">İade Tutarı</span>
              <input
                type="number"
                min="0.01"
                max={refundableAmount}
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={isSaving}
                className="h-11 w-full border border-[#D8C5C0] bg-white px-3 text-base text-[#263A2D] outline-none"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-[10px] text-[#8A635D]">İade Yöntemi</span>
              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value as ReservationPaymentMethod)
                }
                disabled={isSaving}
                className="h-11 w-full border border-[#D8C5C0] bg-white px-3 text-base text-[#263A2D] outline-none"
              >
                {Object.entries(refundMethodLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-3 block">
            <span className="mb-1.5 block text-[10px] text-[#8A635D]">İade Sebebi</span>
            <textarea
              rows={2}
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={isSaving}
              placeholder="Örn. rezervasyon iptali nedeniyle kapora iadesi"
              className="w-full resize-y border border-[#D8C5C0] bg-white p-3 text-base text-[#263A2D] outline-none"
            />
          </label>

          {error && (
            <p role="alert" className="mt-3 text-xs text-[#98584E]">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 bg-[#98584E] text-xs font-semibold text-white disabled:opacity-50"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            İadeyi Kaydet
          </button>
        </div>
      )}
    </div>
  );
}
