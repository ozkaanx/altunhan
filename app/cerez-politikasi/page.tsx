import type { Metadata } from "next";

import Link from "next/link";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CerezPolitikasiPage() {
  return (
    <main className="min-h-screen bg-[#F4F2ED] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white p-6 sm:p-10">
        <Link href="/" className="text-xs font-medium text-[#71766F]">
          ← Altunhan Farm
        </Link>

        <h1 className="mt-6 font-serif text-4xl text-[#263A2D]">Çerez Politikası</h1>

        <div className="mt-8 space-y-6 text-sm leading-7 text-[#626860]">
          <p>
            Bu internet sitesi, hizmetlerin güvenli ve düzgün şekilde çalışabilmesi için gerekli
            teknik çerezleri kullanabilir.
          </p>

          <section>
            <h2 className="font-semibold text-[#263A2D]">Çerez Nedir?</h2>

            <p className="mt-2">
              Çerezler, bir internet sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla
              cihazınızda saklanabilen küçük veri dosyalarıdır.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#263A2D]">Kullanılan Çerezler</h2>

            <p className="mt-2">
              Site üzerinde oturum güvenliği, rezervasyon süreci ve temel teknik işlevler için
              zorunlu çerezler kullanılabilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#263A2D]">Tercihlerin Yönetimi</h2>

            <p className="mt-2">
              Tarayıcı ayarlarınız üzerinden çerezleri silebilir veya engelleyebilirsiniz. Ancak
              zorunlu çerezlerin engellenmesi bazı site özelliklerinin düzgün çalışmamasına neden
              olabilir.
            </p>
          </section>

          <p className="border-t border-[#E3E0D8] pt-6 text-xs text-[#8A8E87]">
            Şu anda reklam veya pazarlama amaçlı çerez altyapısı kullanılmıyorsa ayrıca bir izin
            banner&apos;ı gösterilmesi gerekmeyebilir. Analitik veya reklam araçları eklenirse bu
            politika yeniden gözden geçirilmelidir.
          </p>
        </div>
      </div>
    </main>
  );
}
