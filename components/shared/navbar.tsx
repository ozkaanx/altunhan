import Link from "next/link";
import { FiMenu } from "react-icons/fi";

const navItems = [
  { label: "Konaklama", href: "/konaklama" },
  { label: "Beach", href: "/beach" },
  { label: "Restoran", href: "/restoran" },
  { label: "Deneyim", href: "/deneyim" },
  { label: "Galeri", href: "/galeri" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar() {
  return (
    <nav className="w-full bg-[#F5F1E8]">
      <div className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-16">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-[22px] tracking-[0.28em] text-[#263A2D]">
            ALTUNHAN
          </span>

          <span className="mt-1 text-center text-[10px] tracking-[0.55em] text-[#263A2D]">
            FARM
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="
                  relative
                  text-[12px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[#263A2D]
                  transition-colors
                  duration-300
                  hover:text-[#A8754F]

                  after:absolute
                  after:-bottom-2
                  after:left-0
                  after:h-px
                  after:w-0
                  after:bg-[#A8754F]
                  after:transition-all
                  after:duration-300
                  hover:after:w-full
                "
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Reservation */}
        <div className="hidden lg:block">
          <Link
            href="/rezervasyon"
            className="
              inline-flex
              h-11
              items-center
              justify-center
              bg-[#A8754F]
              px-7
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-white
              transition-all
              duration-300
              hover:bg-[#263A2D]
            "
          >
            Rezervasyon
          </Link>
        </div>

        {/* Mobile Menu */}
        <button
          type="button"
          aria-label="Menüyü aç"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            text-[#263A2D]
            lg:hidden
          "
        >
          <FiMenu size={24} />
        </button>
      </div>
    </nav>
  );
}
