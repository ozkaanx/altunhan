"use client";

import type { InputHTMLAttributes } from "react";

import { formatTurkishMobileInput } from "@/lib/phone";

type TurkishMobileInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "maxLength" | "pattern"
> & {
  value: string;
  onValueChange: (value: string) => void;
  containerClassName?: string;
  prefixClassName?: string;
  inputClassName?: string;
};

export function TurkishMobileInput({
  value,
  onValueChange,
  containerClassName = "",
  prefixClassName = "",
  inputClassName = "",
  ...inputProps
}: TurkishMobileInputProps) {
  return (
    <div className={`flex min-w-0 items-center ${containerClassName}`}>
      <span
        className={`flex self-stretch shrink-0 select-none items-center text-sm font-medium text-[#626860] ${prefixClassName}`}
        aria-hidden="true"
      >
        +90
      </span>

      <input
        {...inputProps}
        type="tel"
        value={formatTurkishMobileInput(value)}
        onChange={(event) => onValueChange(formatTurkishMobileInput(event.currentTarget.value))}
        placeholder="5__ ___ __ __"
        autoComplete="tel-national"
        inputMode="numeric"
        maxLength={13}
        pattern="5[0-9]{2} [0-9]{3} [0-9]{2} [0-9]{2}"
        title="Telefon numaranızı 5XX XXX XX XX biçiminde girin."
        className={inputClassName}
      />
    </div>
  );
}
