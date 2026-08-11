import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { LuBedDouble } from "react-icons/lu";

const accommodations = [
  {
    title: "TAŞ ODALAR",
    description:
      "Doğal taş dokusuyla sakin ve karakterli bir konaklama deneyimi.",
    image: "/images/hero/tas_ev.jpg",
    href: "/konaklama/tas-odalar",
    icon: LuBedDouble,
  },
    {
    title: "TAŞ ODALAR",
    description:
      "Doğal taş dokusuyla sakin ve karakterli bir konaklama deneyimi.",
    image: "/images/hero/tas_ev.jpg",
    href: "/konaklama/tas-odalar",
    icon: LuBedDouble,
  },
    {
    title: "TAŞ ODALAR",
    description:
      "Doğal taş dokusuyla sakin ve karakterli bir konaklama deneyimi.",
    image: "/images/hero/tas_ev.jpg",
    href: "/konaklama/tas-odalar",
    icon: LuBedDouble,
  },
    {
    title: "TAŞ ODALAR",
    description:
      "Doğal taş dokusuyla sakin ve karakterli bir konaklama deneyimi.",
    image: "/images/hero/tas_ev.jpg",
    href: "/konaklama/tas-odalar",
    icon: LuBedDouble,
  },
];

export default function Accommodation() {
  return (
    <section className="w-full bg-[#F5F1E8] px-6 py-20 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        {/* Section Heading */}
        <div className="mb-12 text-center md:mb-14">
          <span className="mb-4 block text-[9px] font-medium uppercase tracking-[0.3em] text-[#A8754F]">
            KONAKLAMA
          </span>

          <h2 className="font-serif text-4xl leading-none text-[#263A2D] md:text-5xl lg:text-6xl">
            Konakla. Yavaşla. Hisset.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-4 md:gap-6 lg:gap-8">
          {accommodations.map((item , index) => {
            const Icon = item.icon;

            return (
              <article key={index} className="group relative pb-16">
                {/* Image */}
                <div className="relative aspect-[1.15/1] overflow-hidden md:aspect-[1.05/1]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-105
                    "
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/10" />
                </div>

                {/* Floating Icon */}
                <div
                  className="
                    absolute
                    left-[-1px]
                    top-[-1px]
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-[#526048]
                    text-white
                    md:h-14
                    md:w-14
                  "
                >
                  <Icon strokeWidth={1.2} className="h-5 w-5 md:h-6 md:w-6" />
                </div>

                {/* Content Card */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-5
                    right-5
                    bg-[#F5F1E8]
                    px-6
                    py-6
                    shadow-[0_5px_25px_rgba(38,58,45,0.06)]
                    transition-transform
                    duration-500
                    group-hover:-translate-y-1
                    md:left-6
                    md:right-6
                  "
                >
                  <h3 className="text-[10px] font-semibold tracking-[0.16em] text-[#263A2D]">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-[300px] text-[11px] leading-[1.6] text-[#60655E]">
                    {item.description}
                  </p>

                  <Link
                    href={item.href}
                    className="
                      group/link
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#263A2D]
                    "
                  >
                    Keşfet
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
