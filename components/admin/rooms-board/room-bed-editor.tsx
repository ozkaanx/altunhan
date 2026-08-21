"use client";

import { BedDouble, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateRoomBedConfiguration } from "@/app/admin/rooms/action";
import { getRoomBedCapacity, ROOM_BED_OPTIONS } from "@/lib/admin/room-bed-config";

import type { BedConfiguration } from "@/types/admin-room";

type RoomBedEditorProps = {
  roomId: number;
  bedConfiguration: BedConfiguration | null;
  maxGuests: number | null;
};

export function RoomBedEditor({
  roomId,
  bedConfiguration,
  maxGuests,
}: RoomBedEditorProps) {
  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState<BedConfiguration | "">(
    bedConfiguration ?? "",
  );
  const [savedValue, setSavedValue] = useState<BedConfiguration | "">(
    bedConfiguration ?? "",
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedConfiguration = selectedValue || null;

  const calculatedCapacity =
    getRoomBedCapacity(selectedConfiguration) ??
    (selectedValue === savedValue ? maxGuests : null);

  const hasChanges = selectedValue !== savedValue;

  const handleSave = () => {
    setError("");

    startTransition(async () => {
      const result = await updateRoomBedConfiguration(
        roomId,
        selectedValue === "" ? null : selectedValue,
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSavedValue(result.room.bedConfiguration ?? "");
      router.refresh();
    });
  };

  return (
    <div className="mt-4 border-t border-[#E8E4DC] pt-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8B8E87]">
            <BedDouble size={13} aria-hidden="true" />
            Yatak Düzeni
          </span>

          <select
            value={selectedValue}
            disabled={isPending}
            onChange={(event) => {
              setSelectedValue(event.target.value as BedConfiguration | "");
              setError("");
            }}
            className="h-10 w-full border border-[#DAD6CD] bg-white px-3 text-xs font-medium text-[#263A2D] outline-none transition-colors focus:border-[#A8754F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Belirtilmedi</option>

            {ROOM_BED_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={!hasChanges || isPending}
          onClick={handleSave}
          className="h-10 border border-[#263A2D] bg-[#263A2D] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
        >
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#777C75]">
        <Users size={13} aria-hidden="true" />

        {calculatedCapacity ? (
          <span>
            Maksimum kapasite:{" "}
            <strong className="font-semibold text-[#4E554E]">
              {calculatedCapacity} kişi
            </strong>
          </span>
        ) : (
          <span>Kapasite yatak düzenine göre otomatik hesaplanır.</span>
        )}
      </div>

      {error && <p className="mt-2 text-[11px] font-medium text-[#9C5148]">{error}</p>}
    </div>
  );
}
