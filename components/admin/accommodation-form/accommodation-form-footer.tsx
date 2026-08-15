import { Save } from "lucide-react";

type AccommodationFormFooterProps = {
  isActive: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  submitLabel: string;
  onActiveChange: (active: boolean) => void;
};

export function AccommodationFormFooter({
  isActive,
  isSubmitting,
  submitError,
  submitLabel,
  onActiveChange,
}: AccommodationFormFooterProps) {
  return (
    <>
      <section className="border border-[#E3E0D8] bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-[#263A2D]">Yayın Durumu</p>

            <p className="mt-1 text-[11px] text-[#969990]">Web sitesinde göster.</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label="Konaklamayı web sitesinde göster"
            onClick={() => onActiveChange(!isActive)}
            className={`relative h-7 w-12 shrink-0 rounded-full ${
              isActive ? "bg-[#263A2D]" : "bg-[#D8D6D0]"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                isActive ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-[#DDD9D1] bg-[#F3F1EC]/95 p-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        {submitError && (
          <div className="mb-3 border border-[#E7D6D1] bg-[#F8EEEA] px-4 py-3 text-xs text-[#8A5147]">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-60 sm:ml-auto sm:w-auto sm:px-8"
        >
          <Save size={16} />

          {isSubmitting ? "Kaydediliyor..." : submitLabel}
        </button>
      </div>
    </>
  );
}
