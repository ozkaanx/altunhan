import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";
interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F3F1EC]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader />

          <main className="p-5 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}