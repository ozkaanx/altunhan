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
      className="
        w-full
        border-y
        border-[#DDD8CC]
        bg-[#FAF8F2]
      "
    >
      <div
        className="
          mx-auto
          max-w-[1500px]
          px-5
          py-16
          sm:px-6
          sm:py-20
          md:px-12
          md:py-24
          lg:px-16
        "
      >
        <div
          className="
            mb-10
            grid
            gap-5
            md:mb-12
            lg:grid-cols-[1fr_0.8fr]
            lg:items-end
          "
        >
          <div>
            <span
              className="
                block
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#A8754F]
              "
            >
              Restoran
            </span>

            <h2
              className="
                mt-4
                max-w-[720px]
                font-serif
                text-[34px]
                leading-[1.05]
                text-[#263A2D]
                sm:text-4xl
                md:text-5xl
                lg:text-[54px]
              "
            >
              Soframızda deniz, çiftlik ve mevsim var.
            </h2>
          </div>

          <p
            className="
              max-w-[520px]
              text-xs
              leading-6
              text-[#646A63]
              md:text-sm
              lg:ml-auto
              lg:text-right
            "
          >
            Günün taze ürünleri, denizden gelen lezzetler ve uzun sofralar...
          </p>
        </div>

        <div
          className="
    grid
    gap-6
    lg:grid-cols-[1.3fr_0.7fr]
    lg:gap-8
  "
        >
          <div
            className="
              relative
              aspect-[4/3]
              min-h-0
              overflow-hidden
              bg-[#E8E2D7]
              sm:aspect-[16/10]
              lg:aspect-auto
              lg:min-h-[560px]
            "
          >
            <Image
              src="/images/restaurant/restaurant1.jpg"
              alt="Altunhan Farm restoran ve sofra"
              fill
              sizes="
                (max-width: 1024px) 100vw,
                65vw
              "
              className="
                object-cover
                transition-transform
                duration-1000
                hover:scale-[1.02]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/35
                via-transparent
                to-transparent
              "
            />

            <div
              className="
                absolute
                bottom-5
                left-5
                right-5
                text-white
                sm:bottom-7
                sm:left-7
                sm:right-7
              "
            >
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-white/75
                "
              >
                Altunhan Farm
              </p>

              <p
                className="
                  mt-2
                  max-w-[500px]
                  font-serif
                  text-2xl
                  leading-tight
                  sm:text-3xl
                "
              >
                İyi yemek, güzel bir günün en güzel parçası.
              </p>
            </div>
          </div>

          <div
            className="
              grid
              sm:grid-cols-2
              lg:grid-cols-1
            "
          >
            {restaurantItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`
                      group
                      flex
                      min-h-[130px]
                      items-center
                      gap-5
                      px-5
                      py-6
                      transition-colors
                      duration-300
                      hover:bg-[#EEE9DE]
                      sm:px-6
                      lg:min-h-0
                      lg:flex-1
                      lg:px-8

                      ${index < restaurantItems.length - 1 ? "border-b border-[#DDD8CC]" : ""}

                      ${index % 2 === 0 ? "sm:border-r lg:border-r-0" : ""}

                      ${index < 2 ? "sm:border-b" : "sm:border-b-0"}

                      ${index < restaurantItems.length - 1 ? "lg:border-b" : "lg:border-b-0"}
                    `}
                >
                  <div
                    className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        border
                        border-[#CFC8BB]
                        text-[#A8754F]
                        transition-colors
                        duration-300
                        group-hover:border-[#A8754F]
                      "
                  >
                    <Icon size={23} strokeWidth={1.2} />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#263A2D]
                        "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                          mt-2
                          max-w-[280px]
                          text-[11px]
                          leading-[1.7]
                          text-[#666B64]
                          sm:text-xs
                        "
                    >
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
