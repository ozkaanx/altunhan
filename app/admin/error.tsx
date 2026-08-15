"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  reset,
}: {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-[520px] border border-[#E3E0D8] bg-white p-6 text-center sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F8EEEA] text-[#98584E]">
          <AlertTriangle size={22} />
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
          Yönetim Paneli
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-[#263A2D]">Veriler yüklenemedi</h1>

        <p className="mt-3 text-sm leading-6 text-[#747972]">
          Yönetim paneli verileri alınırken bir hata oluştu.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white"
        >
          <RefreshCw size={15} />
          Tekrar Dene
        </button>
      </div>
    </section>
  );
}
