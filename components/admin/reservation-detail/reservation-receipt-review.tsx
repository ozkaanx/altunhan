"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

import {
  rejectReservationPayment,
  verifyReservationPayment,
} from "@/app/admin/reservations/action";

import { formatPrice } from "@/lib/formatters/price";
import { formatPaymentDate } from "@/components/admin/reservation-detail/reservation-payment-utils";

import type { ReservationPayment } from "@/types/reservation";

type ReservationReceiptReviewProps = {
  pendingPayment: ReservationPayment;
  totalRemaining: number;
  isOpeningReceipt: boolean;
  onOpenReceipt: (storagePath: string) => void;
};

export function ReservationReceiptReview({
  pendingPayment,
  totalRemaining,
  isOpeningReceipt,
  onOpenReceipt,
}: ReservationReceiptReviewProps) {
  const [receivedAmount, setReceivedAmount] = useState(
    String(Number(pendingPayment.requested_amount ?? 0)),
  );
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleVerify = async () => {
    const amount = Number(receivedAmount.replace(",", "."));

    if (!Number.isFinite(amount) || amount <= 0) {
      setReviewError("Bankaya gelen gerçek tutarı girin.");
      return;
    }

    setReviewError(null);
    setIsReviewing(true);

    try {
      const result = await verifyReservationPayment(pendingPayment.id, amount);

      if (!result.success) {
        setReviewError(result.message ?? "Ödeme doğrulanamadı.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setReviewError("Ödeme doğrulanırken beklenmeyen bir hata oluştu.");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleReject = async () => {
    if (rejectReason.trim().length < 3) {
      setReviewError("Müşterinin görebileceği en az 3 karakterlik bir açıklama girin.");
      return;
    }

    setReviewError(null);
    setIsReviewing(true);

    try {
      const result = await rejectReservationPayment(pendingPayment.id, rejectReason);

      if (!result.success) {
        setReviewError(result.message ?? "Dekont reddedilemedi.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setReviewError("Dekont reddedilirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="mt-4 border border-[#D8C7A8] bg-[#FCF8F0] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8754F]">
        Dekont Kontrolü
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <PaymentMiniInfo
          label="Sistem Beklentisi"
          value={formatPrice(pendingPayment.requested_amount)}
        />
        <PaymentMiniInfo
          label="Yükleme Tarihi"
          value={formatPaymentDate(pendingPayment.created_at)}
        />
      </div>

      {pendingPayment.receipt_storage_path && (
        <button
          type="button"
          onClick={() => onOpenReceipt(pendingPayment.receipt_storage_path!)}
          disabled={isOpeningReceipt || isReviewing}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 border border-[#263A2D] bg-white text-xs font-semibold text-[#263A2D] disabled:opacity-50"
        >
          {isOpeningReceipt ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ExternalLink size={15} />
          )}
          Dekontu Aç
        </button>
      )}

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[10px] font-semibold text-[#626860]">
          Banka Hesabına Gerçekte Gelen Tutar
        </span>
        <input
          type="number"
          min="0.01"
          max={totalRemaining}
          step="0.01"
          inputMode="decimal"
          value={receivedAmount}
          onChange={(event) => setReceivedAmount(event.target.value)}
          disabled={isReviewing}
          className="h-11 w-full border border-[#D8D3C9] bg-white px-3 text-base text-[#263A2D] outline-none"
        />
      </label>

      <p className="mt-2 text-[10px] leading-4 text-[#777C75]">
        Bu tutarı yalnızca banka hesabındaki hareketi kontrol ettikten sonra doğrulayın.
      </p>

      {reviewError && (
        <p role="alert" className="mt-3 text-xs text-[#98584E]">
          {reviewError}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setShowRejectForm((current) => !current)}
          disabled={isReviewing}
          className="h-10 border border-[#D9B8B2] bg-white text-xs font-semibold text-[#98584E] disabled:opacity-50"
        >
          {showRejectForm ? "Vazgeç" : "Dekontu Reddet"}
        </button>

        <button
          type="button"
          onClick={handleVerify}
          disabled={isReviewing}
          className="flex h-10 items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-50"
        >
          {isReviewing && <Loader2 size={14} className="animate-spin" />}
          Ödemeyi Doğrula
        </button>
      </div>

      {showRejectForm && (
        <div className="mt-3 border-t border-[#E5D6D1] pt-3">
          <label>
            <span className="mb-1.5 block text-[10px] text-[#777C75]">
              Müşteriye Gösterilecek Açıklama
            </span>
            <textarea
              rows={2}
              maxLength={500}
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              disabled={isReviewing}
              placeholder="Örn. Dekont tutarı veya işlem bilgileri banka kaydıyla eşleşmedi."
              className="w-full resize-y border border-[#DDD9D1] bg-white p-3 text-base text-[#263A2D] outline-none"
            />
          </label>

          <button
            type="button"
            onClick={handleReject}
            disabled={isReviewing}
            className="mt-2 flex h-10 w-full items-center justify-center gap-2 bg-[#98584E] text-xs font-semibold text-white disabled:opacity-50"
          >
            {isReviewing && <Loader2 size={14} className="animate-spin" />}
            Reddi Kaydet
          </button>
        </div>
      )}
    </div>
  );
}

function PaymentMiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#E8E4DC] bg-white p-3">
      <p className="text-[9px] uppercase tracking-[0.08em] text-[#969990]">{label}</p>
      <p className="mt-1 text-xs font-semibold text-[#263A2D]">{value}</p>
    </div>
  );
}
