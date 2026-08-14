import type {
  ReactNode,
} from "react";

import {
  redirect,
} from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import {
  AdminHeader,
} from "@/components/admin/header";

import {
  AdminSidebar,
} from "@/components/admin/sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const admin =
    await requireAdmin();

  if (!admin.success) {
    redirect("/");
  }

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[#F3F1EC]">
      <div className="flex min-h-[100dvh]">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader />

          <main className="min-w-0 overflow-x-hidden p-4 sm:p-5 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}