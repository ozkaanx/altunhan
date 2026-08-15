import Link from "next/link";
import { CalendarCheck, ChevronRight } from "lucide-react";

import type { DashboardReservation } from "@/lib/admin/dashboard";

import {
  formatGuestSummary,
  formatShortDate,
  getStatusClass,
} from "@/lib/admin/dashboard-formatters";

import { getReservationStatusLabel } from "@/lib/reservation/status-utils";

type UpcomingReservationsProps = {
  reservations: DashboardReservation[];
};

export function UpcomingReservations({ reservations }: UpcomingReservationsProps) {
  return (
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

      {reservations.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <CalendarCheck size={24} className="mx-auto text-[#AAA79F]" />

          <p className="mt-3 text-xs text-[#8D918A]">
            Önümüzdeki 7 gün için rezervasyon bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#F0EDE7]">
          {reservations.map((reservation) => (
            <Link
              href="/admin/reservations"
              key={reservation.id}
              className="block p-4 transition-colors hover:bg-[#FAF9F6] sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#263A2D]">{reservation.guest_name}</p>

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
  );
}

type DashboardDetailProps = {
  label: string;
  value: string;
};

function DashboardDetail({ label, value }: DashboardDetailProps) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.08em] text-[#A0A39C]">{label}</p>

      <p className="mt-1 text-[11px] font-medium text-[#4E544D]">{value}</p>
    </div>
  );
}
