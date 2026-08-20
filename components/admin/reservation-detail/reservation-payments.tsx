"use client";

import { useState } from "react";

import { Banknote, CheckCircle2, ExternalLink, Loader2, Plus, WalletCards, X } from "lucide-react";

import {
  recordReservationPayment,
  rejectReservationPayment,
  verifyReservationPayment,
  voidReservationPayment,
} from "@/app/admin/reservations/action";

import { formatPrice } from "@/lib/formatters/price";

import type {
  Reservation,
  ReservationPayment,
  ReservationPaymentMethod,
} from "@/types/reservation";

type ReservationPaymentsProps = {
  reservation: Reservation;
  isOpeningReceipt: boolean;
  receiptError: string | null;
  onOpenReceipt: (storagePath: string) => void;
};

const paymentMethodLabels: Record<ReservationPaymentMethod, string> = {
  bank_transfer: "Havale / EFT",
  cash: "Nakit",
  card: "Kart",
  other: "Diğer",
};

const paymentTypeLabels = {
  deposit: "Kapora",
  balance: "Kalan Ödeme",
  full: "Tam Ödeme",
  refund: "İade",
};

const paymentStatusLabels = {
  pending: "Kontrol Bekliyor",
  confirmed: "Onaylandı",
  rejected: "Reddedildi",
};

function getConfirmedAmount(payments: ReservationPayment[]) {
  return payments.reduce((total, payment) => {
    if (payment.status !== "confirmed") {
      return total;
    }

    return payment.payment_type === "refund"
      ? total - Number(payment.amount)
      : total + Number(payment.amount);
  }, 0);
}

function formatPaymentDate(value: string | null) {
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
  const confirmedAmount = getConfirmedAmount(payments);
  const totalPrice = Number(reservation.total_price);
  const totalRemaining = Math.max(totalPrice - confirmedAmount, 0);
  const canChangePayments = reservation.status !== "rejected" && reservation.status !== "cancelled";

  const [receivedAmount, setReceivedAmount] = useState(
    String(Number(pendingPayment?.requested_amount ?? 0)),
  );
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(String(totalRemaining));
  const [paymentMethod, setPaymentMethod] = useState<ReservationPaymentMethod>("cash");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  const [voidingPaymentId, setVoidingPaymentId] = useState<number | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [voidError, setVoidError] = useState<string | null>(null);
  const [isVoiding, setIsVoiding] = useState(false);

  const handleVerify = async () => {
    if (!pendingPayment) {
      return;
    }

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
    if (!pendingPayment) {
      return;
    }

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
        reservation.id,
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

  const handleVoidPayment = async () => {
    if (!voidingPaymentId) {
      return;
    }

    if (voidReason.trim().length < 3) {
      setVoidError("En az 3 karakterlik bir iptal açıklaması girin.");
      return;
    }

    setVoidError(null);
    setIsVoiding(true);

    try {
      const result = await voidReservationPayment(voidingPaymentId, voidReason);

      if (!result.success) {
        setVoidError(result.message ?? "Tahsilat iptal edilemedi.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setVoidError("Tahsilat iptal edilirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsVoiding(false);
    }
  };

  return (
    <section className="border border-[#E3E0D8] bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">Ödeme</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <PaymentSummary label="Toplam" value={totalPrice} icon={WalletCards} />
        <PaymentSummary label="Alınan" value={confirmedAmount} icon={CheckCircle2} />
        <PaymentSummary label="Kalan" value={totalRemaining} icon={Banknote} />
      </div>

      {pendingPayment && (
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
      )}

      {receiptError && (
        <p role="alert" className="mt-2 text-xs text-[#98584E]">
          {receiptError}
        </p>
      )}

      {canChangePayments && !pendingPayment && totalRemaining > 0 && (
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
      )}

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
                    <p className="text-xs font-semibold text-[#263A2D]">
                      {paymentTypeLabels[payment.payment_type]} · {formatPrice(payment.amount)}
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
                      onClick={() => {
                        setVoidingPaymentId(payment.id);
                        setVoidReason("");
                        setVoidError(null);
                      }}
                      disabled={isVoiding}
                      className="mt-3 text-[10px] font-semibold text-[#98584E] disabled:opacity-50"
                    >
                      Tahsilatı İptal Et
                    </button>
                  )}

                {voidingPaymentId === payment.id && (
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
                        onClick={() => setVoidingPaymentId(null)}
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
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs italic text-[#969990]">Henüz ödeme kaydı bulunmuyor.</p>
        )}
      </div>
    </section>
  );
}

function PaymentSummary({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof WalletCards;
}) {
  return (
    <div className="border border-[#E8E4DC] bg-[#FAF9F6] p-3">
      <Icon size={15} className="text-[#A8754F]" />
      <p className="mt-2 text-[9px] uppercase tracking-[0.1em] text-[#969990]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#263A2D]">{formatPrice(value)}</p>
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
