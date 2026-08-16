import {
  Baby,
  Bath,
  BedDouble,
  Users,
} from "lucide-react";

import {
  CounterRow,
  SectionHeader,
} from "@/components/admin/accommodation-form/form-elements";

import type { AccommodationFormValues } from "@/types/accommodation";
import type { AccommodationCounterKey } from "@/types/admin-accommodation-form";

type AccommodationCapacitySectionProps = {
  values: AccommodationFormValues;
  onDecrease: (key: AccommodationCounterKey) => void;
  onIncrease: (key: AccommodationCounterKey) => void;
};

export function AccommodationCapacitySection({
  values,
  onDecrease,
  onIncrease,
}: AccommodationCapacitySectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <SectionHeader
        title="Konaklama Bilgileri"
        description="Misafir kapasitesi, yatak ve banyo sayılarını belirleyin."
      />

      <div className="divide-y divide-[#EEEAE3] px-4 sm:px-5">
        <CounterRow
          icon={Users}
          label="Maks. Yetişkin"
          description="Aynı rezervasyonda seçilebilecek en fazla yetişkin"
          value={values.maxAdults}
          onDecrease={() => onDecrease("maxAdults")}
          onIncrease={() => onIncrease("maxAdults")}
        />

        <CounterRow
          icon={Baby}
          label="Maks. Çocuk"
          description="Aynı rezervasyonda seçilebilecek en fazla çocuk"
          value={values.maxChildren}
          onDecrease={() => onDecrease("maxChildren")}
          onIncrease={() => onIncrease("maxChildren")}
        />

        <CounterRow
          icon={Users}
          label="Toplam Misafir"
          description="Yetişkin ve çocuk toplam kapasitesi"
          value={values.maxTotalGuests}
          onDecrease={() => onDecrease("maxTotalGuests")}
          onIncrease={() => onIncrease("maxTotalGuests")}
        />

        <CounterRow
          icon={BedDouble}
          label="Yatak Sayısı"
          description="Konaklamada bulunan toplam yatak sayısı"
          value={values.bedCount}
          onDecrease={() => onDecrease("bedCount")}
          onIncrease={() => onIncrease("bedCount")}
        />

        <CounterRow
          icon={Bath}
          label="Banyo Sayısı"
          description="Konaklamada bulunan toplam banyo sayısı"
          value={values.bathroomCount}
          onDecrease={() => onDecrease("bathroomCount")}
          onIncrease={() => onIncrease("bathroomCount")}
        />
      </div>
    </section>
  );
}