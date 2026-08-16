import Image from "next/image";

import { getCoverImage } from "@/components/reservation/form/reservation-summary/reservation-summary-utils";

import type { PublicAccommodation } from "@/types/public-reservation";

type ReservationSummaryHeaderProps = {
  accommodation: PublicAccommodation | undefined;
};

export function ReservationSummaryHeader({ accommodation }: ReservationSummaryHeaderProps) {
  const coverImage = getCoverImage(accommodation?.accommodation_images);

  return (
    <div className="relative h-[150px] overflow-hidden bg-[#E8E2D7]">
      {coverImage ? (
        <Image
          src={coverImage}
          alt={accommodation?.title ?? "Altunhan Farm"}
          fill
          sizes="380px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center font-serif text-xl text-[#8B8F87]">
          Altunhan Farm
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#1E3024]/80 via-[#1E3024]/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/65">
          Rezervasyon Özeti
        </p>

        <h2 className="mt-1.5 font-serif text-2xl leading-tight">
          {accommodation?.title ?? "Konaklama seçin"}
        </h2>
      </div>
    </div>
  );
}
