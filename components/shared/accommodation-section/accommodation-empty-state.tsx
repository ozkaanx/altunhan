import { LuBedDouble } from "react-icons/lu";

export function AccommodationEmptyState() {
  return (
    <div className="border border-[#DDD8CF] bg-white/40 px-6 py-12 text-center">
      <LuBedDouble
        size={30}
        strokeWidth={1}
        className="mx-auto text-[#A8754F]"
        aria-hidden="true"
      />

      <p className="mt-4 text-sm font-semibold text-[#263A2D]">
        Şu anda aktif konaklama bulunmuyor.
      </p>
    </div>
  );
}
