import type { LucideIcon } from "lucide-react";

type AccommodationInfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function AccommodationInfoCard({ icon: Icon, label, value }: AccommodationInfoCardProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        border
        border-[#DDD8CC]
        bg-[#F8F4EB]
        px-4
        py-4
        sm:flex-col
        sm:justify-center
        sm:text-center
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          text-[#526048]
        "
      >
        <Icon size={21} strokeWidth={1.3} />
      </div>

      <div>
        <p
          className="
            text-[9px]
            uppercase
            tracking-[0.14em]
            text-[#969A93]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            text-xs
            font-semibold
            text-[#263A2D]
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}
