"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navItems = [
  { label: "Konaklama", href: "/#konaklama" },
  { label: "Deneyim", href: "/#deneyim" },
  { label: "İletişim", href: "/#iletisim" },
  { label: "Rezervasyon Takip", href: "/rezervasyon/takip" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="relative z-40 w-full bg-[#F5F1E8]">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 md:h-24 md:px-12 lg:px-16">
          <Link href="/" onClick={closeMenu} className="flex flex-col leading-none">
            <span className="font-serif text-[20px] tracking-[0.24em] text-[#263A2D] sm:text-[22px] sm:tracking-[0.28em]">
              ALTUNHAN
            </span>

            <span className="mt-1 text-center text-[9px] tracking-[0.5em] text-[#263A2D] sm:text-[10px] sm:tracking-[0.55em]">
              FARM
            </span>
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-[12px] font-medium uppercase tracking-[0.12em] text-[#263A2D] transition-colors duration-300 hover:text-[#A8754F] after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-[#A8754F] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Link
              href="/rezervasyon"
              className="inline-flex h-11 items-center justify-center bg-[#A8754F] px-7 text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-[#263A2D]"
            >
              Rezervasyon
            </Link>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center text-[#263A2D] lg:hidden"
          >
            {isOpen ? <FiX size={25} /> : <FiMenu size={25} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          />

          <aside className="fixed right-0 top-0 z-50 flex h-dvh w-[85%] max-w-[360px] flex-col bg-[#F5F1E8] shadow-2xl lg:hidden">
            <div className="flex h-20 items-center justify-between border-b border-[#DDD8CC] px-5">
              <Link href="/" onClick={closeMenu} className="flex flex-col leading-none">
                <span className="font-serif text-[18px] tracking-[0.24em] text-[#263A2D]">
                  ALTUNHAN
                </span>

                <span className="mt-1 text-center text-[9px] tracking-[0.48em] text-[#263A2D]">
                  FARM
                </span>
              </Link>

              <button
                type="button"
                aria-label="Menüyü kapat"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center text-[#263A2D]"
              >
                <FiX size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-7">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="flex min-h-12 items-center border-b border-[#E1DDD4] py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#263A2D]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-[#DDD8CC] p-5">
              <Link
                href="/rezervasyon"
                onClick={closeMenu}
                className="flex h-12 w-full items-center justify-center bg-[#A8754F] text-[11px] font-semibold uppercase tracking-[0.15em] text-white"
              >
                Rezervasyon Yap
              </Link>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
