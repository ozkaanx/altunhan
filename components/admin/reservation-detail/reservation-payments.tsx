"use client";

import { useState } from "react";

import {
  Banknote,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  WalletCards,
  X,
} from "lucide-react";

import {
  recordReservationPayment,
  updateReservationPaymentPlan,
  voidReservationPayment,
} from "@/app/admin/reservations/action";

import { formatPrice } from "@/lib/formatters/price";

import type {
  Reservation,
  ReservationPaymentMethod,
  ReservationPaymentPlan,
} from "@/types/reservation";

type ReservationPaymentsProps = {
  reservation: Reservation;
  isOpeningReceipt: boolean;
  receiptError: string | null;
  onOpenReceipt: () => void;
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

function getConfirmedPaymentAmount(reservation: Reservation) {
  return (reservation.reservation_payments ?? []).reduce((total, payment) => {
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
  const totalPrice = Number(reservation.total_price);
  const confirmedAmount = getConfirmedPaymentAmount(reservation);
  const remainingAmount = Math.max(totalPrice - confirmedAmount, 0);
  const depositTargetAmount = Number(reservation.deposit_target_amount);
  const depositDueAmount = Math.max(
    Math.min(depositTargetAmount - confirmedAmount, remainingAmount),
    0,
  );
  const suggestedPaymentAmount =
    reservation.payment_plan === "deposit" && depositDueAmount > 0
      ? depositDueAmount
      : remainingAmount;
  const isCollectingDeposit =
    reservation.payment_plan === "deposit" && depositDueAmount > 0;
  const pendingAmount = (reservation.reservation_payments ?? [])
    .filter((payment) => payment.status === "pending")
    .reduce((total, payment) => total + Number(payment.amount), 0);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(String(suggestedPaymentAmount));
  const [paymentMethod, setPaymentMethod] =
    useState<ReservationPaymentMethod>("cash");
  const [paymentNote, setPaymentNote] = useState("");
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [showPlanForm, setShowPlanForm] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<ReservationPaymentPlan>(
    reservation.payment_plan,
  );
  const [depositTarget, setDepositTarget] = useState(
    String(Number(reservation.deposit_target_amount)),
  );
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  const [voidingPaymentId, setVoidingPaymentId] = useState<number | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [isVoidingPayment, setIsVoidingPayment] = useState(false);
  const [voidError, setVoidError] = useState<string | null>(null);

  const canChangePayments =
    reservation.status !== "rejected" && reservation.status !== "cancelled";

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

  const handleSavePlan = async () => {
    const targetAmount =
      paymentPlan === "deposit" ? Number(depositTarget.replace(",", ".")) : null;

    if (
      paymentPlan === "deposit" &&
      (targetAmount === null || !Number.isFinite(targetAmount) || targetAmount <= 0)
    ) {
      setPlanError("Geçerli bir kapora tutarı girin.");
      return;
    }

    setPlanError(null);
    setIsSavingPlan(true);

    try {
      const result = await updateReservationPaymentPlan(
        reservation.id,
        paymentPlan,
        targetAmount,
      );

      if (!result.success) {
        setPlanError(result.message ?? "Ödeme planı güncellenemedi.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setPlanError("Ödeme planı güncellenirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsSavingPlan(false);
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
    setIsVoidingPayment(true);

    try {
      const result = await voidReservationPayment(voidingPaymentId, voidReason);

      if (!result.success) {
        setVoidError(result.message ?? "Tahsilat kaydı iptal edilemedi.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setVoidError("Tahsilat kaydı iptal edilirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsVoidingPayment(false);
    }
  };

  const payments = [...(reservation.reservation_payments ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <section className="border border-[#E3E0D8] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
            Ödeme
          </p>

          <p className="mt-1 text-xs text-[#777C75]">
            {reservation.payment_plan === "deposit"
              ? `Kapora hedefi ${formatPrice(reservation.deposit_target_amount)}`
              : "Tam ödeme planı"}
          </p>
        </div>

        {canChangePayments && pendingAmount === 0 && (
          <button
            type="button"
            onClick={() => {
              setShowPlanForm((current) => !current);
              setPlanError(null);
            }}
            className="inline-flex h-8 items-center gap-1.5 border border-[#D7D3CA] px-3 text-[10px] font-semibold text-[#263A2D]"
          >
            {showPlanForm ? <X size={13} /> : <Pencil size={13} />}
            {showPlanForm ? "Kapat" : "Planı Düzenle"}
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <PaymentSummary label="Toplam" value={totalPrice} icon={WalletCards} />
        <PaymentSummary label="Alınan" value={confirmedAmount} icon={CheckCircle2} />
        <PaymentSummary label="Kalan" value={remainingAmount} icon={Banknote} />
      </div>

      {pendingAmount > 0 && (
        <div className="mt-3 flex items-center gap-2 bg-[#FAF1E4] px-3 py-3 text-xs text-[#866332]">
          <Clock3 size={15} />
          {formatPrice(pendingAmount)} tutarında dekont kontrol bekliyor.
        </div>
      )}

      {showPlanForm && (
        <div className="mt-4 border border-[#E3E0D8] bg-[#FAF9F6] p-4">
          <p className="text-xs font-semibold text-[#263A2D]">Ödeme Planı</p>

          <p className="mt-1 text-[10px] leading-4 text-[#858A83]">
            Bu bölüm müşteriden talep edilecek tutarı belirler; tahsilat kaydı oluşturmaz.
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-[10px] text-[#777C75]">Plan</span>
              <select
                value={paymentPlan}
                onChange={(event) =>
                  setPaymentPlan(event.target.value as ReservationPaymentPlan)
                }
                disabled={isSavingPlan}
                className="h-11 w-full border border-[#DDD9D1] bg-white px-3 text-sm text-[#263A2D] outline-none"
              >
                <option value="deposit">Kapora</option>
                <option value="full">Tam Ödeme</option>
              </select>
            </label>

            {paymentPlan === "deposit" && (
              <label>
                <span className="mb-1.5 block text-[10px] text-[#777C75]">
                  Kapora Hedefi
                </span>
                <input
                  type="number"
                  min="1"
                  max={totalPrice}
                  step="0.01"
                  value={depositTarget}
                  onChange={(event) => setDepositTarget(event.target.value)}
                  disabled={isSavingPlan}
                  className="h-11 w-full border border-[#DDD9D1] bg-white px-3 text-sm text-[#263A2D] outline-none"
                />
              </label>
            )}
          </div>

          {planError && (
            <p role="alert" className="mt-3 text-xs text-[#98584E]">
              {planError}
            </p>
          )}

          <button
            type="button"
            onClick={handleSavePlan}
            disabled={isSavingPlan}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-50"
          >
            {isSavingPlan && <Loader2 size={14} className="animate-spin" />}
            Ödeme Hedefini Kaydet
          </button>
        </div>
      )}

      {reservation.receipt_storage_path && (
        <button
          type="button"
          onClick={onOpenReceipt}
          disabled={isOpeningReceipt}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 border border-[#263A2D] text-xs font-semibold text-[#263A2D] disabled:opacity-50"
        >
          {isOpeningReceipt ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ExternalLink size={15} />
          )}
          Dekontu Gör
        </button>
      )}

      {receiptError && <p className="mt-2 text-xs text-[#98584E]">{receiptError}</p>}

      {canChangePayments && remainingAmount > 0 && pendingAmount === 0 && (
        <>
          <button
            type="button"
            onClick={() => {
              setPaymentAmount(String(suggestedPaymentAmount));
              setShowPaymentForm((current) => !current);
              setPaymentError(null);
            }}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white"
          >
            {showPaymentForm ? <X size={15} /> : <Plus size={15} />}
            {showPaymentForm
              ? "Ödeme Formunu Kapat"
              : isCollectingDeposit
                ? `Kapora Tahsil Et · ${formatPrice(suggestedPaymentAmount)}`
                : `Kalan Ödemeyi Al · ${formatPrice(suggestedPaymentAmount)}`}
          </button>

          {showPaymentForm && (
            <div className="mt-3 border border-[#E3E0D8] bg-[#FAF9F6] p-4">
              <p className="mb-3 text-[10px] leading-4 text-[#777C75]">
                Kaydettiğiniz tutar “Alınan” alanına eklenir ve toplam borçtan düşülür.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="mb-1.5 block text-[10px] text-[#777C75]">Alınan Tutar</span>
                  <input
                    type="number"
                    min="0.01"
                    max={remainingAmount}
                    step="0.01"
                    value={paymentAmount}
                    onChange={(event) => setPaymentAmount(event.target.value)}
                    disabled={isSavingPayment}
                    className="h-11 w-full border border-[#DDD9D1] bg-white px-3 text-sm text-[#263A2D] outline-none"
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
                    className="h-11 w-full border border-[#DDD9D1] bg-white px-3 text-sm text-[#263A2D] outline-none"
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
                  className="w-full resize-y border border-[#DDD9D1] bg-white p-3 text-sm text-[#263A2D] outline-none"
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
                {isCollectingDeposit ? "Kaporayı Kaydet" : "Ödemeyi Kaydet"}
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
                      {paymentMethodLabels[payment.payment_method]} · {formatPaymentDate(payment.paid_at ?? payment.created_at)}
                    </p>
                  </div>

                  <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6B716A]">
                    {payment.status === "rejected" &&
                    payment.admin_note?.includes("Tahsilat iptali:")
                      ? "İptal Edildi"
                      : paymentStatusLabels[payment.status]}
                  </span>
                </div>

                {payment.admin_note && (
                  <p className="mt-2 text-[10px] leading-4 text-[#777C75]">
                    {payment.admin_note}
                  </p>
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
                      disabled={isVoidingPayment}
                      className="mt-3 text-[10px] font-semibold text-[#98584E] disabled:opacity-50"
                    >
                      Tahsilatı İptal Et
                    </button>
                  )}

                {voidingPaymentId === payment.id && (
                  <div className="mt-3 border-t border-[#E5D6D1] pt-3">
                    <label>
                      <span className="mb-1.5 block text-[10px] text-[#777C75]">
                        İptal Açıklaması
                      </span>
                      <input
                        value={voidReason}
                        onChange={(event) => setVoidReason(event.target.value)}
                        maxLength={500}
                        disabled={isVoidingPayment}
                        placeholder="Örn. yanlış tutar girildi"
                        className="h-10 w-full border border-[#DDD9D1] bg-white px-3 text-xs text-[#263A2D] outline-none"
                      />
                    </label>

                    {voidError && (
                      <p role="alert" className="mt-2 text-[10px] text-[#98584E]">
                        {voidError}
                      </p>
                    )}

                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setVoidingPaymentId(null);
                          setVoidError(null);
                        }}
                        disabled={isVoidingPayment}
                        className="h-9 flex-1 border border-[#D7D3CA] text-[10px] font-semibold text-[#263A2D]"
                      >
                        Vazgeç
                      </button>

                      <button
                        type="button"
                        onClick={handleVoidPayment}
                        disabled={isVoidingPayment}
                        className="flex h-9 flex-1 items-center justify-center gap-2 bg-[#98584E] text-[10px] font-semibold text-white disabled:opacity-50"
                      >
                        {isVoidingPayment && <Loader2 size={13} className="animate-spin" />}
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
