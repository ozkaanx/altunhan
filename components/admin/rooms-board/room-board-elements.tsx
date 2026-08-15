import { CheckCircle2, Clock3, XCircle, type LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
};

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="border border-[#E3E0D8] bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#92968F]">
          {label}
        </p>

        <Icon size={17} className="text-[#A8754F]" />
      </div>

      <p className="mt-3 text-3xl font-semibold text-[#263A2D]">{value}</p>
    </div>
  );
}

type StatusBadgeProps = {
  type: "available" | "occupied" | "inactive";
};

export function StatusBadge({ type }: StatusBadgeProps) {
  if (type === "occupied") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 bg-[#F4EBDC] px-2 py-1 text-[10px] font-medium text-[#8A642F]">
        <Clock3 size={12} />
        Dolu
      </span>
    );
  }

  if (type === "inactive") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 bg-[#F3E2DE] px-2 py-1 text-[10px] font-medium text-[#9C5148]">
        <XCircle size={12} />
        Kapalı
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 bg-[#E6EFE6] px-2 py-1 text-[10px] font-medium text-[#486348]">
      <CheckCircle2 size={12} />
      Müsait
    </span>
  );
}
