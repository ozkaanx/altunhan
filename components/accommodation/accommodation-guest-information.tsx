import { CircleHelp, MessageCircle } from "lucide-react";

import type { SiteSettings } from "@/types/site-settings";
import { faqItems, informationItems } from "@/types/accommodation-guest";

type AccommodationGuestInformationProps = {
  settings: SiteSettings | null;
};

export function AccommodationGuestInformation({ settings }: AccommodationGuestInformationProps) {
  const whatsapp = settings?.whatsapp?.trim() || "";
  const phone = settings?.phone?.trim() || "";

  const contactHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
    : phone
      ? `tel:${phone.replace(/[^\d+]/g, "")}`
      : null;

  return (
    <section className="border-y border-[#DDD8CC] bg-[#FAF8F2] px-5 py-14 sm:px-6 sm:py-16 md:px-12 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#A8754F]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A8754F]">
                Konaklama Bilgileri
              </p>
            </div>

            <h2 className="mt-4 max-w-[560px] font-serif text-[34px] leading-[1.05] text-[#263A2D] sm:text-4xl md:text-[44px]">
              Gelmeden önce bilmeniz gerekenler.
            </h2>

            <p className="mt-5 max-w-[520px] text-xs leading-6 text-[#666D65] sm:text-sm">
              Rezervasyon ve ödeme sürecini şeffaf tutuyoruz. Aşağıdaki bilgiler planınızı yaparken
              en çok ihtiyaç duyacağınız adımları özetler.
            </p>

            <div className="mt-8 grid gap-px overflow-hidden border border-[#DDD8CC] bg-[#DDD8CC] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {informationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="bg-[#F5F1E8] p-5 sm:p-6">
                    <div className="flex h-10 w-10 items-center justify-center bg-[#E5E9E1] text-[#526048]">
                      <Icon size={17} strokeWidth={1.5} />
                    </div>

                    <h3 className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#263A2D]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-[11px] leading-5 text-[#747A72]">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <CircleHelp size={17} strokeWidth={1.4} className="text-[#A8754F]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A8754F]">
                Sık Sorulan Sorular
              </p>
            </div>

            <div className="mt-5 border-t border-[#D9D4CA]">
              {faqItems?.map((item) => (
                <details key={item.question} className="group border-b border-[#D9D4CA]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-left marker:content-none sm:py-6">
                    <span className="text-sm font-medium leading-6 text-[#263A2D] sm:text-[15px]">
                      {item.question}
                    </span>

                    <span className="relative h-5 w-5 shrink-0 text-[#A8754F]">
                      <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current" />

                      <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-all group-open:rotate-90 group-open:opacity-0" />
                    </span>
                  </summary>

                  <p className="max-w-[680px] pb-5 pr-8 text-xs leading-6 text-[#70766F] sm:pb-6 sm:text-[13px]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>

            {contactHref && (
              <div className="mt-7 flex flex-col gap-4 border border-[#D9D4CA] bg-[#F5F1E8] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-start gap-3">
                  <MessageCircle
                    size={18}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-[#A8754F]"
                  />

                  <div>
                    <p className="text-sm font-medium text-[#263A2D]">
                      Aklınızda başka bir soru mu var?
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#747A72]">
                      Giriş-çıkış saatleri, özel talepler ve güncel konaklama koşulları için bize
                      ulaşabilirsiniz.
                    </p>
                  </div>
                </div>

                <a
                  href={contactHref}
                  target={whatsapp ? "_blank" : undefined}
                  rel={whatsapp ? "noopener noreferrer" : undefined}
                  className="inline-flex h-11 shrink-0 items-center justify-center bg-[#263A2D] px-5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#354A3B]"
                >
                  {whatsapp ? "WhatsApp'tan Sor" : "Bizi Arayın"}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
