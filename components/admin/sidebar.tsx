"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  ExternalLink,
  House,
  LogOut,
  MessageSquareQuote,
  Settings,
  SlidersHorizontal,
  UserRoundCog,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: House,
  },
  {
    label: "Rezervasyonlar",
    href: "/admin/reservations",
    icon: CalendarDays,
  },
  {
    label: "Konaklamalar",
    href: "/admin/accommodations",
    icon: SlidersHorizontal,
  },
  {
    label: "Yorumlar",
    href: "/admin/reviews",
    icon: MessageSquareQuote,
  },
  {
    label: "Ana Sayfa",
    href: "/admin/homepage",
    icon: UserRoundCog,
  },
  {
    label: "Ayarlar",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/auth/login";
  };

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-[#E5E1D8] bg-[#F8F6F1] lg:flex">
      {/* Logo */}
      <div className="border-b border-[#E5E1D8] px-6 py-6">
        <Link href="/admin" className="block">
          <span className="font-serif text-2xl tracking-tight text-[#263A2D]">
            Altunhan
          </span>

          <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.28em] text-[#A8754F]">
            FARM ADMIN
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9B968C]">
          Yönetim
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group
                flex
                items-center
                gap-3
                px-3
                py-2.5
                text-sm
                transition-colors
                duration-200
                ${
                  isActive
                    ? "bg-[#263A2D] text-white"
                    : "text-[#5F655E] hover:bg-[#ECE9E1] hover:text-[#263A2D]"
                }
              `}
            >
              <Icon size={17} strokeWidth={1.7} />

              <span className="flex-1">
                {item.label}
              </span>

              {isActive && (
                <ChevronRight
                  size={14}
                  strokeWidth={1.7}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-[#E5E1D8] p-3">
        <Link
          href="/"
          target="_blank"
          className="
            flex
            items-center
            gap-3
            px-3
            py-2.5
            text-sm
            text-[#5F655E]
            transition-colors
            duration-200
            hover:bg-[#ECE9E1]
            hover:text-[#263A2D]
          "
        >
          <ExternalLink size={17} strokeWidth={1.7} />

          Siteyi Gör
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            w-full
            items-center
            gap-3
            px-3
            py-2.5
            text-sm
            text-[#8A5A4A]
            transition-colors
            duration-200
            hover:bg-[#F0E4DF]
          "
        >
          <LogOut size={17} strokeWidth={1.7} />

          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}