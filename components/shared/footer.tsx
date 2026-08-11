import Link from "next/link";
import {
  FiArrowUpRight,
  FiInstagram,
  FiFacebook,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";

const footerLinks = {
  kesfet: [
    {
      label: "Hakkımızda",
      href: "/hakkimizda",
    },
    {
      label: "Konaklama",
      href: "/konaklama",
    },
    {
      label: "Restoran",
      href: "/restoran",
    },
    {
      label: "Konum",
      href: "/konum",
    },
  ],
  konaklama: [
    {
      label: "Taş Odalar",
      href: "/konaklama/tas-odalar",
    },
    {
      label: "Bungalovlar",
      href: "/konaklama/bungalovlar",
    },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#263A2D] text-[#F5F1E8]">

      {/* ================= CTA ================= */}

      <section className="border-b border-white/10 px-6 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1500px] text-center">

          <span className="block text-[9px] font-medium uppercase tracking-[0.35em] text-[#C59A6A]">
            ALTUNHAN FARM
          </span>

          <h2 className="mx-auto mt-5 max-w-[800px] font-serif text-4xl leading-[1] md:text-5xl lg:text-7xl">
            Sizi Saros'un
            <br />
            huzuruna bekliyoruz.
          </h2>

          <p className="mx-auto mt-6 max-w-[500px] text-sm leading-6 text-white/60">
            Doğanın içinde, denizin kıyısında unutulmaz
            bir konaklama deneyimi için yerinizi ayırın.
          </p>

          <Link
            href="/rezervasyon"
            className="
              group
              mt-8
              inline-flex
              items-center
              gap-4
              bg-[#F5F1E8]
              px-7
              py-4
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#263A2D]
              transition-all
              duration-300
              hover:bg-[#C59A6A]
              hover:text-white
            "
          >
            Rezervasyon Yap

            <FiArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

        </div>
      </section>


      {/* ================= MAIN FOOTER ================= */}

      <section className="px-6 py-14 md:px-12 md:py-16 lg:px-16">

        <div className="mx-auto max-w-[1500px]">

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">

            {/* Brand */}

            <div>

              <Link
                href="/"
                className="font-serif text-3xl tracking-tight"
              >
                Altunhan
                <span className="block text-lg tracking-[0.15em]">
                  FARM
                </span>
              </Link>

              <p className="mt-6 max-w-[280px] text-xs leading-6 text-white/55">
                Saros'un kıyısında, doğayla iç içe,
                sakin ve unutulmaz bir yaşam deneyimi.
              </p>

            </div>


            {/* Keşfet */}

            <div>

              <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C59A6A]">
                Keşfet
              </h3>

              <ul className="mt-6 space-y-3">

                {footerLinks.kesfet.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="
                        text-xs
                        text-white/65
                        transition-colors
                        hover:text-white
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

              </ul>

            </div>


            {/* Konaklama */}

            <div>

              <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C59A6A]">
                Konaklama
              </h3>

              <ul className="mt-6 space-y-3">

                {footerLinks.konaklama.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="
                        text-xs
                        text-white/65
                        transition-colors
                        hover:text-white
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                <li>
                  <Link
                    href="/restoran"
                    className="text-xs text-white/65 transition-colors hover:text-white"
                  >
                    Restoran
                  </Link>
                </li>

              </ul>

            </div>


            {/* Contact */}

            <div>

              <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C59A6A]">
                İletişim
              </h3>

              <div className="mt-6 space-y-4">

                {/* Location */}

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Altunhan+Farm+Adilhan+Koyu+Kesan+Edirne"
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
                    Adilhan Köyü,
                    <br />
                    Keşan / Edirne
                  </span>
                </a>


                {/* Phone */}

                <a
                  href="tel:+905051234567"
                  className="group flex items-center gap-3"
                >
                  <FiPhone
                    size={15}
                    strokeWidth={1.2}
                    className="text-[#C59A6A]"
                  />

                  <span className="text-xs text-white/65 transition-colors group-hover:text-white">
                    +90 505 123 45 67
                  </span>
                </a>


                {/* Email */}

                <a
                  href="mailto:info@altunhanfarm.com"
                  className="group flex items-center gap-3"
                >
                  <FiMail
                    size={15}
                    strokeWidth={1.2}
                    className="text-[#C59A6A]"
                  />

                  <span className="text-xs text-white/65 transition-colors group-hover:text-white">
                    info@altunhanfarm.com
                  </span>
                </a>

              </div>

            </div>

          </div>


          {/* ================= BOTTOM ================= */}

          <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">

            <p className="text-[10px] text-white/40">
              © 2026 Altunhan Farm. Tüm hakları saklıdır.
            </p>


            <div className="flex items-center gap-6">

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


            {/* Social */}

            <div className="flex items-center gap-3">

              <a
                href="https://www.instagram.com/altunhanfarm/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  border
                  border-white/10
                  text-white/60
                  transition-all
                  duration-300
                  hover:border-[#C59A6A]
                  hover:bg-[#C59A6A]
                  hover:text-white
                "
              >
                <FiInstagram size={15} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  border
                  border-white/10
                  text-white/60
                  transition-all
                  duration-300
                  hover:border-[#C59A6A]
                  hover:bg-[#C59A6A]
                  hover:text-white
                "
              >
                <FiFacebook size={15} />
              </a>

            </div>

          </div>

        </div>

      </section>

    </footer>
  );
}