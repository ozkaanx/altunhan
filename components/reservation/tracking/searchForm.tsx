"use client";

import { Loader2, Phone, Search } from "lucide-react";

import { TurkishMobileInput } from "@/components/shared/turkish-mobile-input";

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
            <label
              htmlFor="tracking-reservation-code"
              className="text-xs font-medium text-[#40463F]"
            >
              Rezervasyon Numarası
            </label>

            <div className="relative mt-2">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
              />

              <input
                id="tracking-reservation-code"
                name="reservationCode"
                required
                value={reservationCode}
                onChange={(event) => onReservationCodeChange(event.target.value)}
                placeholder="AF-XXXXXXXX"
                autoComplete="off"
                spellCheck={false}
                maxLength={24}
                aria-describedby="tracking-code-help"
                className={`${inputClass} pl-10 uppercase`}
              />
            </div>

            <p id="tracking-code-help" className="mt-1.5 text-[10px] leading-4 text-[#8A8F88]">
              Rezervasyon numaranızı talep sonrası ekranda ve e-postanızda bulabilirsiniz.
            </p>
          </div>

          <div>
            <label htmlFor="tracking-phone" className="text-xs font-medium text-[#40463F]">
              Telefon Numarası
            </label>

            <div className="relative mt-2">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
              />

              <TurkishMobileInput
                id="tracking-phone"
                name="phone"
                required
                value={phone}
                onValueChange={onPhoneChange}
                containerClassName={`${inputClass} pl-10`}
                prefixClassName="border-r border-[#DDD9D1] pr-3"
                inputClassName="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div
              className="border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs leading-5 text-[#98584E]"
              role="alert"
            >
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
