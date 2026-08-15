import type { ReactNode } from "react";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { DashboardReservation } from "@/lib/admin/dashboard";

import { formatShortDate, getStatusClass } from "@/lib/admin/dashboard-formatters";

import { formatPrice } from "@/lib/formatters/price";
import { getReservationStatusLabel } from "@/lib/reservation/status-utils";

type RecentReservationsProps = {
  reservations: DashboardReservation[];
};

export function RecentReservations({ reservations }: RecentReservationsProps) {
  return (
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

      {reservations.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-xs text-[#92958E]">Henüz rezervasyon bulunmuyor.</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-[#F0EDE7] md:hidden">
            {reservations.map((reservation) => (
              <Link key={reservation.id} href="/admin/reservations" className="block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#263A2D]">{reservation.guest_name}</p>

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
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-[#F0EDE7] last:border-0">
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-[#343A34]">{reservation.guest_name}</p>

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
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-[#969990]">
      {children}
    </th>
  );
}
