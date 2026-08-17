import type { ReactNode } from "react";

import { Minus, Plus } from "lucide-react";

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
    <div className="flex items-center justify-between border border-[#DDD8CC] bg-white p-3 sm:p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F2EFE8] text-[#A8754F]"
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#263A2D]">{title}</p>
          <p className="mt-0.5 text-[9px] text-[#969990]">{description}</p>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center border border-[#D9D5CD]">
        <button
          type="button"
          aria-label={`${title} azalt`}
          disabled={decreaseDisabled}
          onClick={onDecrease}
          className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-25"
        >
          <Minus size={13} aria-hidden="true" />
        </button>

        <span
          className="flex h-10 w-10 items-center justify-center border-x border-[#D9D5CD] text-sm font-semibold text-[#263A2D]"
          aria-live="polite"
        >
          {value}
        </span>

        <button
          type="button"
          aria-label={`${title} artır`}
          disabled={increaseDisabled}
          onClick={onIncrease}
          className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-25"
        >
          <Plus size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
