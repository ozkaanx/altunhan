"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Konaklama", href: "/#konaklama" },
  { label: "Ulaşım", href: "/#ulasim" },
  { label: "İletişim", href: "/#iletisim" },
  { label: "Rezervasyon Takip", href: "/rezervasyon/takip" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <nav className="relative z-40 w-full bg-farm-cream">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 md:h-24 md:px-12 lg:px-16">
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Altunhan Farm ana sayfa"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/images/farmlogo.png"
              alt="Altunhan Farm"
              width={500}
              height={500}
              priority
              className="h-16 w-16 object-contain sm:h-16 sm:w-16 md:h-[85px] md:w-[85px]"
            />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-[12px] font-medium uppercase tracking-[0.12em] text-farm-forest transition-colors duration-300 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-farm-clay after:transition-all after:duration-300 hover:text-farm-clay hover:after:w-full"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Button
              asChild
              variant="farmAccent"
              size="farmSm"
              className="px-7 text-[11px] uppercase tracking-[0.15em] transition-all duration-300"
            >
              <Link href="/rezervasyon">Rezervasyon</Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center text-farm-forest lg:hidden"
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

          <aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil menü"
            className="fixed right-0 top-0 z-50 flex h-dvh w-[85%] max-w-[360px] flex-col bg-farm-cream shadow-2xl lg:hidden"
          >
            <div className="flex h-20 items-center justify-between border-b border-farm-line px-5">
              <Link
                href="/"
                onClick={closeMenu}
                aria-label="Altunhan Farm ana sayfa"
                className="flex shrink-0 items-center"
              >
                <Image
                  src="/images/farmlogo.png"
                  alt="Altunhan Farm"
                  width={500}
                  height={500}
                  className="h-14 w-14 object-contain"
                />
              </Link>

              <button
                type="button"
                aria-label="Menüyü kapat"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center text-farm-forest"
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
                      className="flex min-h-12 items-center border-b border-[#E1DDD4] py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-farm-forest"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-farm-line p-5">
              <Button asChild variant="farmAccent" size="farm" className="w-full">
                <Link href="/rezervasyon" onClick={closeMenu}>
                  Rezervasyon Yap
                </Link>
              </Button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
