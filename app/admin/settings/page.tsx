import { Settings } from "lucide-react";

import { SettingsForm } from "@/components/admin/settings-form";

import { createClient } from "@/lib/supabase/server";

import type { SiteSettings } from "@/types/site-settings";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  if (error || !data) {
    console.error("Site ayarları alınamadı:", error);

    return (
      <section>
        <div className="mb-6">
          <p className="text-xs text-[#8B8E87]">Sistem</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">Ayarlar</h1>
        </div>

        <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-5">
          <p className="text-sm font-semibold text-[#98584E]">Ayarlar yüklenemedi.</p>

          <p className="mt-2 text-xs leading-5 text-[#9B746D]">
            Supabase&apos;deki site_settings tablosunu kontrol edin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[760px]">
      <div className="mb-7">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-[#A8754F]" />

          <p className="text-xs text-[#8B8E87]">Sistem Ayarları</p>
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#263A2D]">Ayarlar</h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#71756E]">
          Ödeme ve iletişim bilgilerini buradan yönetin. Burada yaptığınız değişiklikler rezervasyon
          sisteminde kullanılacak.
        </p>
      </div>

      <SettingsForm settings={data as SiteSettings} />
    </section>
  );
}
