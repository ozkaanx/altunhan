
export default function BeachEntryNotice() {
  return (
    <section className="w-full border-b border-farm-line bg-[#F5F1E8]">
      <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-6 sm:py-12 md:px-12 lg:px-16">
        <div className="grid gap-6 px-5 py-6 sm:px-7 sm:py-7 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-7 lg:px-8">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-farm-clay">
            Beach · Giriş Bilgilendirmesi
            </span>

            <h2 className="mt-3 font-serif text-[28px] leading-[1.08] text-farm-forest sm:text-[32px]">
              Dengeli ve keyifli bir ortamı önemsiyoruz.
            </h2>

            <p className="mt-4 text-[13px] leading-7 text-[#5F665F] sm:text-sm">
               Beach&apos;te misafirlerimizin rahat ve keyifli bir ortamda vakit
              geçirebilmesi amacıyla, özellikle grup girişlerinde kadın–erkek oranı dikkate
              alınmaktadır. Girişler; gün içerisindeki yoğunluk, kapasite ve mevcut denge göz
              önünde bulundurularak değerlendirilebilir.
            </p>

            <p className="mt-3 text-[11px] font-medium leading-6 text-[#7A6A5A] sm:text-xs">
              Grup olarak gelmeden önce bizimle iletişime geçmenizi öneririz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
