import type { Metadata } from "next";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ReservationTracking } from "@/components/reservation/reservation-tracking";
import { createClient } from "@/lib/supabase/server";

import type { SiteSettings } from "@/types/site-settings";

export const metadata: Metadata = {
  title: "Rezervasyon Takip",

  description:
    "Altunhan Farm rezervasyon durumunuzu rezervasyon numaranız ve telefon bilgilerinizle kontrol edin.",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default async function ReservationTrackingPage() {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Site ayarları alınamadı:", error);
  }

  return (
    <main className="min-h-screen bg-[#F4F2ED]">
      <header className="border-b border-[#E2DED6] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#71766F]"
          >
            <ArrowLeft size={14} />
            Altunhan Farm
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <ReservationTracking settings={settings as SiteSettings | null} />
      </section>
    </main>
  );
}
