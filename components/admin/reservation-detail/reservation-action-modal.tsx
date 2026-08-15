import { Loader2 } from "lucide-react";

import type { ReservationDrawerAction } from "@/types/admin-reservation-detail";

type ReservationActionModalProps = {
  action: ReservationDrawerAction | null;
  reason: string;
  error: string | null;
  isLoading: boolean;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function ReservationActionModal({
  action,
  reason,
  error,
  isLoading,
  onReasonChange,
  onClose,
  onSubmit,
}: ReservationActionModalProps) {
  if (!action) {
    return null;
  }

  const isReject = action === "reject";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="İşlem penceresini kapat"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-action-title"
        className="relative z-10 w-full bg-white p-5 shadow-2xl sm:max-w-[480px]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#98584E]">
          {isReject ? "Rezervasyonu Reddet" : "Rezervasyonu İptal Et"}
        </p>

        <h3 id="reservation-action-title" className="mt-2 text-xl font-semibold text-[#263A2D]">
          {isReject ? "Red sebebi" : "İptal sebebi"}
        </h3>

        <p className="mt-2 text-xs leading-5 text-[#7D817B]">
          Bu açıklama müşterinin rezervasyon takip ekranında gösterilecek.
        </p>

        <textarea
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          maxLength={500}
          rows={5}
          className="mt-5 w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-sm text-[#263A2D] outline-none"
          placeholder={isReject ? "Red sebebini yazın..." : "İptal sebebini yazın..."}
        />

        {error && <div className="mt-3 bg-[#F8EEEA] p-3 text-xs text-[#98584E]">{error}</div>}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-11 border border-[#DDD9D1] text-xs font-semibold"
          >
            Vazgeç
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || reason.trim().length < 5}
            className="flex h-11 items-center justify-center gap-2 bg-[#98584E] text-xs font-semibold text-white disabled:opacity-50"
          >
            {isLoading && <Loader2 size={15} className="animate-spin" />}

            {isReject ? "Reddet" : "İptal Et"}
          </button>
        </div>
      </div>
    </div>
  );
}
