import { FaInstagram, FaWhatsapp } from "react-icons/fa";

import { getWhatsAppHref } from "@/lib/contact-links";

type WhatsAppSupportProps = {
  whatsapp: string | null | undefined;
  instagram: string | null | undefined;
};

const DEFAULT_MESSAGE = "Merhaba, Altunhan Farm hakkında bilgi almak istiyorum.";

export function WhatsAppSupport({ whatsapp, instagram }: WhatsAppSupportProps) {
  const whatsappHref = getWhatsAppHref(whatsapp, DEFAULT_MESSAGE);
  const instagramHref = instagram?.trim() || null;

  if (!whatsappHref && !instagramHref) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-[60] flex items-center gap-2 lg:bottom-6 lg:right-6">
      {instagramHref && (
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Altunhan Farm Instagram hesabını aç"
          title="Instagram"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45] text-white shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E1306C]"
        >
          <FaInstagram size={24} aria-hidden="true" />
        </a>
      )}

      {whatsappHref && (
        <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp üzerinden Altunhan Farm ile iletişime geç"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_35px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#20BD5A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:h-auto sm:w-auto sm:gap-3 sm:px-4 sm:py-3"
      >
        <span className="hidden text-left sm:block">
          <span className="block text-[10px] font-medium text-white/80">Bir sorunuz mu var?</span>

          <span className="mt-0.5 block text-xs font-semibold">WhatsApp&apos;tan bize yazın</span>
        </span>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
          <FaWhatsapp size={23} aria-hidden="true" />
        </span>
        </a>
      )}
    </div>
  );
}
