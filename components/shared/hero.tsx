import Image from "next/image";
import Link from "next/link";

import { CiLocationOn } from "react-icons/ci";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";

import type { HomepageContent } from "@/types/homepage-content";
import type { SiteSettings } from "@/types/site-settings";

type HeroProps = {
  content: HomepageContent | null;
  settings: SiteSettings | null;
};

export default function Hero({ content, settings }: HeroProps) {
  const label = content?.hero_label || "ALTUNHAN FARM";

  const title = content?.hero_title || "Saros'un doğayla buluştuğu yer.";

  const description =
    content?.hero_description ||
    "Doğanın içinde, denize birkaç adım. Uzun sofralar, sakin günler ve iyi hissettiren anlar.";

  const address = settings?.address?.trim() || "Adilhan Köyü, Keşan / Edirne";

  return (
    <section className="relative h-[calc(100svh-112px)] min-h-[560px] w-full overflow-hidden md:h-[calc(100svh-128px)] md:min-h-[600px]">
      {" "}
      <Image
        src={settings?.hero_image_url || "/images/hero/altunhan-farm.jpg"}
        alt="Altunhan Farm - Saros Körfezi"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-center px-6 md:px-12 lg:px-16">
        <div className="max-w-[650px] text-white">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.3em] text-white/80">
            {label}
          </p>

          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {" "}
            {title}
          </h1>

          <p className="mt-7 max-w-[540px] whitespace-pre-line text-base leading-7 text-white/90 md:text-lg">
            {description}
          </p>

          <div className="mt-9 grid max-w-[360px] gap-3 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/#konaklama"
              className="group inline-flex h-12 items-center gap-3 border border-white bg-white px-7 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#263A2D] transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              Konaklamayı Keşfet
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/rezervasyon"
              className="inline-flex h-12 items-center justify-center border border-white/70 bg-transparent px-7 text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-white hover:text-[#263A2D]"
            >
              Rezervasyon Yap
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-6 z-10 flex items-center gap-2 text-white/90 md:left-12 lg:left-16">
        <CiLocationOn className="text-xl" />

        <span className="hidden text-xs tracking-wide md:inline-block">
          {address}
        </span>
      </div>
      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/80 md:flex">
        <span className="text-[9px] uppercase tracking-[0.3em]">
          Aşağı Kaydır
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50">
          <FiArrowDown className="animate-bounce text-sm" />
        </div>
      </div>
    </section>
  );
}
