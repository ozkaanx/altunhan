import type { ReservationStatus } from "@/types/reservation";

import { getTurkeyToday } from "@/lib/reservation/date-utils";
import { createClient } from "@/lib/supabase/server";

export type DashboardReservation = {
  id: number;
  reservation_code: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  adult_count: number;
  child_count: number;
  total_price: number;
  status: ReservationStatus;
  created_at: string;
  accommodations: Array<{
    id: number;
    title: string;
  }>;
};

const DASHBOARD_RESERVATION_SELECT = `
  id,
  reservation_code,
  guest_name,
  check_in,
  check_out,
  adult_count,
  child_count,
  total_price,
  status,
  created_at,
  accommodations (
    id,
    title
  )
`;

function getNextSevenDays(today: string) {
  const todayDate = new Date(`${today}T00:00:00+03:00`);

  todayDate.setDate(todayDate.getDate() + 7);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(todayDate);
}

export async function getAdminDashboardData() {
  const supabase = await createClient();

  const today = getTurkeyToday();
  const nextSevenDays = getNextSevenDays(today);
  const monthStart = `${today.slice(0, 7)}-01`;

  const [
    accommodationsResult,
    reservationsResult,
    pendingResult,
    todayCheckInsResult,
    upcomingResult,
    confirmedMonthResult,
    recentResult,
  ] = await Promise.all([
    supabase
      .from("accommodations")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("is_active", true),

    supabase.from("reservations").select("id", {
      count: "exact",
      head: true,
    }),

    supabase
      .from("reservations")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "pending_approval"),

    supabase
      .from("reservations")
      .select(DASHBOARD_RESERVATION_SELECT)
      .eq("status", "confirmed")
      .eq("check_in", today)
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("reservations")
      .select(DASHBOARD_RESERVATION_SELECT)
      .in("status", ["pending_approval", "confirmed"])
      .gte("check_in", today)
      .lte("check_in", nextSevenDays)
      .order("check_in", {
        ascending: true,
      })
      .limit(5),

    supabase
      .from("reservations")
      .select("total_price")
      .eq("status", "confirmed")
      .gte("check_in", monthStart),

    supabase
      .from("reservations")
      .select(DASHBOARD_RESERVATION_SELECT)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),
  ]);

  const errors = [
    accommodationsResult.error,
    reservationsResult.error,
    pendingResult.error,
    todayCheckInsResult.error,
    upcomingResult.error,
    confirmedMonthResult.error,
    recentResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error("Dashboard verileri alınırken hata oluştu:", errors);
  }

  const confirmedMonth = confirmedMonthResult.data ?? [];

  const monthlyRevenue = confirmedMonth.reduce(
    (total, reservation) => total + Number(reservation.total_price ?? 0),
    0,
  );

  return {
    today,
    monthlyRevenue,

    activeAccommodationCount: accommodationsResult.count ?? 0,
    totalReservationCount: reservationsResult.count ?? 0,
    pendingCount: pendingResult.count ?? 0,

    todayCheckIns: (todayCheckInsResult.data ?? []) as unknown as DashboardReservation[],

    upcomingReservations: (upcomingResult.data ?? []) as unknown as DashboardReservation[],

    recentReservations: (recentResult.data ?? []) as unknown as DashboardReservation[],
  };
}
