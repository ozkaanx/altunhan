"use client";

import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

import Link from "next/link";

export default function ReservationError({
  reset,
}: {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F2ED] px-4">
      <div className="w-full max-w-[520px] border border-[#E3E0D8] bg-white p-6 text-center sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F8EEEA] text-[#98584E]">
          <AlertTriangle size={22} />
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
          Rezervasyon
        </p>

        <h1 className="mt-2 font-serif text-3xl text-[#263A2D]">Bir sorun oluştu</h1>

        <p className="mt-3 text-sm leading-6 text-[#747972]">
          Rezervasyon sayfası yüklenirken beklenmeyen bir hata oluştu.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={reset}
            className="flex h-11 items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white"
          >
            <RefreshCw size={15} />
            Tekrar Dene
          </button>

          <Link
            href="/"
            className="flex h-11 items-center justify-center gap-2 border border-[#DDD9D1] text-xs font-semibold text-[#263A2D]"
          >
            <ArrowLeft size={15} />
            Ana Sayfa
          </Link>
        </div>
      </div>
    </main>
  );
}
