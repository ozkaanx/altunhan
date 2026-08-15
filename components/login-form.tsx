"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Invalid login credentials") {
        setError("E-posta adresi veya şifre hatalı.");
      } else {
        setError("Giriş yapılırken bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="border border-[#DDD9D1] bg-white p-6 sm:p-8">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A8754F]">
            Altunhan Farm
          </p>

          <h1 className="mt-3 font-serif text-3xl text-[#263A2D]">Yönetim Paneli</h1>

          <p className="mt-3 text-xs leading-5 text-[#7C817A]">
            Yönetim paneline erişmek için bilgilerinizi girin.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-xs font-medium text-[#40463F]">
              E-posta
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="E-posta adresiniz"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none transition focus:border-[#263A2D]"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-xs font-medium text-[#40463F]">
              Şifre
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Şifreniz"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none transition focus:border-[#263A2D]"
            />
          </div>

          {error && (
            <div className="border border-[#E7C9C5] bg-[#FBF3F2] px-3 py-3">
              <p className="text-xs text-[#9B4B43]">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center bg-[#263A2D] text-xs font-semibold text-white transition hover:bg-[#1F3025] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] leading-5 text-[#969990]">
          Bu alan yalnızca yetkili kullanıcılar içindir.
        </p>
      </div>
    </div>
  );
}
