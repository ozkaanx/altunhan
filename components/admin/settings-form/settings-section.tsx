import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

type SettingsSectionProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
};

export function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <div className="border-b border-[#EEEAE3] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
            <Icon size={17} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#263A2D]">{title}</h2>
            <p className="mt-1 text-[10px] text-[#969990]">{description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">{children}</div>
    </section>
  );
}
