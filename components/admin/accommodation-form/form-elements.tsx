import type { LucideIcon } from "lucide-react";
import { Minus, Plus } from "lucide-react";

import type { ReactNode } from "react";

export const inputClass =
  "mt-2 h-11 w-full min-w-0 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm";

type FieldProps = {
  label: string;
  children: ReactNode;
};

export function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-[#40463F]">{label}</label>

      {children}
    </div>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
      <h2 className="text-sm font-semibold text-[#263A2D]">{title}</h2>

      {description && <p className="mt-1 text-[11px] text-[#92968E]">{description}</p>}
    </div>
  );
}

type CounterRowProps = {
  icon: LucideIcon;
  label: string;
  description: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function CounterRow({
  icon: Icon,
  label,
  description,
  value,
  onDecrease,
  onIncrease,
}: CounterRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
          <Icon size={18} />
        </div>

        <div>
          <p className="text-xs font-medium text-[#40463F]">{label}</p>

          <p className="mt-0.5 text-[10px] text-[#969990]">{description}</p>
        </div>
      </div>

      <div className="flex items-center border border-[#DDD9D1]">
        <button
          type="button"
          aria-label={`${label} azalt`}
          onClick={onDecrease}
          className="flex h-10 w-10 items-center justify-center"
        >
          <Minus size={15} />
        </button>

        <span className="flex h-10 min-w-10 items-center justify-center border-x border-[#DDD9D1] text-sm font-semibold text-[#263A2D]">
          {value}
        </span>

        <button
          type="button"
          aria-label={`${label} artır`}
          onClick={onIncrease}
          className="flex h-10 w-10 items-center justify-center"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
