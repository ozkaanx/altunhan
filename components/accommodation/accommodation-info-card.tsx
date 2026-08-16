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
        min-w-0
        flex-col
        items-center
        justify-center
        gap-2
        overflow-hidden
        border
        border-[#DDD8CC]
        bg-[#F8F4EB]
        px-2
        py-3
        text-center
        sm:gap-3
        sm:px-4
        sm:py-4
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

      <div className="min-w-0">
        <p
          className="
            text-[8px]
            uppercase
            leading-none
            tracking-[0.1em]
            text-[#969A93]
            sm:text-[9px]
            sm:tracking-[0.14em]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1.5
            text-[11px]
            font-semibold
            leading-4
            text-[#263A2D]
            sm:text-xs
            sm:leading-5
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}
