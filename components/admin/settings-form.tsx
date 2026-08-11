"use client";

import {
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  updateSiteSettings,
} from "@/app/admin/settings/action";

import type {
  SiteSettings,
} from "@/types/site-settings";

type SettingsFormProps = {
  settings:
    SiteSettings;
};

export function SettingsForm({
  settings,
}: SettingsFormProps) {
  const [
    bankAccountHolder,
    setBankAccountHolder,
  ] = useState(
    settings.bank_account_holder ??
      "",
  );

  const [
    bankName,
    setBankName,
  ] = useState(
    settings.bank_name ??
      "",
  );

  const [
    iban,
    setIban,
  ] = useState(
    settings.iban ??
      "",
  );

  const [
    phone,
    setPhone,
  ] = useState(
    settings.phone ??
      "",
  );

  const [
    whatsapp,
    setWhatsapp,
  ] = useState(
    settings.whatsapp ??
      "",
  );

  const [
    email,
    setEmail,
  ] = useState(
    settings.email ??
      "",
  );

  const [
    address,
    setAddress,
  ] = useState(
    settings.address ??
      "",
  );

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    success,
    setSuccess,
  ] =
    useState<string | null>(
      null,
    );

  const handleSubmit =
    async (
      event:
        React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setError(
        null,
      );

      setSuccess(
        null,
      );

      setIsSaving(
        true,
      );

      try {
        const result =
          await updateSiteSettings(
            {
              bankAccountHolder,

              bankName,

              iban,

              phone,

              whatsapp,

              email,

              address,
            },
          );

        if (
          !result.success
        ) {
          setError(
            result.message,
          );

          return;
        }

        setSuccess(
          result.message,
        );
      } catch (
        error
      ) {
        console.error(
          error,
        );

        setError(
          "Ayarlar kaydedilirken beklenmeyen bir hata oluştu.",
        );
      } finally {
        setIsSaving(
          false,
        );
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-5"
    >
      {/* BANK */}
      <section className="border border-[#E3E0D8] bg-white">
        <div className="border-b border-[#EEEAE3] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
              <CreditCard
                size={
                  17
                }
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#263A2D]">
                Ödeme
                Bilgileri
              </h2>

              <p className="mt-1 text-[10px] text-[#969990]">
                Rezervasyon
                sonrası
                müşteriye
                gösterilir.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <SettingsField
            icon={
              UserRound
            }
            label="Hesap Sahibi"
          >
            <input
              required
              value={
                bankAccountHolder
              }
              onChange={(
                event,
              ) =>
                setBankAccountHolder(
                  event.target.value,
                )
              }
              placeholder="ALTUNHAN FARM"
              className={
                inputClass
              }
            />
          </SettingsField>

          <SettingsField
            icon={
              Building2
            }
            label="Banka Adı"
          >
            <input
              value={
                bankName
              }
              onChange={(
                event,
              ) =>
                setBankName(
                  event.target.value,
                )
              }
              placeholder="Örn. Ziraat Bankası"
              className={
                inputClass
              }
            />
          </SettingsField>

          <SettingsField
            icon={
              CreditCard
            }
            label="IBAN"
          >
            <input
              value={
                iban
              }
              onChange={(
                event,
              ) =>
                setIban(
                  event.target.value.toUpperCase(),
                )
              }
              placeholder="TR00 0000 0000 0000 0000 0000 00"
              className={`${inputClass} font-medium uppercase tracking-wide`}
            />
          </SettingsField>
        </div>
      </section>

      {/* CONTACT */}
      <section className="border border-[#E3E0D8] bg-white">
        <div className="border-b border-[#EEEAE3] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
              <Phone
                size={
                  17
                }
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#263A2D]">
                İletişim
                Bilgileri
              </h2>

              <p className="mt-1 text-[10px] text-[#969990]">
                Site ve müşteri
                iletişiminde
                kullanılacak.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <SettingsField
            icon={
              Phone
            }
            label="Telefon"
          >
            <input
              type="tel"
              value={
                phone
              }
              onChange={(
                event,
              ) =>
                setPhone(
                  event.target.value,
                )
              }
              placeholder="+90 5__ ___ __ __"
              className={
                inputClass
              }
            />
          </SettingsField>

          <SettingsField
            icon={
              Phone
            }
            label="WhatsApp"
          >
            <input
              type="tel"
              value={
                whatsapp
              }
              onChange={(
                event,
              ) =>
                setWhatsapp(
                  event.target.value,
                )
              }
              placeholder="+90 5__ ___ __ __"
              className={
                inputClass
              }
            />

            <p className="mt-2 text-[10px] leading-5 text-[#969990]">
              WhatsApp
              bağlantılarında
              kullanılacak
              numara.
            </p>
          </SettingsField>

          <SettingsField
            icon={
              Mail
            }
            label="E-posta"
          >
            <input
              type="email"
              value={
                email
              }
              onChange={(
                event,
              ) =>
                setEmail(
                  event.target.value,
                )
              }
              placeholder="info@altunhanfarm.com"
              className={
                inputClass
              }
            />
          </SettingsField>

          <SettingsField
            icon={
              MapPin
            }
            label="Adres"
          >
            <textarea
              value={
                address
              }
              onChange={(
                event,
              ) =>
                setAddress(
                  event.target.value,
                )
              }
              rows={
                4
              }
              placeholder="Altunhan Farm adresi"
              className="w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-sm leading-6 text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]"
            />
          </SettingsField>
        </div>
      </section>

      {error && (
        <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-4 text-xs leading-5 text-[#98584E]">
          {
            error
          }
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 border border-[#CBDDC8] bg-[#EAF2E8] p-4 text-[#456044]">
          <CheckCircle2
            size={
              18
            }
            className="mt-0.5 shrink-0"
          />

          <p className="text-xs font-medium">
            {
              success
            }
          </p>
        </div>
      )}

      <div className="sticky bottom-3">
        <button
          type="submit"
          disabled={
            isSaving
          }
          className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] px-6 text-xs font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSaving ? (
            <Loader2
              size={
                16
              }
              className="animate-spin"
            />
          ) : (
            <Save
              size={
                16
              }
            />
          )}

          {isSaving
            ? "Kaydediliyor..."
            : "Ayarları Kaydet"}
        </button>
      </div>
    </form>
  );
}

function SettingsField({
  icon: Icon,
  label,
  children,
}: {
  icon:
    React.ElementType;

  label:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon
          size={
            14
          }
          className="text-[#A8754F]"
        />

        <label className="text-xs font-medium text-[#40463F]">
          {
            label
          }
        </label>
      </div>

      {
        children
      }
    </div>
  );
}

const inputClass =
  "h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]";