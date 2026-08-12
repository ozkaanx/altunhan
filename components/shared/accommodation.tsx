import Image from "next/image";
import Link from "next/link";

import {
  FiArrowRight,
} from "react-icons/fi";

import {
  LuBedDouble,
  LuUsers,
} from "react-icons/lu";

import type {
  HomeAccommodation,
} from "@/app/page";

type AccommodationProps = {
  accommodations:
    HomeAccommodation[];
};

function getCoverImage(
  accommodation:
    HomeAccommodation,
) {
  const images =
    accommodation.accommodation_images ??
    [];

  if (
    images.length ===
    0
  ) {
    return null;
  }

  const coverImage =
    images.find(
      (image) =>
        image.is_cover,
    );

  if (
    coverImage?.image_url
  ) {
    return coverImage.image_url;
  }

  const firstImage =
    [...images].sort(
      (
        a,
        b,
      ) =>
        Number(
          a.sort_order ?? 0,
        ) -
        Number(
          b.sort_order ?? 0,
        ),
    )[0];

  return (
    firstImage?.image_url ??
    null
  );
}

export default function Accommodation({
  accommodations,
}: AccommodationProps) {
  return (
    <section
      id="konaklama"
      className="w-full bg-[#F5F1E8] px-6 py-20 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-12 text-center md:mb-14">
          <span className="mb-4 block text-[9px] font-medium uppercase tracking-[0.3em] text-[#A8754F]">
            KONAKLAMA
          </span>

          <h2 className="font-serif text-4xl leading-none text-[#263A2D] md:text-5xl lg:text-6xl">
            Konakla. Yavaşla.
            Hisset.
          </h2>

          <p className="mx-auto mt-5 max-w-[560px] text-xs leading-6 text-[#6E746C] md:text-sm">
            Doğanın içinde,
            sade ve huzurlu
            konaklama
            seçeneklerimizi
            keşfedin.
          </p>
        </div>

        {accommodations.length ===
        0 ? (
          <div className="border border-[#DDD8CF] bg-white/40 px-6 py-12 text-center">
            <LuBedDouble
              size={30}
              className="mx-auto text-[#A8754F]"
              strokeWidth={1}
            />

            <p className="mt-4 text-sm font-semibold text-[#263A2D]">
              Şu anda aktif
              konaklama
              bulunmuyor.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-10 md:gap-6 lg:gap-8 ${
              accommodations.length ===
              1
                ? "mx-auto max-w-[430px] grid-cols-1"
                : accommodations.length ===
                    2
                  ? "mx-auto max-w-[900px] md:grid-cols-2"
                  : accommodations.length ===
                      3
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2 xl:grid-cols-4"
            }`}
          >
            {accommodations.map(
              (
                item,
              ) => {
                const image =
                  getCoverImage(
                    item,
                  );

                return (
                  <article
                    key={
                      item.id
                    }
                    className="group relative pb-24"
                  >
                    <div className="relative aspect-[1.15/1] overflow-hidden bg-[#E8E2D7] md:aspect-[1.05/1]">
                      {image ? (
                        <Image 
                          src={
                            image
                          }
                          alt={
                            item.title
                          }
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <LuBedDouble
                            size={
                              42
                            }
                            strokeWidth={
                              1
                            }
                            className="text-[#AAA398]"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/10" />

                      <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 backdrop-blur">
                        <p className="text-[8px] uppercase tracking-[0.12em] text-[#8C9089]">
                          Gecelik
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#263A2D]">
                          {Number(
                            item.price,
                          ).toLocaleString(
                            "tr-TR",
                          )}{" "}
                          TL
                        </p>
                      </div>
                    </div>

                    <div className="absolute left-[-1px] top-[-1px] flex h-12 w-12 items-center justify-center rounded-full bg-[#526048] text-white md:h-14 md:w-14">
                      <LuBedDouble
                        strokeWidth={
                          1.2
                        }
                        className="h-5 w-5 md:h-6 md:w-6"
                      />
                    </div>

                    <div className="absolute bottom-0 left-5 right-5 bg-[#F5F1E8] px-6 py-6 shadow-[0_5px_25px_rgba(38,58,45,0.06)] transition-transform duration-500 group-hover:-translate-y-1 md:left-6 md:right-6">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#263A2D]">
                        {
                          item.title
                        }
                      </h3>

                      <p className="mt-3 line-clamp-2 min-h-[36px] text-[11px] leading-[1.6] text-[#60655E]">
                        {item.short_description ||
                          "Altunhan Farm'da doğayla iç içe huzurlu bir konaklama deneyimi."}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#DED9D0] pt-4">
                        <div className="flex items-center gap-2 text-[#737971]">
                          <LuUsers
                            size={
                              14
                            }
                            strokeWidth={
                              1.4
                            }
                          />

                          <span className="text-[9px] font-medium">
                            Maks.{" "}
                            {
                              item.capacity
                            }{" "}
                            kişi
                          </span>
                        </div>

                        <Link
                          href="/rezervasyon"
                          className="group/link inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#263A2D]"
                        >
                          Rezervasyon

                          <FiArrowRight
                            size={
                              12
                            }
                            className="transition-transform duration-300 group-hover/link:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}

        {accommodations.length >
          0 && (
          <div className="mt-12 text-center md:mt-14">
            <Link
              href="/rezervasyon"
              className="inline-flex h-11 items-center justify-center gap-3 border border-[#263A2D] px-6 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#263A2D] transition-colors hover:bg-[#263A2D] hover:text-white"
            >
              Rezervasyon Yap

              <FiArrowRight
                size={
                  13
                }
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}