"use client";

import { Copy } from "lucide-react";

import type { SiteSettings } from "@/types/site-settings";

type BankInformationProps = {
  settings: SiteSettings | null;
  reservationCode: string;
};

export function BankInformation({ settings, reservationCode }: BankInformationProps) {
  const copyIban = async () => {
    if (!settings?.iban) {
      return;
    }

    await navigator.clipboard.writeText(settings.iban.replace(/\s/g, ""));
  };

  return (
    <div className="mt-7 border border-[#DDD9D1] bg-[#FAF8F4] p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A7658]">
        Havale / EFT Bilgileri
      </p>

      <div className="mt-4 space-y-4">
        <BankRow
          label="Hesap Sahibi"
          value={settings?.bank_account_holder || "Hesap sahibi bilgisi henüz eklenmedi."}
        />

        <BankRow label="Banka" value={settings?.bank_name || "Banka bilgisi henüz eklenmedi."} />

        <div>
          <p className="text-[10px] text-[#969990]">IBAN</p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 break-all text-xs font-semibold tracking-wide text-[#263A2D] sm:text-sm">
              {settings?.iban || "IBAN bilgisi henüz eklenmedi."}
            </p>

            {settings?.iban && (
              <button
                type="button"
                onClick={copyIban}
                className="flex h-9 shrink-0 items-center justify-center gap-2 border border-[#D7D3CA] bg-white px-3 text-[10px] font-semibold text-[#263A2D]"
              >
                <Copy size={13} />
                IBAN&apos;ı Kopyala
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 border-t border-[#E5E1D9] pt-4 text-[11px] leading-5 text-[#777B74]">
        Havale / EFT açıklamasına <strong className="text-[#263A2D]">{reservationCode}</strong>{" "}
        yazmanızı rica ederiz.
      </p>
    </div>
  );
}

function BankRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#969990]">{label}</p>

      <p className="mt-1 text-sm font-medium text-[#263A2D]">{value}</p>
    </div>
  );
}
