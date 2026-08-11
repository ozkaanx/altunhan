"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  Menu,
} from "lucide-react";
import { useState } from "react";

import { AdminMobileSidebar } from "@/components/admin/mobile-sidebar";

export function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E1D8] bg-white/95 px-4 backdrop-blur-md sm:px-5 lg:px-8">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menüyü aç"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E5E1D8] text-[#263A2D] lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-[10px] text-[#8B8E87] sm:text-xs">
              Altunhan Farm
            </p>

            <h1 className="truncate text-xs font-semibold text-[#263A2D] sm:text-sm">
              Yönetim Paneli
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden h-10 items-center gap-2 border border-[#E5E1D8] px-4 text-xs text-[#5F655E] transition-colors hover:border-[#263A2D] hover:text-[#263A2D] md:flex"
          >
            Siteyi Gör

            <ExternalLink size={14} />
          </Link>

          <button
            type="button"
            aria-label="Bildirimler"
            className="relative flex h-10 w-10 items-center justify-center border border-[#E5E1D8] text-[#5F655E]"
          >
            <Bell size={17} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#A8754F]" />
          </button>

          <button
            type="button"
            className="flex items-center gap-2 sm:border-l sm:border-[#E5E1D8] sm:pl-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#263A2D] text-xs font-semibold text-white">
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

      <AdminMobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}