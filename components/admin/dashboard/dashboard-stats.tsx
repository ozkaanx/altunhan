import { CalendarCheck, CalendarClock, CircleDollarSign, House } from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";

type DashboardStatsProps = {
  totalReservationCount: number;
  pendingCount: number;
  activeAccommodationCount: number;
  monthlyRevenue: number;
};

export function DashboardStats({
  totalReservationCount,
  pendingCount,
  activeAccommodationCount,
  monthlyRevenue,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Toplam Rezervasyon",
      value: totalReservationCount.toLocaleString("tr-TR"),
      description: "Tüm rezervasyonlar",
      icon: CalendarCheck,
    },
    {
      title: "Onay Bekleyen",
      value: pendingCount.toLocaleString("tr-TR"),
      description: "Dekont kontrolü",
      icon: CalendarClock,
    },
    {
      title: "Aktif Konaklama",
      value: activeAccommodationCount.toLocaleString("tr-TR"),
      description: "Rezervasyona açık",
      icon: House,
    },
    {
      title: "Bu Ay Gelir",
      value: formatPrice(monthlyRevenue),
      description: "Onaylı rezervasyon",
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article key={stat.title} className="border border-[#E3E0D8] bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] text-[#83877F] sm:text-xs">{stat.title}</p>

                <p className="mt-3 break-words text-xl font-semibold tracking-tight text-[#263A2D] sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-2 text-[10px] text-[#A0A39C] sm:text-[11px]">{stat.description}</p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#EEF0EA] text-[#526048] sm:h-10 sm:w-10">
                <Icon size={18} strokeWidth={1.6} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
