import type { Metadata } from "next";

import Link from "next/link";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  robots: {
    index: false,
    follow: false,
  },
};

export default function KvkkPage() {
  return (
    <main className="min-h-screen bg-[#F4F2ED] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white p-6 sm:p-10">
        <Link href="/" className="text-xs font-medium text-[#71766F]">
          ← Altunhan Farm
        </Link>

        <h1 className="mt-6 font-serif text-4xl text-[#263A2D]">KVKK Aydınlatma Metni</h1>

        <div className="mt-8 space-y-6 text-sm leading-7 text-[#626860]">
          <p>
            Bu metin, Altunhan Farm internet sitesi üzerinden işlenen kişisel veriler hakkında genel
            bilgilendirme amacıyla hazırlanmıştır.
          </p>

          <section>
            <h2 className="font-semibold text-[#263A2D]">İşlenen Kişisel Veriler</h2>

            <p className="mt-2">
              Rezervasyon işlemleri kapsamında ad-soyad, telefon numarası, e-posta adresi, konaklama
              tarihleri, rezervasyon bilgileri ve ödeme/dekont bilgileri işlenebilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#263A2D]">İşleme Amaçları</h2>

            <p className="mt-2">
              Kişisel veriler; rezervasyon taleplerinin alınması, rezervasyon sürecinin yürütülmesi,
              müşteriyle iletişim kurulması, ödeme kontrolü ve yasal yükümlülüklerin yerine
              getirilmesi amacıyla kullanılabilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#263A2D]">Verilerin Saklanması</h2>

            <p className="mt-2">
              Kişisel veriler, ilgili mevzuatta öngörülen süreler ve işleme amacının gerektirdiği
              süre boyunca saklanabilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#263A2D]">Haklarınız</h2>

            <p className="mt-2">
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verileriniz hakkında
              bilgi talep etme, düzeltilmesini veya silinmesini isteme ve diğer yasal haklarınızı
              kullanma hakkınız bulunmaktadır.
            </p>
          </section>

          <p className="border-t border-[#E3E0D8] pt-6 text-xs text-[#8A8E87]">
            Not: Bu metin taslak niteliğindedir. İşletmenin resmi unvanı, adresi ve iletişim
            bilgileri netleştiğinde güncellenecektir.
          </p>
        </div>
      </div>
    </main>
  );
}
