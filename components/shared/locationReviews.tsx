"use client";

import Link from "next/link";

import {
  ArrowRight,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";

import type { SiteSettings } from "@/types/site-settings";

type LocationReviewsProps = {
  settings?: SiteSettings | null;
  [key: string]: unknown;
};

function normalizePhoneHref(value: string | null) {
  if (!value) {
    return null;
  }

  const digits = value.replace(/[^\d+]/g, "");

  return digits ? `tel:${digits}` : null;
}

function normalizeWhatsappHref(value: string | null) {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, "");

  return digits ? `https://wa.me/${digits}` : null;
}

export default function LocationReviews({ settings }: LocationReviewsProps) {
  const address = settings?.address?.trim() || null;

  const phone = settings?.phone?.trim() || null;

  const whatsapp = settings?.whatsapp?.trim() || null;

  const email = settings?.email?.trim() || null;

  const instagram = settings?.instagram?.trim() || null;

  const instagramUsername = instagram ? `@${instagram.replace(/\/+$/, "").split("/").pop()}` : null;

  const mapUrl = settings?.map_url?.trim() || "";

  const mapEmbedUrl = settings?.map_embed_url?.trim() || null;

  const phoneHref = normalizePhoneHref(phone);
  const whatsappHref = normalizeWhatsappHref(whatsapp);

  return (
    <section id="ulasim" className="bg-farm-paper px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1380px] space-y-6 lg:space-y-8">
        <article className="bg-transparent">
          <div className="px-5 py-7 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
            <p className="inline-flex items-center border border-[#D8C4AE] bg-[#F6EFE6] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#9B6945]">
              Ulaşım
            </p>

            <h2 className="mt-5 max-w-[720px] font-serif text-[38px] leading-[1.04] tracking-[-0.02em] text-[#263A2D] sm:text-[46px] lg:text-[52px]">
              Altunhan Farm&apos;a kolayca ulaşın.
            </h2>

            <p className="mt-5 max-w-[680px] text-sm leading-7 text-[#667069] sm:text-[15px]">
              Adresimizi inceleyin ve tek tıkla yol tarifi alın.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={mapUrl}
                target="_blank"
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#263A2D] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1E3025] hover:shadow-[0_10px_24px_rgba(38,58,45,0.18)]"
              >
                Yol Tarifi Al
                <ArrowRight size={14} />
              </Link>

              <Link
                href={mapUrl}
                target="_blank"
                className="inline-flex h-12 items-center justify-center gap-2 border border-[#CFC8BA] bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#263A2D] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#263A2D] hover:bg-[#F8F5EE]"
              >
                Haritada Aç
              </Link>
            </div>
          </div>

          <div className="bg-[#F5F1E8] p-3 sm:p-4 lg:p-5">
            {mapEmbedUrl ? (
              <iframe
                title="Altunhan Farm Konum"
                src={mapEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[340px] w-full border border-[#D3CCBF] bg-[#F5F1E8] shadow-[0_16px_40px_rgba(38,58,45,0.08)] sm:h-[430px] lg:h-[480px]"
              />
            ) : (
              <div className="flex h-[340px] flex-col items-center justify-center border border-[#D3CCBF] bg-[#F5F1E8] text-center shadow-[0_16px_40px_rgba(38,58,45,0.06)] sm:h-[430px] lg:h-[480px]">
                <MapPin size={28} className="text-[#A8754F]" />
                <p className="mt-4 font-serif text-2xl text-[#263A2D]">Konum bilgisi hazır</p>
                <p className="mt-2 max-w-[420px] px-6 text-sm leading-6 text-[#6D746C]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d12036.271244280459!2d28.82472155!3d41.045646149999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x14b3df8ac6dd94f1%3A0x2319172b83a9622f!2sAltunhan%20Farm%20Saros%2C%20SAZLIDERE%20kara%C3%A7al%C4%B1%20mevkii%2C%20adilhan%2C%2022100%20Edirne!3m2!1d40.6432955!2d26.7187606!5e0!3m2!1str!2str!4v1787478721679!5m2!1str!2str"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </p>
                <Link
                  href={mapUrl}
                  target="_blank"
                  className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#263A2D]"
                >
                  Haritada Aç
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </article>

        <article id="iletisim" className="border-t border-[#DDD8CC] bg-transparent">
          <div className="px-5 py-5 sm:px-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A8754F]">
              İletişim
            </p>

            <h2 className="mt-3 font-serif text-[34px] leading-[1.08] text-[#263A2D] sm:text-[42px]">
              Bize kolayca ulaşın.
            </h2>

            <p className="mt-4 max-w-[620px] text-sm leading-7 text-[#636A62]">
              Rezervasyon, bilgi alma ve hızlı iletişim için sistemde kayıtlı iletişim bilgilerimizi
              kullanabilirsiniz.
            </p>
          </div>

          <div className="grid gap-px sm:grid-cols-2">
            <ContactItem
              icon={<Phone size={18} className="text-[#A8754F]" />}
              label="Telefon"
              value={phone ?? "Telefon bilgisi girilmemiş"}
              href={phoneHref}
              linkLabel="Ara"
            />

            <ContactItem
              icon={<MessageCircle size={18} className="text-[#A8754F]" />}
              label="WhatsApp"
              value={whatsapp ?? "WhatsApp bilgisi girilmemiş"}
              href={whatsappHref}
              linkLabel="Yaz"
            />

            <ContactItem
              icon={<Mail size={18} className="text-[#A8754F]" />}
              label="E-posta"
              value={email ?? "E-posta bilgisi girilmemiş"}
              href={email ? `mailto:${email}` : null}
              linkLabel="Mail Gönder"
            />

            <ContactItem
              icon={<Instagram size={18} className="text-[#A8754F]" />}
              label="Instagram"
              value={instagramUsername ?? "Instagram bağlantısı girilmemiş"}
              href={instagram}
              linkLabel="Aç"
            />
          </div>

          <div className="px-5 py-5 sm:px-7">
            <div className="flex items-start gap-3 bg-transparent py-4">
              <Navigation size={18} className="mt-0.5 shrink-0 text-[#A8754F]" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8F88]">
                  Adres
                </p>
                <p className="mt-1 text-sm leading-6 text-[#4E5851]">
                  {address ?? "Adres bilgisi girilmemiş"}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
  linkLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string | null;
  linkLabel: string;
}) {
  return (
    <div className="bg-[#FAF8F2] px-5 py-5 sm:px-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 shrink-0">{icon}</div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8F88]">
              {label}
            </p>
            <p className="mt-1 break-words text-sm leading-6 text-[#263A2D]">{value}</p>
          </div>
        </div>

        {href ? (
          <Link
            href={href}
            target="_blank"
            className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#263A2D]"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
