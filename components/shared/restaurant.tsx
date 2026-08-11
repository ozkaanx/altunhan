import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCoffee,
  FiSun,
  FiDrumstick,
} from "react-icons/fi";
import { LuSalad } from "react-icons/lu";

const menuCategories = [
  {
    title: "KAHVALTI",
    description: "Doğal ve yöresel lezzetlerle güne başlangıç.",
    icon: FiCoffee,
  },
  {
    title: "DENİZ ÜRÜNLERİ",
    description: "Günün taze balıkları ve özel tarifler.",
    icon: FiSun,
  },
  {
    title: "ET & IZGARA",
    description: "Seçkin etler, ustaca hazırlanmış lezzetler.",
    icon: FiSun,
  },
  {
    title: "MEZELER",
    description: "Zengin meze çeşitleri ve eşsiz tatlar.",
    icon: LuSalad,
  },
];

export default function Restaurant() {
  return (
    <section className="w-full bg-[#F5F1E8] px-6 py-20 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-[1500px]">

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* LEFT */}
          <div>

            {/* Label */}
            <span className="block text-[14px] font-semibold uppercase tracking-[0.3em] text-[#A8754F]">
              RESTORAN
            </span>
            {/* Heading */}
            <h2 className="mt-2 font-serif text-3xl leading-[1.05] text-[#263A2D] md: text-2xl">
              Soframızda deniz,
              çiftlik ve mevsim var.
            </h2>

            {/* Description */}
            <p className="mt-2 max-w-[600px] text-[11px] leading-5 text-[#60655E]">
              Günün taze ürünleri, denizden gelen lezzetler
              ve uzun sofralar...
            </p>

            {/* Image */}
            <div className="relative mt-6 aspect-[16/7] w-full overflow-hidden">
              <Image
                src="/images/restaurant/restaurant.jpg"
                alt="Altunhan Farm Restoran"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-105
                "
              />

              <div className="absolute inset-0 bg-black/5" />
            </div>

          </div>


          {/* RIGHT */}
          <div className="flex flex-col justify-start lg:pt-1">

            {/* Menu Categories */}
            <div className="overflow-hidden rounded-md border border-[#DDD8CC] h-full">

              {menuCategories.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`
                      group
                      flex
                      min-h-[75px]
                      items-center
                      gap-5
                      px-5
                      py-4
                      transition-colors
                      duration-300
                      hover:bg-[#EDE8DC]
                      md:min-h-[82px]
                      md:px-6
                      ${index !== menuCategories.length - 1
                        ? "border-b border-[#DDD8CC]"
                        : ""
                      }
                    `}
                  >

                    {/* Icon */}
                    <div className="flex w-8 shrink-0 justify-center text-[#A8754F]">
                      <Icon
                        size={24}
                        strokeWidth={1.2}
                      />
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="text-[9px] font-bold tracking-[0.14em] text-[#263A2D]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-[10px] leading-5 text-[#6B706B]">
                        {item.description}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Menu Button */}
            {/* <div className="mt-2">

              <Link
                href="/restoran/menu"
                className="
                  group
                  inline-flex
                  h-10
                  items-center
                  gap-3
                  bg-[#263A2D]
                  px-7
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#A8754F]
                "
              >
                Menüyü İncele

                <FiArrowRight
                  size={12}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

            </div> */}

          </div>

        </div>

      </div>
    </section>
  );
}