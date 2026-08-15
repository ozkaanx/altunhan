import type { LucideIcon } from "lucide-react";

type InfoRowProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-[10px] text-[#969990]">{label}</p>

        <p className="mt-1 text-xs font-medium text-[#263A2D]">{value}</p>
      </div>
    </div>
  );
}

type MiniInfoProps = {
  label: string;
  value: string;
};

export function MiniInfo({ label, value }: MiniInfoProps) {
  return (
    <div>
      <p className="text-[10px] text-[#969990]">{label}</p>

      <p className="mt-1 text-xs font-medium text-[#263A2D]">{value}</p>
    </div>
  );
}
