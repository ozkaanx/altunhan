import type { DashboardReservation } from "@/lib/admin/dashboard";

export function getStatusClass(status: DashboardReservation["status"]) {
  switch (status) {
    case "pending_payment":
      return "bg-[#F4EBDC] text-[#8A642F]";

    case "pending_approval":
      return "bg-[#EAE6F4] text-[#655D8A]";

    case "confirmed":
      return "bg-[#E6EFE6] text-[#486348]";

    case "rejected":
      return "bg-[#F3E2DE] text-[#9C5148]";

    case "cancelled":
      return "bg-[#E7E9EA] text-[#5F676B]";
  }
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date(`${value}T00:00:00+03:00`));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(`${value}T00:00:00+03:00`));
}

export function formatGuestSummary(adultCount: number, childCount: number) {
  if (childCount > 0) {
    return `${adultCount} yetişkin · ${childCount} çocuk`;
  }

  return `${adultCount} yetişkin`;
}
