import { BedDouble, Loader2, Users } from "lucide-react";

import type {
  BedConfigurationAvailability,
  PublicBedConfiguration,
} from "@/types/public-reservation";

type BedPreferenceSelectionProps = {
  options: BedConfigurationAvailability[];
  value: PublicBedConfiguration | null;
  guestCount: number;
  isLoading: boolean;
  error: string | null;
  onChange: (value: PublicBedConfiguration) => void;
};

function getBedLabel(value: PublicBedConfiguration) {
  switch (value) {
    case "one_double":
      return "1 Çift Kişilik";
    case "double_single":
      return "1 Çift + 1 Tek";
    case "two_double":
      return "2 Çift Kişilik";
  }
}

export function BedPreferenceSelection({
  options,
  value,
  guestCount,
  isLoading,
  error,
  onChange,
}: BedPreferenceSelectionProps) {
  if (!isLoading && !error && options.length === 0) {
    return null;
  }

  return (
    <div className="mt-7 border-t border-[#E3DED5] pt-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center bg-[#E9EDE6] text-[#526048]">
          <BedDouble size={17} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div>
          <p className="text-xs font-semibold text-[#263A2D]">Yatak Tercihi</p>
          <p className="mt-0.5 text-[9px] leading-4 text-[#969990]">
            Misafir sayınıza ve seçtiğiniz tarihlere uygun yatak düzenini seçin.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center gap-2 bg-[#F1EFE8] px-4 py-3 text-[10px] text-[#737970]">
          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
          Yatak seçenekleri kontrol ediliyor...
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] px-4 py-3 text-[10px] text-[#98584E]">
          {error}
        </div>
      )}

      {!isLoading && !error && options.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const selected = value === option.bedConfiguration;
            const capacityInsufficient = option.maxGuests < guestCount;
            const disabled = !option.isAvailable;

            const status = capacityInsufficient
              ? "Kapasite yetersiz"
              : option.isAvailable
                ? "Müsait"
                : "Bu tarihlerde dolu";

            return (
              <button
                key={option.bedConfiguration}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => onChange(option.bedConfiguration)}
                className={`flex min-h-[88px] items-center justify-between gap-3 border p-4 text-left transition ${
                  selected
                    ? "border-[#526048] bg-[#F1F4EE]"
                    : "border-[#DDD8CC] bg-white"
                } ${disabled ? "cursor-not-allowed opacity-45" : "hover:border-[#A9B0A5]"}`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#263A2D]">
                    {getBedLabel(option.bedConfiguration)}
                  </p>

                  <p className="mt-1.5 flex items-center gap-1 text-[9px] text-[#858A83]">
                    <Users size={12} aria-hidden="true" />
                    Maks. {option.maxGuests} kişi
                  </p>
                </div>

                <span
                  className={`shrink-0 text-[9px] font-semibold ${
                    option.isAvailable ? "text-[#526048]" : "text-[#98584E]"
                  }`}
                >
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!isLoading && !error && options.filter((option) => option.isAvailable).length > 1 && !value && (
        <p className="mt-3 text-[10px] text-[#A8754F]">
          Devam etmek için yatak tercihinizi seçin.
        </p>
      )}
    </div>
  );
}
