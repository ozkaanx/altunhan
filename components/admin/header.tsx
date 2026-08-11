"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  Menu,
} from "lucide-react";

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E5E1D8] bg-white px-5 lg:px-8 sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Menüyü aç"
          className="flex h-9 w-9 items-center justify-center border border-[#E5E1D8] text-[#263A2D] lg:hidden"
        >
          <Menu size={18} />
        </button>

        <div>
          <p className="text-xs text-[#8B8E87]">
            Altunhan Farm
          </p>

          <h1 className="text-sm font-semibold text-[#263A2D]">
            Yönetim Paneli
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="
            hidden
            items-center
            gap-2
            border
            border-[#E5E1D8]
            px-4
            py-2
            text-xs
            text-[#5F655E]
            transition-colors
            hover:border-[#263A2D]
            hover:text-[#263A2D]
            md:flex
          "
        >
          Siteyi Gör

          <ExternalLink size={14} />
        </Link>

        <button
          type="button"
          aria-label="Bildirimler"
          className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            border
            border-[#E5E1D8]
            text-[#5F655E]
            transition-colors
            hover:text-[#263A2D]
          "
        >
          <Bell size={17} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#A8754F]" />
        </button>

        <button
          type="button"
          className="
            flex
            items-center
            gap-3
            border-l
            border-[#E5E1D8]
            pl-4
          "
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#263A2D] text-xs font-semibold text-white">
            A
          </div>

          <div className="hidden text-left md:block">
            <p className="text-xs font-semibold text-[#263A2D]">
              Admin
            </p>

            <p className="text-[10px] text-[#969990]">
              Yönetici
            </p>
          </div>

          <ChevronDown
            size={14}
            className="hidden text-[#969990] md:block"
          />
        </button>
      </div>
    </header>
  );
}