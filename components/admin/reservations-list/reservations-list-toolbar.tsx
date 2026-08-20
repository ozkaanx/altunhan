import Link from "next/link";

import { Clock3, Plus, Search } from "lucide-react";

import { reservationStatusFilters } from "@/lib/admin/reservation-list-utils";

import { getReservationStatusLabel } from "@/lib/reservation/status-utils";

import type { ReservationStatus } from "@/types/reservation";

type ReservationsListToolbarProps = {
  pendingCount: number;
  totalCount: number;
  firstItem: number;
  lastItem: number;
  activeStatus: ReservationStatus | "all";
  search: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: ReservationStatus | "all") => void;
};

export function ReservationsListToolbar({
  pendingCount,
  totalCount,
  firstItem,
  lastItem,
  activeStatus,
  search,
  onSearchChange,
  onFilterChange,
}: ReservationsListToolbarProps) {
  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-[#8B8E87]">Rezervasyon Yönetimi</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
            Rezervasyonlar
          </h1>

          <p className="mt-2 text-sm text-[#71756E]">
            Gelen rezervasyonları ve ödeme durumlarını yönetin.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <Link
            href="/admin/reservations/new"
            className="flex h-11 items-center justify-center gap-2 bg-[#263A2D] px-5 text-xs font-semibold text-white"
          >
            <Plus size={15} />
            Yeni Rezervasyon
          </Link>

          {pendingCount > 0 && (
            <div className="flex w-fit items-center gap-2 bg-[#EAE6F4] px-3 py-2 text-xs font-medium text-[#655D8A]">
              <Clock3 size={15} />
              {pendingCount} ödeme kontrol bekliyor
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="relative max-w-[420px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92968E]" />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Misafir, telefon, e-posta veya rezervasyon kodu ara..."
            className="h-11 w-full min-w-0 border border-[#DDD9D1] bg-white pl-10 pr-4 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {reservationStatusFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`shrink-0 border px-3 py-2 text-[11px] font-medium ${
                activeStatus === filter
                  ? "border-[#263A2D] bg-[#263A2D] text-white"
                  : "border-[#DDD9D1] bg-white text-[#6D726B]"
              }`}
            >
              {filter === "all" ? "Aktif" : getReservationStatusLabel(filter)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1 text-xs text-[#858A83] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Toplam <span className="font-semibold text-[#263A2D]">{totalCount}</span>{" "}
          {activeStatus === "all" ? "aktif rezervasyon" : "rezervasyon"}
        </p>

        {totalCount > 0 && (
          <p>
            {firstItem}–{lastItem} arası gösteriliyor
          </p>
        )}
      </div>
    </>
  );
}
