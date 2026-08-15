import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

type SettingsFieldProps = {
  icon: LucideIcon;
  label: string;
  htmlFor: string;
  children: ReactNode;
};

export const settingsInputClassName =
  "mt-2 h-11 w-full min-w-0 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm";

export function SettingsField({ icon: Icon, label, htmlFor, children }: SettingsFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={14} className="text-[#A8754F]" aria-hidden="true" />
        <label htmlFor={htmlFor} className="text-xs font-medium text-[#40463F]">
          {label}
        </label>
      </div>

      {children}
    </div>
  );
}
