import Link from "next/link";

import { CalendarClock, ChevronRight, House, Users } from "lucide-react";

type DashboardAlertsProps = {
  pendingCount: number;
  activeAccommodationCount: number;
  todayCheckInsCount: number;
};

export function DashboardAlerts({
  pendingCount,
  activeAccommodationCount,
  todayCheckInsCount,
}: DashboardAlertsProps) {
  return (
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

              <p className="mt-1 text-[10px] text-[#8D806F]">{todayCheckInsCount} misafir grubu</p>
            </div>
          </div>

          <span className="text-lg font-semibold text-[#9A7041]">{todayCheckInsCount}</span>
        </div>
      </div>
    </section>
  );
}
