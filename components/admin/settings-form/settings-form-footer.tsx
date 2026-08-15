import { CheckCircle2, Loader2, Save } from "lucide-react";

type SettingsFormFooterProps = {
  error: string | null;
  success: string | null;
  isSaving: boolean;
};

export function SettingsFormFooter({ error, success, isSaving }: SettingsFormFooterProps) {
  return (
    <>
      {error ? (
        <div
          className="border border-[#E5C7C0] bg-[#F8EEEA] p-4 text-xs leading-5 text-[#98584E]"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {success ? (
        <div
          className="flex items-start gap-3 border border-[#CBDDC8] bg-[#EAF2E8] p-4 text-[#456044]"
          role="status"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-xs font-medium">{success}</p>
        </div>
      ) : null}

      <div className="sticky bottom-3">
        <button
          type="submit"
          disabled={isSaving}
          className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] px-6 text-xs font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <Save size={16} aria-hidden="true" />
          )}

          {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </>
  );
}
