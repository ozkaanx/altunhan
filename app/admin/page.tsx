import { getAdminDashboardData } from "@/lib/admin/dashboard";
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";

import { formatLongDate } from "@/lib/admin/dashboard-formatters";

import { TodayCheckIns } from "@/components/admin/dashboard/today-check-ins";
import { UpcomingReservations } from "@/components/admin/dashboard/upcoming-reservations";
import { DashboardAlerts } from "@/components/admin/dashboard/dashboard-alerts";
import { RecentReservations } from "@/components/admin/dashboard/recent-reservations";

export default async function AdminPage() {
  const {
    today,
    monthlyRevenue,
    activeAccommodationCount,
    totalReservationCount,
    pendingCount,
    todayCheckIns,
    upcomingReservations,
    recentReservations,
  } = await getAdminDashboardData();

  const todayFormatted = formatLongDate(today);

  return (
    <section>
      <div className="mb-7">
        <p className="text-xs text-[#8B8E87]">{todayFormatted}</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">Dashboard</h1>

        <p className="mt-2 text-sm leading-6 text-[#71756E]">
          Altunhan Farm’ın rezervasyon ve konaklama durumunu buradan takip
        </p>
      </div>

      <DashboardStats
        totalReservationCount={totalReservationCount}
        pendingCount={pendingCount}
        activeAccommodationCount={activeAccommodationCount}
        monthlyRevenue={monthlyRevenue}
      />

      <TodayCheckIns reservations={todayCheckIns} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <UpcomingReservations reservations={upcomingReservations} />

        <DashboardAlerts
          pendingCount={pendingCount}
          activeAccommodationCount={activeAccommodationCount}
          todayCheckInsCount={todayCheckIns.length}
        />
      </div>

      <RecentReservations reservations={recentReservations} />
    </section>
  );
}
