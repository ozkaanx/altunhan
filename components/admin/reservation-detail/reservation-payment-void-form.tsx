"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { voidReservationPayment } from "@/app/admin/reservations/action";

type ReservationPaymentVoidFormProps = {
  paymentId: number;
  isVoiding: boolean;
  onBusyChange: (isBusy: boolean) => void;
  onCancel: () => void;
};

export function ReservationPaymentVoidForm({
  paymentId,
  isVoiding,
  onBusyChange,
  onCancel,
}: ReservationPaymentVoidFormProps) {
  const [voidReason, setVoidReason] = useState("");
  const [voidError, setVoidError] = useState<string | null>(null);

  const handleVoidPayment = async () => {
    if (voidReason.trim().length < 3) {
      setVoidError("En az 3 karakterlik bir iptal açıklaması girin.");
      return;
    }

    setVoidError(null);
    onBusyChange(true);

    try {
      const result = await voidReservationPayment(paymentId, voidReason);

      if (!result.success) {
        setVoidError(result.message ?? "Tahsilat iptal edilemedi.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setVoidError("Tahsilat iptal edilirken beklenmeyen bir hata oluştu.");
    } finally {
      onBusyChange(false);
    }
  };

  return (
    <div className="mt-3 border-t border-[#E5D6D1] pt-3">
      <input
        value={voidReason}
        onChange={(event) => setVoidReason(event.target.value)}
        maxLength={500}
        disabled={isVoiding}
        placeholder="İptal açıklaması"
        className="h-10 w-full border border-[#DDD9D1] bg-white px-3 text-base text-[#263A2D] outline-none"
      />

      {voidError && (
        <p role="alert" className="mt-2 text-[10px] text-[#98584E]">
          {voidError}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isVoiding}
          className="h-9 flex-1 border border-[#D7D3CA] text-[10px] font-semibold text-[#263A2D]"
        >
          Vazgeç
        </button>
        <button
          type="button"
          onClick={handleVoidPayment}
          disabled={isVoiding}
          className="flex h-9 flex-1 items-center justify-center gap-2 bg-[#98584E] text-[10px] font-semibold text-white disabled:opacity-50"
        >
          {isVoiding && <Loader2 size={13} className="animate-spin" />}
          İptal Et
        </button>
      </div>
    </div>
  );
}
