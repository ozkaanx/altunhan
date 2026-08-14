import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { AdminReservationForm } from "@/components/admin/admin-reservation-form";

import { createClient } from "@/lib/supabase/server";

export default async function NewReservationPage() {
  const supabase = await createClient();

  const {
    data: accommodations,
    error: accommodationsError,
  } = await supabase
    .from("accommodations")
    .select(`
      id,
      title,
      capacity,
      price,
      max_adults,
      max_children,
      max_total_guests
    `)
    .eq("is_active", true)
    .order("id", {
      ascending: true,
    });

  if (accommodationsError) {
    console.error(
      "Konaklamalar alınamadı:",
      accommodationsError,
    );

    return (
      <section>
        <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-5 text-sm text-[#98584E]">
          Konaklama bilgileri alınamadı.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[900px]">
      <Link
        href="/admin/reservations"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#6D726B] hover:text-[#263A2D]"
      >
        <ArrowLeft size={14} />
        Rezervasyonlara Dön
      </Link>

      <div className="mt-5">
        <p className="text-xs text-[#8B8E87]">
          Manuel Rezervasyon
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
          Yeni Rezervasyon
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#71756E]">
          Telefon, WhatsApp veya resepsiyon üzerinden gelen
          rezervasyonları buradan oluşturabilirsiniz.
        </p>
      </div>

      <AdminReservationForm
        accommodations={accommodations ?? []}
      />
    </section>
  );
}