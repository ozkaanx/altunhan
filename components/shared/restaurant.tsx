import Image from "next/image";

import { LuBeef, LuCoffee, LuFish, LuSoup } from "react-icons/lu";

const restaurantItems = [
  {
    icon: LuCoffee,
    title: "Kahvaltı",
    description: "Doğal ve yöresel lezzetlerle güne başlangıç.",
  },
  {
    icon: LuFish,
    title: "Deniz Ürünleri",
    description: "Günün taze balıkları ve özel tarifler.",
  },
  {
    icon: LuBeef,
    title: "Et & Izgara",
    description: "Seçkin etler, ustaca hazırlanmış lezzetler.",
  },
  {
    icon: LuSoup,
    title: "Mezeler",
    description: "Zengin meze çeşitleri ve eşsiz tatlar.",
  },
];

export default function Restaurant() {
  return (
    <section
      id="restoran"
      className="w-full border-y border-[#DDD8CC] bg-[#FAF8F2]"
    >
      <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
        <div className="grid gap-7 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-12 xl:gap-16">
          {/* SOL */}
          <div className="min-w-0">
            <span className="block text-[8px] font-semibold uppercase tracking-[0.28em] text-[#A8754F] sm:text-[9px]">
              Restoran
            </span>

            <h2 className="mt-3 max-w-[680px] font-serif text-[28px] leading-[1.08] text-[#263A2D] sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px]">
              Soframızda deniz, çiftlik ve mevsim var.
            </h2>

            <p className="mt-4 max-w-[580px] text-[11px] leading-5 text-[#646A63] sm:text-xs sm:leading-6 md:text-sm">
              Günün taze ürünleri, denizden gelen lezzetler ve uzun sofralar...
            </p>

            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-[#E8E2D7] border rounded-xl sm:mt-7 sm:aspect-[16/8] lg:aspect-[16/8.2]">
              <Image
                src="/images/restaurant/restaurant1.jpg"
                alt="Altunhan Farm restoran ve sofra"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/[0.03]" />
            </div>
          </div>

          {/* SAĞ */}
          <div className="overflow-hidden border border-[#DDD8CC] bg-[#F8F5EE]">
            {restaurantItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`flex min-h-[76px] items-center gap-4 px-4 py-4 sm:min-h-[86px] sm:gap-5 sm:px-5 sm:py-5 md:px-6 ${
                    index !== restaurantItems.length - 1
                      ? "border-b border-[#DDD8CC]"
                      : ""
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#A8754F] sm:h-10 sm:w-10">
                    <Icon
                      size={24}
                      strokeWidth={1.25}
                      className="sm:h-7 sm:w-7"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#263A2D] sm:text-[10px]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-[1.6] text-[#666B64] sm:text-[11px] md:text-xs">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
