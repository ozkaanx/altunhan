import {
  PanelsTopLeft,
} from "lucide-react";

import {
  HomepageContentForm,
} from "@/components/admin/homepage-content-form";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  HomepageContent,
} from "@/types/homepage-content";

export default async function AdminHomepagePage() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (
    error ||
    !data
  ) {
    console.error(
      "Ana sayfa içeriği alınamadı:",
      error,
    );

    return (
      <section>
        <div className="mb-6">
          <p className="text-xs text-[#8B8E87]">
            İçerik Yönetimi
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
            Ana Sayfa
          </h1>
        </div>

        <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-5">
          <p className="text-sm font-semibold text-[#98584E]">
            Ana sayfa içeriği
            yüklenemedi.
          </p>

          <p className="mt-2 text-xs leading-5 text-[#9B746D]">
            Supabase
            homepage_content
            tablosunu kontrol
            edin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[900px]">
      <div className="mb-7">
        <div className="flex items-center gap-2">
          <PanelsTopLeft
            size={16}
            className="text-[#A8754F]"
          />

          <p className="text-xs text-[#8B8E87]">
            İçerik Yönetimi
          </p>
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#263A2D]">
          Ana Sayfa
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71756E]">
          Ana sayfadaki başlık,
          açıklama ve bölüm
          metinlerini buradan
          yönetin.
        </p>
      </div>

      <HomepageContentForm
        content={
          data as HomepageContent
        }
      />
    </section>
  );
}