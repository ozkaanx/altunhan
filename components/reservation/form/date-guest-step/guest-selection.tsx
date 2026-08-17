import { Baby, User, Users } from "lucide-react";

import { GuestCounter } from "@/components/reservation/form/date-guest-step/guest-counter";

import type { PublicAccommodation } from "@/types/public-reservation";

type GuestSelectionProps = {
  adultCount: number;
  childCount: number;
  selectedAccommodation: PublicAccommodation | undefined;
  onAdultCountChange: (value: number) => void;
  onChildCountChange: (value: number) => void;
};

export function GuestSelection({
  adultCount,
  childCount,
  selectedAccommodation,
  onAdultCountChange,
  onChildCountChange,
}: GuestSelectionProps) {
  const maxAdults = selectedAccommodation?.max_adults ?? 1;
  const maxChildren = selectedAccommodation?.max_children ?? 0;
  const maxTotalGuests = selectedAccommodation?.max_total_guests ?? 1;
  const totalGuests = adultCount + childCount;

  const canIncreaseAdult =
    Boolean(selectedAccommodation) && adultCount < maxAdults && totalGuests < maxTotalGuests;
  const canIncreaseChild =
    Boolean(selectedAccommodation) && childCount < maxChildren && totalGuests < maxTotalGuests;

  return (
    <div className="mt-7 border-t border-[#E3DED5] pt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-[#E9EDE6] text-[#526048]">
            <Users size={17} strokeWidth={1.5} aria-hidden="true" />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#263A2D]">Misafir Sayısı</p>
            <p className="mt-0.5 text-[9px] leading-4 text-[#969990]">
              En fazla {maxAdults} yetişkin · {maxChildren} çocuk
            </p>
          </div>
        </div>

        <p className="text-[10px] font-medium text-[#737970]">
          Toplam kapasite {maxTotalGuests} kişi
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <GuestCounter
          icon={<User size={17} />}
          title="Yetişkin"
          description={`En fazla ${maxAdults} kişi`}
          value={adultCount}
          decreaseDisabled={adultCount <= 1}
          increaseDisabled={!canIncreaseAdult}
          onDecrease={() => onAdultCountChange(adultCount - 1)}
          onIncrease={() => onAdultCountChange(adultCount + 1)}
        />

        <GuestCounter
          icon={<Baby size={17} />}
          title="Çocuk"
          description={`En fazla ${maxChildren} kişi`}
          value={childCount}
          decreaseDisabled={childCount <= 0}
          increaseDisabled={!canIncreaseChild}
          onDecrease={() => onChildCountChange(childCount - 1)}
          onIncrease={() => onChildCountChange(childCount + 1)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between bg-[#F1EFE8] px-4 py-3">
        <span className="text-[10px] text-[#7E837C]">Seçilen toplam misafir</span>
        <span className="text-xs font-semibold text-[#263A2D]" aria-live="polite">
          {totalGuests} kişi
        </span>
      </div>
    </div>
  );
}
