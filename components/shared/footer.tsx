import Link from "next/link";

import {
  FiArrowUpRight,
  FiInstagram,
  FiMapPin,
  FiPhone,
  FiMail,
  FiMessageCircle,
} from "react-icons/fi";

import type { HomeAccommodation } from "@/app/page";
import type { SiteSettings } from "@/types/site-settings";
import type { HomepageContent } from "@/types/homepage-content";

type FooterProps = {
  settings: SiteSettings | null;
  accommodations: HomeAccommodation[];
  content: HomepageContent | null;
};

export default function Footer({
  settings,
  accommodations,
  content,
}: FooterProps) {
  const phone = settings?.phone?.trim() || "";

  const whatsapp = settings?.whatsapp?.trim() || "";

  const email = settings?.email?.trim() || "";

  const address = settings?.address?.trim() || "";

  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;

  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
    : null;

  const mapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address,
      )}`
    : null;

  return (
    <footer id="footer" className="w-full bg-[#263A2D] text-[#F5F1E8]">
      <section className="border-b border-white/10 px-6 py-16 md:px-12 md:py-20 lg:px-16">
        {" "}
        <div className="mx-auto max-w-[1500px] text-center">
          <span className="block text-[9px] font-medium uppercase tracking-[0.35em] text-[#C59A6A]">
            {content?.footer_label || "ALTUNHAN FARM"}
          </span>

          <h2 className="mx-auto mt-5 max-w-[800px] font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            {content?.footer_title || "Sizi Saros'un huzuruna bekliyoruz."}
          </h2>

          <p className="mx-auto mt-6 max-w-[500px] text-sm leading-6 text-white/60">
            {content?.footer_description ||
              "Doğanın içinde, denizin kıyısında unutulmaz bir konaklama deneyimi için yerinizi ayırın."}
          </p>

          <Link
            href="/rezervasyon"
            className="group mt-8 inline-flex items-center gap-4 bg-[#F5F1E8] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#263A2D] transition-all duration-300 hover:bg-[#C59A6A] hover:text-white"
          >
            Rezervasyon Yap
            <FiArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </section>

      <section className="px-6 py-14 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <Link href="/" className="font-serif text-3xl tracking-tight">
                Altunhan
                <span className="block text-lg tracking-[0.15em]">FARM</span>
              </Link>

              <p className="mt-6 max-w-[280px] text-xs leading-6 text-white/55">
                Saros&apos;un kıyısında, doğayla iç içe, sakin ve unutulmaz bir
                yaşam deneyimi.
              </p>
            </div>

            <div>
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C59A6A]">
                Keşfet
              </h3>

              <ul className="mt-6 space-y-3">
                <li>
                  <Link
                    href="/#konaklama"
                    className="text-xs text-white/65 transition-colors hover:text-white"
                  >
                    Konaklama
                  </Link>
                </li>

                <li>
                  <Link
                    href="/#deneyim"
                    className="text-xs text-white/65 transition-colors hover:text-white"
                  >
                    Deneyim
                  </Link>
                </li>

                <li>
                  <Link
                    href="/#restoran"
                    className="text-xs text-white/65 transition-colors hover:text-white"
                  >
                    Restoran
                  </Link>
                </li>

                <li>
                  <Link
                    href="/rezervasyon"
                    className="text-xs text-white/65 transition-colors hover:text-white"
                  >
                    Rezervasyon
                  </Link>
                </li>

                <li>
                  <Link
                    href="/rezervasyon/takip"
                    className="text-xs text-white/65 transition-colors hover:text-white"
                  >
                    Rezervasyon Takip
                  </Link>
                </li>

                <li>
                  <Link
                    href="/#iletisim"
                    className="text-xs text-white/65 transition-colors hover:text-white"
                  >
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C59A6A]">
                Konaklama
              </h3>

              <ul className="mt-6 space-y-3">
                {accommodations.length > 0 ? (
                  accommodations.map((accommodation) => (
                    <li key={accommodation.id}>
                      <Link
                        href={
                          accommodation.slug
                            ? `/konaklama/${accommodation.slug}`
                            : "/rezervasyon"
                        }
                        className="text-xs text-white/65 transition-colors hover:text-white"
                      >
                        {accommodation.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-white/45">
                    Aktif konaklama bulunmuyor.
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C59A6A]">
                İletişim
              </h3>

              <div className="mt-6 space-y-4">
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3"
                  >
                    <FiMapPin
                      size={15}
                      strokeWidth={1.2}
                      className="mt-0.5 shrink-0 text-[#C59A6A]"
                    />

                    <span className="text-xs leading-5 text-white/65 transition-colors group-hover:text-white">
                      {address}
                    </span>
                  </a>
                )}

                {phoneHref && (
                  <a href={phoneHref} className="group flex items-center gap-3">
                    <FiPhone
                      size={15}
                      strokeWidth={1.2}
                      className="text-[#C59A6A]"
                    />

                    <span className="text-xs text-white/65 transition-colors group-hover:text-white">
                      {phone}
                    </span>
                  </a>
                )}

                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3"
                  >
                    <FiMessageCircle
                      size={15}
                      strokeWidth={1.2}
                      className="text-[#C59A6A]"
                    />

                    <span className="text-xs text-white/65 transition-colors group-hover:text-white">
                      WhatsApp
                    </span>
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="group flex items-center gap-3"
                  >
                    <FiMail
                      size={15}
                      strokeWidth={1.2}
                      className="text-[#C59A6A]"
                    />

                    <span className="break-all text-xs text-white/65 transition-colors group-hover:text-white">
                      {email}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-[10px] text-white/40">
              © 2026 Altunhan Farm. Tüm hakları saklıdır.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/kvkk"
                className="text-[10px] text-white/40 transition-colors hover:text-white"
              >
                KVKK
              </Link>

              <Link
                href="/gizlilik"
                className="text-[10px] text-white/40 transition-colors hover:text-white"
              >
                Gizlilik Politikası
              </Link>

              <Link
                href="/cerez-politikasi"
                className="text-[10px] text-white/40 transition-colors hover:text-white"
              >
                Çerez Politikası
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/altunhanfarm/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/60 transition-all duration-300 hover:border-[#C59A6A] hover:bg-[#C59A6A] hover:text-white"
              >
                <FiInstagram size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
