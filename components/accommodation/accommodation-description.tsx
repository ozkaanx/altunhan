import type { Accommodation } from "@/types/accommodation";

type AccommodationDescriptionProps = {
  description: Accommodation["description"];
  shortDescription: Accommodation["short_description"];
};

export function AccommodationDescription({
  description,
  shortDescription,
}: AccommodationDescriptionProps) {
  return (
    <div className="lg:pr-4">
      <div className="flex items-center gap-3">
        <span className="font-serif text-[12px] italic text-[#A8754F]">01</span>

        <div className="h-px w-7 bg-[#A8754F]" />

        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A8754F]">
          Altunhan Farm
        </p>
      </div>

      <h2 className="mt-4 max-w-[520px] font-serif text-[32px] leading-[1.08] text-[#263A2D] sm:text-[38px]">
        Konaklama Hakkında
      </h2>

      <div className="mt-6 border-l border-[#C9B08A] pl-5 sm:pl-6">
        <p className="max-w-[580px] whitespace-pre-line text-[14px] leading-7 text-[#5F665E] sm:text-[15px] sm:leading-8">
          {description ||
            shortDescription ||
            "Altunhan Farm'da doğayla iç içe huzurlu bir konaklama deneyimi."}
        </p>
      </div>
    </div>
  );
}
