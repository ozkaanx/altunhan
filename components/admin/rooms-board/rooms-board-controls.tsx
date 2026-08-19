import { BedDouble, CheckCircle2, Clock3, XCircle } from "lucide-react";

import { StatCard } from "@/components/admin/rooms-board/room-board-elements";

import { addDaysToDate } from "@/lib/admin/room-board-utils";

import type { RoomStatusFilter } from "@/types/admin-room";

type AccommodationOption = {
  id: number;
  title: string;
};

type RoomsBoardControlsProps = {
  stats: {
    total: number;
    occupied: number;
    available: number;
    inactive: number;
  };
  checkIn: string;
  checkOut: string;
  accommodationFilter: number | "all";
  statusFilter: RoomStatusFilter;
  accommodationOptions: AccommodationOption[];
  roomCount: number;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  onAccommodationChange: (accommodationId: number | "all") => void;
  onStatusChange: (status: RoomStatusFilter) => void;
};

const statusOptions: Array<{
  value: RoomStatusFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "Tümü",
  },
  {
    value: "available",
    label: "Müsait",
  },
  {
    value: "occupied",
    label: "Dolu",
  },
  {
    value: "inactive",
    label: "Kullanım Dışı",
  },
];

export function RoomsBoardControls({
  stats,
  checkIn,
  checkOut,
  accommodationFilter,
  statusFilter,
  accommodationOptions,
  roomCount,
  onCheckInChange,
  onCheckOutChange,
  onAccommodationChange,
  onStatusChange,
}: RoomsBoardControlsProps) {
  return (
    <>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Toplam Oda" value={stats.total} icon={BedDouble} />

        <StatCard label="Dolu" value={stats.occupied} icon={Clock3} />

        <StatCard label="Müsait" value={stats.available} icon={CheckCircle2} />

        <StatCard label="Kullanım Dışı" value={stats.inactive} icon={XCircle} />
      </div>

      <div className="mt-5 flex flex-col gap-3 border border-[#E3E0D8] bg-white p-4 lg:flex-row lg:items-center">
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-[430px]">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#92968F]">
              Giriş Tarihi
            </label>

            <input
              type="date"
              value={checkIn}
              onChange={(event) => onCheckInChange(event.target.value)}
              className="h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#92968F]">
              Çıkış Tarihi
            </label>

            <input
              type="date"
              value={checkOut}
              min={addDaysToDate(checkIn, 1)}
              onChange={(event) => onCheckOutChange(event.target.value)}
              className="h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none"
            />
          </div>
        </div>

        <div className="w-full lg:max-w-[280px]">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#92968F]">
            Oda Tipi
          </label>

          <select
            value={accommodationFilter}
            onChange={(event) => {
              const value = event.target.value;

              onAccommodationChange(value === "all" ? "all" : Number(value));
            }}
            className="h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none"
          >
            <option value="all">Tüm oda tipleri</option>

            {accommodationOptions.map((accommodation) => (
              <option key={accommodation.id} value={accommodation.id}>
                {accommodation.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 flex flex-col gap-4 bg-white p-2 pb-0 lg:flex-row lg:items-end">
          {statusOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onStatusChange(value)}
              className={`h-10 px-4 text-xs font-semibold ${
                statusFilter === value
                  ? "bg-[#263A2D] text-white"
                  : "border border-[#DDD9D1] bg-white text-[#626860]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-[#8B8E87] lg:ml-auto">{roomCount} oda gösteriliyor</p>
      </div>

      <div className="mt-7 border border-[#E3E0D8] bg-white">
        <div className="flex flex-wrap items-center gap-5 border-t border-[#EEEAE3] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#F3F7F1]" />
            <span className="text-[10px] text-[#7D817B]">Müsait</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#F6EDE2]" />
            <span className="text-[10px] text-[#7D817B]">Dolu</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#F4F2EF]" />
            <span className="text-[10px] text-[#7D817B]">Kullanım Dışı</span>
          </div>
        </div>
      </div>
    </>
  );
}
