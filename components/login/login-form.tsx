"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error("Kullanıcı bilgileri alınamadı.");
      }

      router.replace("/admin");

      router.refresh();
    } catch (error) {
      console.error("Admin login error:", error);

      if (error instanceof Error) {
        if (error.message.toLocaleLowerCase().includes("invalid login credentials")) {
          setError("E-posta veya şifre hatalı.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Giriş yapılırken bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="border border-[#E2DED6] bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A8754F]">
            Altunhan Farm
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[#263A2D]">Yönetim Paneli</h1>

          <p className="mt-3 text-sm leading-6 text-[#777C75]">
            Rezervasyonları ve konaklamaları yönetmek için giriş yapın.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-7 space-y-5">
          <div>
            <label htmlFor="email" className="text-xs font-medium text-[#40463F]">
              E-posta
            </label>

            <div className="relative mt-2">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9E97]" />

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@altunhanfarm.com"
                className="h-12 w-full border border-[#DDD9D1] bg-[#FAF9F6] pl-10 pr-3 text-sm text-[#263A2D] outline-none placeholder:text-[#AAA] focus:border-[#263A2D]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-xs font-medium text-[#40463F]">
              Şifre
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9E97]"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="h-12 w-full border border-[#DDD9D1] bg-[#FAF9F6] pl-10 pr-11 text-sm text-[#263A2D] outline-none focus:border-[#263A2D]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#858A83]"
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="border border-[#E5C7C0] bg-[#F8EEEA] px-4 py-3 text-xs leading-5 text-[#98584E]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#344B3A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}

            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="mt-6 border-t border-[#EEEAE3] pt-5 text-center">
          <p className="text-[10px] leading-5 text-[#969990]">
            Bu alan yalnızca Altunhan Farm yöneticileri içindir.
          </p>
        </div>
      </div>
    </div>
  );
}
