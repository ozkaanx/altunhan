import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { LuLeaf, LuWaves, LuHouse } from "react-icons/lu";

const features = [
  {
    icon: LuLeaf,
    title: "DOĞANIN İÇİNDE",
    description: "Yeşilin ve sakinliğin arasında.",
  },
  {
    icon: LuWaves,
    title: "DENİZE BİRKAÇ ADIM",
    description: "Saros'un berrak sularına doğrudan erişim.",
  },
  {
    icon: LuHouse,
    title: "KENDİNE AİT BİR ALAN",
    description: "Taş odalar ve bungalov seçenekleri.",
  },
];

export default function AboutExperience() {
  return (
    <section className="w-full border-b border-[#DDD8CC] bg-[#F5F1E8]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 px-6 md:grid-cols-4 md:px-12 lg:px-16">
        {/* Intro */}
        <div className="py-10 md:pr-8 lg:py-12 text-center md:text-left">
          <h2 className="font-serif text-[28px] leading-[0.95] text-[#263A2D] lg:text-[30px]">
            Sadece bir
            <br />
            konaklama değil.
          </h2>

          <p className="lg:max-w-[230px] mt-5  text-[13px] leading-[1.6] text-[#555B54] md:max-w-none">
            Koru Dağları'nın eteklerinde, yeşilin içinden masmavi Saros
            Körfezi'ne açılan bir yaşam alanı.
          </p>

          <Link
            href="/hakkimizda"
            className="
              group
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
            Hakkımızda
            <FiArrowRight
              size={12}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>

        {/* Features */}
        {features?.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className={`
                flex
                flex-col
                items-center
                justify-center
                border-[#DDD8CC]
                py-10
                text-center
                md:min-h-[170px]
                md:border-l
                md:px-6
                lg:py-12
                ${index === features?.length - 1 ? "md:pr-8" : ""}
              `}
            >
              {/* Icon */}
              <Icon strokeWidth={1} className="mb-3 h-10 w-10 text-[#263A2D]" />

              {/* Title */}
              <h3 className="text-[12px] font-semibold tracking-[0.16em] text-[#263A2D]">
                {feature?.title}
              </h3>

              {/* Description */}
              <p className="mt-1 max-w-[190px] text-[13px] leading-[1.5] text-[#60655E]">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
