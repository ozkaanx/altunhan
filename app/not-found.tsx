import {
  ArrowLeft,
  Home,
} from "lucide-react";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F2ED] px-4">
      <div className="w-full max-w-[560px] text-center">
        <p className="font-serif text-8xl text-[#D7C9B7]">
          404
        </p>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A8754F]">
          Altunhan Farm
        </p>

        <h1 className="mt-2 font-serif text-4xl text-[#263A2D]">
          Sayfa bulunamadı
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#747972]">
          Aradığınız sayfa kaldırılmış, taşınmış veya hiç oluşturulmamış olabilir.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex h-11 items-center justify-center gap-2 bg-[#263A2D] px-5 text-xs font-semibold text-white"
          >
            <Home size={15} />
            Ana Sayfaya Dön
          </Link>

          <Link
            href="/rezervasyon"
            className="flex h-11 items-center justify-center gap-2 border border-[#D7D3CA] bg-white px-5 text-xs font-semibold text-[#263A2D]"
          >
            <ArrowLeft size={15} />
            Rezervasyon
          </Link>
        </div>
      </div>
    </main>
  );
}