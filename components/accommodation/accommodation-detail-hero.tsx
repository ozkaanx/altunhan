import type { ComponentProps } from "react";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import AccommodationGallery from "@/components/shared/accommodation-gallery";

type AccommodationDetailHeroProps = {
  title: string;
  images: ComponentProps<typeof AccommodationGallery>["images"];
};

export function AccommodationDetailHero({ title, images }: AccommodationDetailHeroProps) {
  return (
    <>
      <section className="border-b border-[#DDD8CC] px-5 py-5 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <Link
            href="/#konaklama"
            className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5F675E] transition-colors hover:text-[#263A2D]"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Konaklamalara Dön
          </Link>
        </div>
      </section>

      <section className="px-5 py-7 sm:px-6 sm:py-9 md:px-12 md:py-12 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <AccommodationGallery title={title} images={images} />
        </div>
      </section>
    </>
  );
}
