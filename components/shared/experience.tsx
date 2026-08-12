import {
  LuHouse,
  LuLeaf,
  LuWaves,
} from "react-icons/lu";

import type { HomepageContent } from "@/types/homepage-content";

type AboutExperienceProps = {
  content: HomepageContent | null;
};

export default function AboutExperience({
  content,
}: AboutExperienceProps) {
  const features = [
    {
      icon: LuLeaf,
      title:
        content?.feature_1_title ||
        "DOĞANIN İÇİNDE",
      description:
        content?.feature_1_description ||
        "Yeşilin ve sakinliğin arasında.",
    },
    {
      icon: LuWaves,
      title:
        content?.feature_2_title ||
        "DENİZE BİRKAÇ ADIM",
      description:
        content?.feature_2_description ||
        "Saros'un berrak sularına doğrudan erişim.",
    },
    {
      icon: LuHouse,
      title:
        content?.feature_3_title ||
        "KENDİNE AİT BİR ALAN",
      description:
        content?.feature_3_description ||
        "Taş odalar ve bungalov seçenekleri.",
    },
  ];

  return (
    <section className="w-full border-b border-[#DDD8CC] bg-[#F5F1E8]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 px-6 md:grid-cols-4 md:px-12 lg:px-16">
        <div className="py-10 text-center md:pr-8 md:text-left lg:py-12">
          <h2 className="font-serif text-[28px] leading-[1.05] text-[#263A2D] lg:text-[30px]">
            {content?.experience_title ||
              "Sadece bir konaklama değil."}
          </h2>

          <p className="mt-5 text-[13px] leading-[1.6] text-[#555B54] md:max-w-none lg:max-w-[230px]">
            {content?.experience_description ||
              "Koru Dağları'nın eteklerinde, yeşilin içinden masmavi Saros Körfezi'ne açılan bir yaşam alanı."}
          </p>
        </div>

        {features.map(
          (
            feature,
            index,
          ) => {
            const Icon =
              feature.icon;

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center border-[#DDD8CC] py-10 text-center md:min-h-[170px] md:border-l md:px-6 lg:py-12 ${
                  index ===
                  features.length -
                    1
                    ? "md:pr-8"
                    : ""
                }`}
              >
                <Icon
                  strokeWidth={1}
                  className="mb-3 h-10 w-10 text-[#263A2D]"
                />

                <h3 className="text-[12px] font-semibold tracking-[0.16em] text-[#263A2D]">
                  {feature.title}
                </h3>

                <p className="mt-1 max-w-[190px] text-[13px] leading-[1.5] text-[#60655E]">
                  {
                    feature.description
                  }
                </p>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}