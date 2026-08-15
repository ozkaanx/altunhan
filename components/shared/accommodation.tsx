import Image from "next/image";
import Link from "next/link";

import { FiArrowRight } from "react-icons/fi";
import { LuBedDouble, LuUsers } from "react-icons/lu";

import type { HomeAccommodation } from "@/app/page";
import { formatPrice } from "@/lib/formatters/price";
import type { HomepageContent } from "@/types/homepage-content";

type AccommodationProps = {
  accommodations: HomeAccommodation[];
  content: HomepageContent | null;
};

function getCoverImage(accommodation: HomeAccommodation) {
  const images = accommodation.accommodation_images ?? [];

  if (images.length === 0) {
    return null;
  }

  const coverImage = images.find((image) => image.is_cover);

  if (coverImage?.image_url) {
    return coverImage.image_url;
  }

  const firstImage = [...images].sort(
    (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
  )[0];

  return firstImage?.image_url ?? null;
}

function getShortDescription(accommodation: HomeAccommodation) {
  const description = accommodation.short_description?.trim();

  if (!description || description.length < 8) {
    return "Doğayla iç içe, sakin ve konforlu bir konaklama deneyimi.";
  }

  return description;
}

export default function Accommodation({
  accommodations,
  content,
}: AccommodationProps) {
  return (
    <section
      id="konaklama"
      className="
        w-full
        bg-[#F5F1E8]
        px-5
        py-16
        sm:px-6
        sm:py-20
        md:px-12
        md:py-24
        lg:px-16
      "
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 text-center md:mb-14">
          <span
            className="
              mb-4
              block
              text-[9px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-[#A8754F]
            "
          >
            {content?.accommodation_label || "KONAKLAMA"}
          </span>

          <h2
            className="
              font-serif
              text-[34px]
              leading-[1.05]
              text-[#263A2D]
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
          >
            {content?.accommodation_title || "Konakla. Yavaşla. Hisset."}
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-[560px]
              text-xs
              leading-6
              text-[#6E746C]
              md:text-sm
            "
          >
            {content?.accommodation_description ||
              "Doğanın içinde, sade ve huzurlu konaklama seçeneklerimizi keşfedin."}
          </p>
        </div>

        {accommodations.length === 0 ? (
          <div
            className="
              border
              border-[#DDD8CF]
              bg-white/40
              px-6
              py-12
              text-center
            "
          >
            <LuBedDouble
              size={30}
              strokeWidth={1}
              className="mx-auto text-[#A8754F]"
            />

            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-[#263A2D]
              "
            >
              Şu anda aktif konaklama bulunmuyor.
            </p>
          </div>
        ) : (
          <div
            className={`
              grid
              items-stretch
              gap-6
              ${
                accommodations.length === 1
                  ? "mx-auto max-w-[430px] grid-cols-1"
                  : accommodations.length === 2
                    ? "mx-auto max-w-[900px] md:grid-cols-2"
                    : accommodations.length === 3
                      ? "md:grid-cols-3"
                      : "md:grid-cols-2 xl:grid-cols-4"
              }
            `}
          >
            {accommodations.map((item) => {
              const image = getCoverImage(item);

              const href = item.slug
                ? `/konaklama/${item.slug}`
                : "/rezervasyon";

              const shortDescription = getShortDescription(item);

              return (
                <article
                  key={item.id}
                  className="
                    group
                    flex
                    h-full
                    min-w-0
                    flex-col
                    overflow-hidden
                    border
                    border-[#DDD8CC]
                    bg-[#FAF8F2]
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:shadow-[0_18px_45px_rgba(38,58,45,0.10)]
                  "
                >
                  <Link
                    href={href}
                    className="
                      relative
                      block
                      aspect-[4/3]
                      overflow-hidden
                      bg-[#E8E2D7]
                    "
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={item.title}
                        fill
                        sizes="
                          (max-width: 768px) 100vw,
                          (max-width: 1280px) 50vw,
                          25vw
                        "
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          w-full
                          items-center
                          justify-center
                        "
                      >
                        <LuBedDouble
                          size={42}
                          strokeWidth={1}
                          className="text-[#AAA398]"
                        />
                      </div>
                    )}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/10
                        via-transparent
                        to-transparent
                      "
                    />
                  </Link>

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      p-5
                      sm:p-6
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
                            text-[#A8754F]
                          "
                        >
                          Altunhan Farm
                        </p>

                        <h3
                          className="
                            mt-2
                            font-serif
                            text-[24px]
                            leading-[1.15]
                            text-[#263A2D]
                          "
                        >
                          {item.title}
                        </h3>
                      </div>

                      <div
                        className="
                          shrink-0
                          border
                          border-[#DDD8CC]
                          bg-[#F5F1E8]
                          px-3
                          py-2.5
                          text-right
                        "
                      >
                        <p
                          className="
                            text-[8px]
                            font-medium
                            uppercase
                            tracking-[0.15em]
                            text-[#8C9089]
                          "
                        >
                          Gecelik
                        </p>

                        <p
                          className="
                            mt-1
                            whitespace-nowrap
                            text-[17px]
                            font-semibold
                            leading-none
                            tracking-tight
                            text-[#263A2D]
                          "
                        >
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <p
                      className="
                        mt-4
                        line-clamp-2
                        min-h-[42px]
                        text-[11px]
                        leading-[1.8]
                        text-[#666B64]
                      "
                    >
                      {shortDescription}
                    </p>

                    <div
                      className="
                        mt-auto
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-t
                        border-[#DED9D0]
                        pt-5
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-[#737971]
                        "
                      >
                        <LuUsers size={15} strokeWidth={1.4} />

                        <span
                          className="
                            whitespace-nowrap
                            text-[10px]
                            font-medium
                          "
                        >
                          Maks. {item.capacity} kişi
                        </span>
                      </div>

                      <Link
                        href={href}
                        className="
                          group/link
                          inline-flex
                          shrink-0
                          items-center
                          gap-2
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[#263A2D]
                        "
                      >
                        Detay
                        <FiArrowRight
                          size={12}
                          className="
                            transition-transform
                            duration-300
                            group-hover/link:translate-x-1
                          "
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {accommodations.length > 0 && (
          <div className="mt-10 text-center md:mt-14">
            <Link
              href="/rezervasyon"
              className="
                inline-flex
                h-12
                items-center
                justify-center
                gap-3
                border
                border-[#263A2D]
                px-7
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#263A2D]
                transition-colors
                hover:bg-[#263A2D]
                hover:text-white
              "
            >
              Rezervasyon Yap
              <FiArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
