"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ExternalLink, LogOut, X } from "lucide-react";

import { adminNavigation } from "@/types/admin-navigation";
import { createClient } from "@/lib/supabase/client";

type AdminMobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminMobileSidebar({ open, onClose }: AdminMobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Menüyü kapat"
        onClick={onClose}
        className={`
          fixed
          inset-0
          z-40
          bg-black/30
          backdrop-blur-[1px]
          transition-opacity
          duration-300
          lg:hidden
          ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-[100dvh]
          w-[85%]
          max-w-[320px]
          flex-col
          bg-[#F8F6F1]
          shadow-2xl
          transition-transform
          duration-300
          ease-out
          lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b border-[#E5E1D8] px-5 py-5">
          <Link href="/admin" onClick={onClose} className="block">
            <span className="font-serif text-2xl tracking-tight text-[#263A2D]">Altunhan</span>

            <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.28em] text-[#A8754F]">
              FARM ADMIN
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="flex h-10 w-10 items-center justify-center border border-[#DDD9D1] text-[#5F655E]"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9B968C]">
            Yönetim
          </p>

          <div className="space-y-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex
                    min-h-12
                    items-center
                    gap-3
                    px-3
                    text-sm
                    transition-colors
                    ${isActive ? "bg-[#263A2D] text-white" : "text-[#5F655E] active:bg-[#ECE9E1]"}
                  `}
                >
                  <Icon size={18} strokeWidth={1.7} />

                  <span className="flex-1">{item.label}</span>

                  {isActive && <ChevronRight size={15} />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#E5E1D8] p-3">
          <Link
            href="/"
            target="_blank"
            onClick={onClose}
            className="flex min-h-12 items-center gap-3 px-3 text-sm text-[#5F655E]"
          >
            <ExternalLink size={18} />
            Siteyi Gör
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-12 w-full items-center gap-3 px-3 text-sm text-[#8A5A4A]"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}
