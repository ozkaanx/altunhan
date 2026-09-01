import Image from "next/image";
import Link from "next/link";

import { FiArrowRight } from "react-icons/fi";
import { LuBedDouble, LuUsers } from "react-icons/lu";

import {
  getHomeAccommodationCoverImage,
  getHomeAccommodationDescription,
  getHomeAccommodationHref,
} from "@/lib/accommodation/home-accommodation-utils";
import { formatPrice } from "@/lib/formatters/price";
import {
  getSeptemberPromotionalNightlyPrice,
  isSeptemberPromotionVisible,
} from "@/lib/reservation/september-promotion";

import type { HomeAccommodation } from "@/types/home-accommodation";

type AccommodationCardProps = {
  accommodation: HomeAccommodation;
};

export function AccommodationCard({ accommodation }: AccommodationCardProps) {
  const image = getHomeAccommodationCoverImage(accommodation);
  const href = getHomeAccommodationHref(accommodation);
  const shortDescription = getHomeAccommodationDescription(accommodation);
  const showPromotion = isSeptemberPromotionVisible();

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden border border-[#DDD8CC] bg-[#FAF8F2] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(38,58,45,0.10)]">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-[#E8E2D7]">
        {image ? (
          <Image
            src={image}
            alt={accommodation.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <LuBedDouble size={42} strokeWidth={1} className="text-[#AAA398]" aria-hidden="true" />
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"
          aria-hidden="true"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#A8754F]">
              Altunhan Farm
            </p>

            <h3 className="mt-2 font-serif text-[24px] leading-[1.15] text-[#263A2D]">
              {accommodation.title}
            </h3>
          </div>

          <div className="shrink-0 border border-[#DDD8CC] bg-[#F5F1E8] px-3 py-2.5 text-right">
            <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#8C9089]">
              {showPromotion ? "Eylül Geceliği" : "Gecelik"}
            </p>

            {showPromotion ? (
              <>
                <p className="mt-1 whitespace-nowrap text-[9px] text-[#8C9089] line-through">
                  {formatPrice(accommodation.price)}
                </p>
                <p className="mt-1 whitespace-nowrap text-[17px] font-semibold leading-none tracking-tight text-[#263A2D]">
                  {formatPrice(getSeptemberPromotionalNightlyPrice(accommodation.price))}
                </p>
                <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.1em] text-[#A8754F]">
                  %20 İndirim
                </p>
              </>
            ) : (
              <p className="mt-1 whitespace-nowrap text-[17px] font-semibold leading-none tracking-tight text-[#263A2D]">
                {formatPrice(accommodation.price)}
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 line-clamp-2 min-h-[42px] text-[11px] leading-[1.8] text-[#666B64]">
          {shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#DED9D0] pt-5">
          <div className="flex items-center gap-2 text-[#737971]">
            <LuUsers size={15} strokeWidth={1.4} aria-hidden="true" />
            <span className="whitespace-nowrap text-[10px] font-medium">
              Maks. {accommodation.capacity} kişi
            </span>
          </div>

          <Link
            href={href}
            className="group/link inline-flex shrink-0 items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#263A2D]"
          >
            Detay
            <FiArrowRight
              size={12}
              className="transition-transform duration-300 group-hover/link:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
