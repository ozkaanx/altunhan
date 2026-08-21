import type { BedConfiguration } from "@/types/admin-room";

export const ROOM_BED_OPTIONS: Array<{
  value: BedConfiguration;
  label: string;
  capacity: number;
}> = [
  { value: "one_double", label: "1 Çift Kişilik", capacity: 2 },
  { value: "double_single", label: "1 Çift + 1 Tek", capacity: 3 },
  { value: "two_double", label: "2 Çift Kişilik", capacity: 4 },
];

export function getRoomBedCapacity(value: BedConfiguration | null) {
  if (!value) return null;

  return ROOM_BED_OPTIONS.find((option) => option.value === value)?.capacity ?? null;
}
