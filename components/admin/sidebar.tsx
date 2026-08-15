"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  LogOut,
} from "lucide-react";

import { adminNavigation } from "@/types/admin-navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/auth/login";
  };

  return (
<aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-[#E5E1D8] bg-[#F8F6F1] xl:flex">      
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

      <nav className="flex-1 space-y-1 px-3 py-5">
        <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9B968C]">
          Yönetim
        </p>

        {adminNavigation.map((item) => {
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
                <ChevronRight size={14} />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-[#E5E1D8] p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#5F655E] transition-colors hover:bg-[#ECE9E1] hover:text-[#263A2D]"
        >
          <ExternalLink size={17} />

          Siteyi Gör
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#8A5A4A] transition-colors hover:bg-[#F0E4DF]"
        >
          <LogOut size={17} />

          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}