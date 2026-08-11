import Image from "next/image";
import Link from "next/link";
import { CiLocationOn } from "react-icons/ci";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative h-[calc(100vh-128px)] min-h-[600px] w-full overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/images/hero/altunhan-farm.jpg"
        alt="Altunhan Farm - Saros Körfezi"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-center px-16">
        
        <div className="max-w-[650px] text-white">

          {/* Small Label */}
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.3em] text-white/80">
            ALTUNHAN FARM
          </p>

          {/* Heading */}
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Saros'un doğayla
            <br />
            buluştuğu yer.
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-[500px] text-base leading-7 text-white/90 md:text-lg">
            Doğanın içinde, denize birkaç adım.
            <br className="hidden md:block" />
            Uzun sofralar, sakin günler ve iyi hissettiren anlar.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-4">

            <Link
              href="/konaklama"
              className="
                group
                inline-flex
                h-12
                items-center
                gap-3
                border
                border-white
                bg-white
                px-7
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-[#263A2D]
                transition-all
                duration-300
                hover:bg-transparent
                hover:text-white
              "
            >
              Konaklamayı Keşfet

              <FiArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/rezervasyon"
              className="
                inline-flex
                h-12
                items-center
                justify-center
                border
                border-white/70
                bg-transparent
                px-7
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-white
                transition-all
                duration-300
                hover:bg-white
                hover:text-[#263A2D]
              "
            >
              Rezervasyon Yap
            </Link>

          </div>
        </div>
      </div>

      {/* Location */}
      <div
        className="
          absolute
          bottom-8
          left-16
          z-10
          flex
          items-center
          gap-2
          text-white/90
        "
      >
        <CiLocationOn className="text-xl" />

        <span className="text-xs tracking-wide hidden md:inline-block">
          Adilhan Köyü, Keşan / Edirne
        </span>
      </div>

      {/* Scroll Indicator */}
      <div
        className="
          absolute
          bottom-7
          left-1/2
          z-10
          hidden
          -translate-x-1/2
          flex-col
          items-center
          gap-3
          text-white/80
          md:flex
        "
      >
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