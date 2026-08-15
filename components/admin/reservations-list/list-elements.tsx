import type { ReactNode } from "react";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import type { ReservationStatus } from "@/types/reservation";

type ReservationStatusIconProps = {
  status: ReservationStatus;
};

export function ReservationStatusIcon({ status }: ReservationStatusIconProps) {
  if (status === "confirmed") {
    return <CheckCircle2 size={14} />;
  }

  if (status === "rejected" || status === "cancelled") {
    return <XCircle size={14} />;
  }

  return <Clock3 size={14} />;
}

type TableHeadProps = {
  children: ReactNode;
  align?: "left" | "right";
};

export function TableHead({ children, align = "left" }: TableHeadProps) {
  return (
    <th
      className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}
