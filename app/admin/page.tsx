import Link from "next/link";

import {
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  House,
  LogIn,
  Users,
} from "lucide-react";

import type { ReservationStatus } from "@/types/reservation";
import { getTurkeyToday } from "@/lib/reservation/date-utils";

import { createClient } from "@/lib/supabase/server";

import { getReservationStatusLabel } from "@/lib/reservation/status-utils";

import { formatPrice } from "@/lib/formatters/price";

type DashboardReservation = {
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

function getStatusClass(status: DashboardReservation["status"]) {
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

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",

    month: "long",

    year: "numeric",

    timeZone: "Europe/Istanbul",
  }).format(new Date(`${value}T00:00:00+03:00`));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",

    month: "short",

    timeZone: "Europe/Istanbul",
  }).format(new Date(`${value}T00:00:00+03:00`));
}

function formatGuestSummary(adultCount: number, childCount: number) {
  if (childCount > 0) {
    return `${adultCount} yetişkin · ${childCount} çocuk`;
  }

  return `${adultCount} yetişkin`;
}

export default async function AdminPage() {
  const supabase = await createClient();

  const today = getTurkeyToday();

  const todayDate = new Date(`${today}T00:00:00+03:00`);

  const nextSevenDaysDate = new Date(todayDate);

  nextSevenDaysDate.setDate(nextSevenDaysDate.getDate() + 7);

  const nextSevenDays = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",

    year: "numeric",

    month: "2-digit",

    day: "2-digit",
  }).format(nextSevenDaysDate);

  const monthStart = `${today.slice(0, 7)}-01`;

  const [
    accommodationsResult,

    reservationsResult,

    pendingResult,

    todayCheckInsResult,

    upcomingResult,

    confirmedMonthResult,
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
      .select(
        `
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
          `,
      )
      .eq("status", "confirmed")
      .eq("check_in", today)
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("reservations")
      .select(
        `
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
          `,
      )
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
      .from("reviews")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      }),
  ]);

  const recentResult = await supabase
    .from("reservations")
    .select(
      `
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
        `,
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(5);

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

  const activeAccommodationCount = accommodationsResult.count ?? 0;

  const totalReservationCount = reservationsResult.count ?? 0;

  const pendingCount = pendingResult.count ?? 0;

  const todayCheckIns = (todayCheckInsResult.data ?? []) as DashboardReservation[];

  const upcomingReservations = (upcomingResult.data ?? []) as DashboardReservation[];

  const recentReservations = (recentResult.data ?? []) as DashboardReservation[];

  const confirmedMonth = confirmedMonthResult.data ?? [];

  const monthlyRevenue = confirmedMonth.reduce(
    (total, reservation) => total + Number(reservation.total_price ?? 0),
    0,
  );

  const todayFormatted = formatLongDate(today);

  const statCards = [
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
    <section>
      <div className="mb-7">
        <p className="text-xs text-[#8B8E87]">{todayFormatted}</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">Dashboard</h1>

        <p className="mt-2 text-sm leading-6 text-[#71756E]">
          Altunhan Farm’ın rezervasyon ve konaklama durumunu buradan takip
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.title} className="border border-[#E3E0D8] bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-[#83877F] sm:text-xs">{stat.title}</p>

                  <p className="mt-3 break-words text-xl font-semibold tracking-tight text-[#263A2D] sm:text-3xl">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-[10px] text-[#A0A39C] sm:text-[11px]">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#EEF0EA] text-[#526048] sm:h-10 sm:w-10">
                  <Icon size={18} strokeWidth={1.6} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6">
        <section className="border border-[#E3E0D8] bg-[#263A2D] p-5 text-white sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9B08A]">
                Bugün
              </p>

              <h2 className="mt-2 text-lg font-semibold">Giriş Yapacak Misafirler</h2>

              <p className="mt-1 text-xs text-white/55">{todayCheckIns.length} rezervasyon</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center bg-white/10">
              <LogIn size={19} className="text-[#C9B08A]" />
            </div>
          </div>

          {todayCheckIns.length === 0 ? (
            <div className="mt-6 border border-white/10 bg-white/5 px-4 py-6 text-center">
              <p className="text-xs text-white/60">
                Bugün giriş yapacak onaylı misafir bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              {todayCheckIns.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between gap-4 border border-white/10 bg-white/5 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{reservation.guest_name}</p>

                    <p className="mt-1 truncate text-[10px] text-white/50">
                      {reservation.accommodations?.[0]?.title ?? "Konaklama"} ·{" "}
                      {formatGuestSummary(reservation.adult_count, reservation.child_count)}
                    </p>
                  </div>

                  <p className="shrink-0 text-[10px] font-medium text-[#C9B08A]">
                    {reservation.reservation_code}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="border border-[#E3E0D8] bg-white">
          <div className="flex items-center justify-between border-b border-[#EAE7E0] px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-[#263A2D]">Yaklaşan Rezervasyonlar</h2>

              <p className="mt-1 text-[10px] text-[#92958E] sm:text-[11px]">Önümüzdeki 7 gün</p>
            </div>

            <Link
              href="/admin/reservations"
              className="flex items-center gap-1 text-[10px] font-medium text-[#A8754F] sm:text-[11px]"
            >
              Tümünü Gör
              <ChevronRight size={13} />
            </Link>
          </div>

          {upcomingReservations.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <CalendarCheck size={24} className="mx-auto text-[#AAA79F]" />

              <p className="mt-3 text-xs text-[#8D918A]">
                Önümüzdeki 7 gün için rezervasyon bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EDE7]">
              {upcomingReservations.map((reservation) => (
                <Link
                  href="/admin/reservations"
                  key={reservation.id}
                  className="block p-4 transition-colors hover:bg-[#FAF9F6] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#263A2D]">
                        {reservation.guest_name}
                      </p>

                      <p className="mt-1 text-[11px] text-[#858A83]">
                        {reservation.accommodations?.[0]?.title ?? "Konaklama"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 px-2 py-1 text-[9px] font-medium ${getStatusClass(
                        reservation.status,
                      )}`}
                    >
                      {getReservationStatusLabel(reservation.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <DashboardDetail label="Giriş" value={formatShortDate(reservation.check_in)} />

                    <DashboardDetail label="Çıkış" value={formatShortDate(reservation.check_out)} />

                    <DashboardDetail
                      label="Misafir"
                      value={formatGuestSummary(reservation.adult_count, reservation.child_count)}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="border border-[#E3E0D8] bg-white">
          <div className="border-b border-[#EAE7E0] px-4 py-4 sm:px-5">
            <h2 className="text-sm font-semibold text-[#263A2D]">Dikkat Gerekenler</h2>

            <p className="mt-1 text-[10px] text-[#92958E] sm:text-[11px]">Admin işlemleri</p>
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            <Link
              href="/admin/reservations"
              className="flex items-center justify-between gap-4 border border-[#E4DCEB] bg-[#F6F3F9] p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#EAE6F4] text-[#655D8A]">
                  <CalendarClock size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#4D485F]">Ödeme Kontrolü</p>

                  <p className="mt-1 text-[10px] text-[#7D778F]">
                    {pendingCount} rezervasyon onay bekliyor
                  </p>
                </div>
              </div>

              <ChevronRight size={15} className="shrink-0 text-[#655D8A]" />
            </Link>

            <Link
              href="/admin/accommodations"
              className="flex items-center justify-between gap-4 border border-[#E0E4DA] bg-[#F3F5F0] p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#E7ECE3] text-[#526048]">
                  <House size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#4B5845]">Aktif Konaklamalar</p>

                  <p className="mt-1 text-[10px] text-[#798174]">
                    {activeAccommodationCount} konaklama yayında
                  </p>
                </div>
              </div>

              <ChevronRight size={15} className="shrink-0 text-[#526048]" />
            </Link>

            <div className="flex items-center justify-between gap-4 border border-[#EAE3D7] bg-[#FAF6EE] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F2E9D9] text-[#9A7041]">
                  <Users size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#685A47]">Bugünkü Girişler</p>

                  <p className="mt-1 text-[10px] text-[#8D806F]">
                    {todayCheckIns.length} misafir grubu
                  </p>
                </div>
              </div>

              <span className="text-lg font-semibold text-[#9A7041]">{todayCheckIns.length}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 border border-[#E3E0D8] bg-white">
        <div className="flex items-center justify-between border-b border-[#EAE7E0] px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-[#263A2D]">Son Rezervasyonlar</h2>

            <p className="mt-1 text-[10px] text-[#92958E] sm:text-[11px]">
              En son gelen 5 rezervasyon
            </p>
          </div>

          <Link
            href="/admin/reservations"
            className="flex items-center gap-1 text-[10px] font-medium text-[#A8754F] sm:text-[11px]"
          >
            Tümünü Gör
            <ChevronRight size={13} />
          </Link>
        </div>

        {recentReservations.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-xs text-[#92958E]">Henüz rezervasyon bulunmuyor.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#F0EDE7] md:hidden">
              {recentReservations.map((reservation) => (
                <Link key={reservation.id} href="/admin/reservations" className="block p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#263A2D]">
                        {reservation.guest_name}
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-[#A8754F]">
                        {reservation.reservation_code}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 px-2 py-1 text-[9px] font-medium ${getStatusClass(
                        reservation.status,
                      )}`}
                    >
                      {getReservationStatusLabel(reservation.status)}
                    </span>
                  </div>

                  <p className="mt-3 text-[11px] text-[#777C75]">
                    {reservation.accommodations?.[0]?.title ?? "Konaklama"}
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-4">
                    <p className="text-[10px] text-[#969990]">
                      {formatShortDate(reservation.check_in)} →{" "}
                      {formatShortDate(reservation.check_out)}
                    </p>

                    <p className="text-sm font-semibold text-[#263A2D]">
                      {formatPrice(reservation.total_price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#EFECE6]">
                    <TableHead>Misafir</TableHead>

                    <TableHead>Konaklama</TableHead>

                    <TableHead>Tarih</TableHead>

                    <TableHead>Tutar</TableHead>

                    <TableHead>Durum</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {recentReservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-[#F0EDE7] last:border-0">
                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-[#343A34]">
                          {reservation.guest_name}
                        </p>

                        <p className="mt-1 text-[9px] text-[#A8754F]">
                          {reservation.reservation_code}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-[#747971]">
                        {reservation.accommodations?.[0]?.title ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-xs text-[#747971]">
                        {formatShortDate(reservation.check_in)} →{" "}
                        {formatShortDate(reservation.check_out)}
                      </td>

                      <td className="px-5 py-4 text-xs font-semibold text-[#263A2D]">
                        {formatPrice(reservation.total_price)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                            reservation.status,
                          )}`}
                        >
                          {getReservationStatusLabel(reservation.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </section>
  );
}

function DashboardDetail({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.08em] text-[#A0A39C]">{label}</p>

      <p className="mt-1 text-[11px] font-medium text-[#4E544D]">{value}</p>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-[#969990]">
      {children}
    </th>
  );
}
