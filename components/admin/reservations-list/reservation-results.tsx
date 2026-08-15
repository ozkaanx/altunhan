import { Eye } from "lucide-react";

import {
  ReservationStatusIcon,
  TableHead,
} from "@/components/admin/reservations-list/list-elements";

import { getReservationStatusClass } from "@/lib/admin/reservation-list-utils";

import { formatPrice } from "@/lib/formatters/price";
import { formatReservationDate } from "@/lib/reservation/date-utils";
import { getReservationStatusLabel } from "@/lib/reservation/status-utils";

import type { Reservation } from "@/types/reservation";

type ReservationResultsProps = {
  reservations: Reservation[];
  onSelect: (reservation: Reservation) => void;
};

export function ReservationResults({ reservations, onSelect }: ReservationResultsProps) {
  if (reservations.length === 0) {
    return (
      <div className="mt-5 border border-[#E3E0D8] bg-white px-5 py-16 text-center">
        <p className="text-sm font-semibold text-[#263A2D]">Rezervasyon bulunamadı</p>

        <p className="mt-1 text-xs text-[#969990]">
          Arama veya filtreye uygun rezervasyon bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 space-y-3 md:hidden">
        {reservations.map((reservation) => (
          <article key={reservation.id} className="border border-[#E3E0D8] bg-white p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="break-all text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8754F]">
                  {reservation.reservation_code}
                </p>

                <h2 className="mt-1 text-base font-semibold text-[#263A2D]">
                  {reservation.guest_name}
                </h2>

                <p className="mt-1 text-[11px] text-[#8B8E87]">{reservation.guest_phone}</p>
              </div>

              <span
                className={`flex w-fit shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium ${getReservationStatusClass(
                  reservation.status,
                )}`}
              >
                <ReservationStatusIcon status={reservation.status} />

                {getReservationStatusLabel(reservation.status)}
              </span>
            </div>

            <div className="mt-4 border-y border-[#EEEAE3] py-4">
              <p className="text-sm font-semibold text-[#263A2D]">
                {reservation.accommodations?.title ?? "Konaklama"}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-[#969990]">Giriş</p>

                  <p className="mt-1 text-xs font-medium text-[#4C524B]">
                    {formatReservationDate(reservation.check_in)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Çıkış</p>

                  <p className="mt-1 text-xs font-medium text-[#4C524B]">
                    {formatReservationDate(reservation.check_out)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Süre</p>

                  <p className="mt-1 text-xs font-medium text-[#4C524B]">
                    {reservation.night_count} gece
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Misafir</p>

                  <p className="mt-1 text-xs font-medium text-[#4C524B]">
                    {reservation.adult_count} yetişkin
                    {reservation.child_count > 0 ? ` · ${reservation.child_count} çocuk` : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#969990]">Toplam</p>

                <p className="mt-1 text-xl font-semibold text-[#263A2D]">
                  {formatPrice(Number(reservation.total_price))}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelect(reservation)}
                className="flex h-10 shrink-0 items-center gap-2 bg-[#263A2D] px-4 text-xs font-medium text-white"
              >
                <Eye size={15} />
                Görüntüle
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 hidden overflow-x-auto border border-[#E3E0D8] bg-white md:block">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#ECE8E1]">
              <TableHead>Rezervasyon</TableHead>
              <TableHead>Misafir</TableHead>
              <TableHead>Konaklama</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead align="right">İşlem</TableHead>
            </tr>
          </thead>

          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="border-b border-[#F0EDE7] last:border-0">
                <td className="px-5 py-4 text-xs font-semibold text-[#263A2D]">
                  {reservation.reservation_code}
                </td>

                <td className="px-5 py-4">
                  <p className="text-xs font-medium text-[#343A34]">{reservation.guest_name}</p>

                  <p className="mt-1 text-[10px] text-[#969990]">{reservation.guest_phone}</p>
                </td>

                <td className="px-5 py-4 text-xs text-[#646A63]">
                  {reservation.accommodations?.title ?? "—"}
                </td>

                <td className="px-5 py-4 text-xs text-[#646A63]">
                  {formatReservationDate(reservation.check_in)}
                  {" → "}
                  {formatReservationDate(reservation.check_out)}
                </td>

                <td className="px-5 py-4 text-xs font-semibold text-[#263A2D]">
                  {formatPrice(Number(reservation.total_price))}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1.5 text-[10px] font-medium ${getReservationStatusClass(
                      reservation.status,
                    )}`}
                  >
                    {getReservationStatusLabel(reservation.status)}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onSelect(reservation)}
                    className="inline-flex h-9 items-center gap-2 border border-[#DDD9D1] px-3 text-xs text-[#263A2D]"
                  >
                    <Eye size={14} />
                    Görüntüle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
