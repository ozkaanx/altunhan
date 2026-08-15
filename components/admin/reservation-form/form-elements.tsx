import type { LucideIcon } from "lucide-react";
import { Minus, Plus } from "lucide-react";

import type { ReactNode } from "react";

type GuestCounterProps = {
  icon: ReactNode;
  title: string;
  description: string;
  value: number;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function GuestCounter({
  icon,
  title,
  description,
  value,
  decreaseDisabled,
  increaseDisabled,
  onDecrease,
  onIncrease,
}: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between border border-[#E3E0D8] bg-[#FAF9F6] p-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-[#A8754F]">
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-[#40463F]">{title}</p>

          <p className="mt-0.5 text-[9px] text-[#969990]">{description}</p>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center border border-[#DDD9D1] bg-white">
        <button
          type="button"
          aria-label={`${title} azalt`}
          disabled={decreaseDisabled}
          onClick={onDecrease}
          className="flex h-9 w-9 items-center justify-center transition hover:bg-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus size={13} />
        </button>

        <span className="flex h-9 w-9 items-center justify-center border-x border-[#DDD9D1] text-sm font-semibold text-[#263A2D]">
          {value}
        </span>

        <button
          type="button"
          aria-label={`${title} artır`}
          disabled={increaseDisabled}
          onClick={onIncrease}
          className="flex h-9 w-9 items-center justify-center transition hover:bg-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

type SectionTitleProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function SectionTitle({ icon: Icon, title, description }: SectionTitleProps) {
  return (
    <div className="border-b border-[#EEEAE3] px-4 py-4 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
          <Icon size={17} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#263A2D]">{title}</h2>

          <p className="mt-1 text-[10px] leading-4 text-[#969990]">{description}</p>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

export function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#40463F]">{label}</label>

      {children}
    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value: string;
};

export function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.1em] text-[#969990]">{label}</p>

      <p className="mt-1 text-sm font-semibold text-[#263A2D]">{value}</p>
    </div>
  );
}

export const inputClass =
  "h-11 w-full min-w-0 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm";
