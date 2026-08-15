import type { Metadata } from "next";

import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GizlilikPage() {
  return (
    <main className="min-h-screen bg-[#F4F2ED] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white p-6 sm:p-10">
        <Link href="/" className="text-xs font-medium text-[#71766F]">
          ← Altunhan Farm
        </Link>

        <h1 className="mt-6 font-serif text-4xl text-[#263A2D]">Gizlilik Politikası</h1>

        <div className="mt-8 space-y-6 text-sm leading-7 text-[#626860]">
          <p>
            Altunhan Farm, kullanıcıların gizliliğine önem verir ve internet sitesi üzerinden
            paylaşılan bilgilerin güvenli şekilde işlenmesini amaçlar.
          </p>

          <section>
            <h2 className="font-semibold text-[#263A2D]">Toplanan Bilgiler</h2>

            <p className="mt-2">
              Rezervasyon sürecinde ad-soyad, telefon, e-posta, rezervasyon tarihleri, konaklama
              bilgileri ve ödeme/dekont bilgileri toplanabilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#263A2D]">Bilgilerin Kullanımı</h2>

            <p className="mt-2">
              Bu bilgiler yalnızca rezervasyon ve müşteri hizmetleri süreçlerinin yürütülmesi, ödeme
              kontrolü ve gerekli bilgilendirmelerin yapılması amacıyla kullanılır.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#263A2D]">Üçüncü Taraflarla Paylaşım</h2>

            <p className="mt-2">
              Kişisel bilgiler yasal zorunluluklar dışında yetkisiz üçüncü kişilerle paylaşılmaz.
              Hizmetin yürütülmesi için kullanılan teknik altyapı sağlayıcılarıyla gerekli ölçüde
              veri paylaşımı yapılabilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#263A2D]">Güvenlik</h2>

            <p className="mt-2">
              Kişisel verilerin yetkisiz erişime, kayba ve kötüye kullanıma karşı korunması için
              makul teknik ve idari önlemler uygulanır.
            </p>
          </section>

          <p className="border-t border-[#E3E0D8] pt-6 text-xs text-[#8A8E87]">
            Not: İşletmenin resmi bilgileri netleştiğinde bu politika güncellenecektir.
          </p>
        </div>
      </div>
    </main>
  );
}
