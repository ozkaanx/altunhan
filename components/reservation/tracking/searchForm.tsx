"use client";

import { Loader2, Phone, Search } from "lucide-react";

type TrackingSearchFormProps = {
  reservationCode: string;
  phone: string;
  error: string | null;
  isLoading: boolean;

  onReservationCodeChange: (value: string) => void;

  onPhoneChange: (value: string) => void;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function TrackingSearchForm({
  reservationCode,
  phone,
  error,
  isLoading,
  onReservationCodeChange,
  onPhoneChange,
  onSubmit,
}: TrackingSearchFormProps) {
  return (
    <div className="mx-auto max-w-[560px]">
      <div className="border border-[#E3E0D8] bg-white p-5 sm:p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
          Rezervasyon Takip
        </p>

        <h1 className="mt-2 font-serif text-3xl text-[#263A2D] sm:text-4xl">
          Rezervasyonunuzu sorgulayın.
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#777C75]">
          Rezervasyon numaranız ve telefon numaranız ile rezervasyon durumunuzu
          görüntüleyebilirsiniz.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#40463F]">Rezervasyon Numarası</label>

            <div className="relative mt-2">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
              />

              <input
                required
                value={reservationCode}
                onChange={(event) => onReservationCodeChange(event.target.value)}
                placeholder="AF-XXXXXXXX"
                autoComplete="off"
                spellCheck={false}
                className={`${inputClass} pl-10 uppercase`}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#40463F]">Telefon Numarası</label>

            <div className="relative mt-2">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
              />

              <input
                required
                type="tel"
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                placeholder="+90 5__ ___ __ __"
                autoComplete="tel"
                inputMode="tel"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {error && (
            <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs leading-5 text-[#98584E]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] px-5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sorgulanıyor...
              </>
            ) : (
              <>
                <Search size={16} />
                Rezervasyonumu Sorgula
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full min-w-0 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm";
