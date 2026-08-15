import { LogIn } from "lucide-react";

import type { DashboardReservation } from "@/lib/admin/dashboard";
import { formatGuestSummary } from "@/lib/admin/dashboard-formatters";

type TodayCheckInsProps = {
  reservations: DashboardReservation[];
};

export function TodayCheckIns({ reservations }: TodayCheckInsProps) {
  return (
    <section className="mt-6 border border-[#E3E0D8] bg-[#263A2D] p-5 text-white sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9B08A]">
            Bugün
          </p>

          <h2 className="mt-2 text-lg font-semibold">Giriş Yapacak Misafirler</h2>

          <p className="mt-1 text-xs text-white/55">{reservations.length} rezervasyon</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center bg-white/10">
          <LogIn size={19} className="text-[#C9B08A]" />
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="mt-6 border border-white/10 bg-white/5 px-4 py-6 text-center">
          <p className="text-xs text-white/60">Bugün giriş yapacak onaylı misafir bulunmuyor.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {reservations.map((reservation) => (
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
  );
}
