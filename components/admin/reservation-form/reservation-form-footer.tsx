import { CheckCircle2, Loader2, Save } from "lucide-react";

type ReservationFormFooterProps = {
  error: string | null;
  success: string | null;
  isSubmitting: boolean;
  onCancel: () => void;
};

export function ReservationFormFooter({
  error,
  success,
  isSubmitting,
  onCancel,
}: ReservationFormFooterProps) {
  return (
    <>
      {error && (
        <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-4 text-xs leading-5 text-[#98584E]">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 border border-[#CBDDC8] bg-[#EAF2E8] p-4 text-[#456044]">
          <CheckCircle2 size={18} />

          <p className="text-xs font-medium">{success}</p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-12 border border-[#DDD9D1] bg-white px-6 text-xs font-semibold text-[#263A2D]"
        >
          Vazgeç
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center gap-2 bg-[#263A2D] px-7 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}

          {isSubmitting ? "Oluşturuluyor..." : "Rezervasyonu Oluştur"}
        </button>
      </div>
    </>
  );
}
