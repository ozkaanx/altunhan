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
  ImageIcon,
Upload,
} from "lucide-react";

import {
  useState,
} from "react";

import Image from "next/image";

import {
  createClient,
} from "@/lib/supabase/client";

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

    const [
  heroImageUrl,
  setHeroImageUrl,
] = useState(
  settings.hero_image_url ?? "",
);

const [
  heroImage,
  setHeroImage,
] = useState<File | null>(
  null,
);

const [
  isUploadingHero,
  setIsUploadingHero,
] = useState(false);

const [
  heroError,
  setHeroError,
] = useState<string | null>(
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

    const handleHeroUpload =
  async () => {
    if (!heroImage) {
      return;
    }

    setHeroError(null);
    setIsUploadingHero(true);

    try {
      const maxSize =
        10 * 1024 * 1024;

      if (
        heroImage.size >
        maxSize
      ) {
        setHeroError(
          "Hero görseli en fazla 10 MB olabilir.",
        );

        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowedTypes.includes(
          heroImage.type,
        )
      ) {
        setHeroError(
          "Sadece JPG, PNG veya WEBP yükleyebilirsiniz.",
        );

        return;
      }

      const extension =
        heroImage.name
          .split(".")
          .pop()
          ?.toLowerCase() ??
        "jpg";

      const storagePath =
        `hero/hero-${Date.now()}.${extension}`;

      const supabase =
        createClient();

      const {
        error:
          uploadError,
      } =
        await supabase.storage
          .from(
            "site-assets",
          )
          .upload(
            storagePath,
            heroImage,
            {
              cacheControl:
                "3600",
              upsert:
                false,
              contentType:
                heroImage.type,
            },
          );

      if (
        uploadError
      ) {
        throw uploadError;
      }

      const {
        data:
          publicUrlData,
      } =
        supabase.storage
          .from(
            "site-assets",
          )
          .getPublicUrl(
            storagePath,
          );

      const imageUrl =
        publicUrlData
          .publicUrl;

      const {
        error:
          updateError,
      } =
        await supabase
          .from(
            "site_settings",
          )
          .update({
            hero_image_url:
              imageUrl,
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            1,
          );

      if (
        updateError
      ) {
        await supabase.storage
          .from(
            "site-assets",
          )
          .remove([
            storagePath,
          ]);

        throw updateError;
      }

      setHeroImageUrl(
        imageUrl,
      );

      setHeroImage(
        null,
      );

      window.location.reload();
    } catch (error) {
      console.error(
        error,
      );

      setHeroError(
        error instanceof
        Error
          ? error.message
          : "Hero görseli yüklenemedi.",
      );
    } finally {
      setIsUploadingHero(
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

      <section className="border border-[#E3E0D8] bg-white">
  <div className="border-b border-[#EEEAE3] px-4 py-4 sm:px-5">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
        <ImageIcon
          size={17}
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[#263A2D]">
          Hero Görseli
        </h2>

        <p className="mt-1 text-[10px] text-[#969990]">
          Ana sayfanın üst bölümünde kullanılan görsel.
        </p>
      </div>
    </div>
  </div>

  <div className="space-y-4 p-4 sm:p-5">
    {heroImageUrl && (
      <div className="relative aspect-[16/7] overflow-hidden bg-[#EEEAE3]">
        <Image
          src={
            heroImageUrl
          }
          alt="Hero önizleme"
          fill
          sizes="700px"
          className="object-cover"
        />
      </div>
    )}

    <div>
      <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-[#CFC9BE] bg-[#FAF9F6] px-4 py-8 text-xs font-semibold text-[#626860] transition hover:border-[#A8754F]">
        <Upload
          size={16}
        />

        {heroImage
          ? heroImage.name
          : "Yeni Hero Görseli Seç"}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(
            event,
          ) => {
            setHeroImage(
              event
                .target
                .files?.[0] ??
                null,
            );

            setHeroError(
              null,
            );
          }}
        />
      </label>
    </div>

    {heroError && (
      <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs text-[#98584E]">
        {heroError}
      </div>
    )}

    <button
      type="button"
      onClick={
        handleHeroUpload
      }
      disabled={
        !heroImage ||
        isUploadingHero
      }
      className="flex h-11 w-full items-center justify-center gap-2 bg-[#263A2D] px-4 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {isUploadingHero ? (
        <Loader2
          size={15}
          className="animate-spin"
        />
      ) : (
        <Upload
          size={15}
        />
      )}

      {isUploadingHero
        ? "Yükleniyor..."
        : "Hero Görselini Güncelle"}
    </button>
  </div>
</section>
      
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
  "mt-2 h-11 w-full min-w-0 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm";