import Image from "next/image";

import { ImageIcon, Loader2, Upload } from "lucide-react";

import { SettingsSection } from "@/components/admin/settings-form/settings-section";

type HeroImageSectionProps = {
  heroImageUrl: string;
  heroImage: File | null;
  isUploading: boolean;
  error: string | null;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
};

export function HeroImageSection({
  heroImageUrl,
  heroImage,
  isUploading,
  error,
  onFileChange,
  onUpload,
}: HeroImageSectionProps) {
  return (
    <SettingsSection
      icon={ImageIcon}
      title="Hero Görseli"
      description="Ana sayfanın üst bölümünde kullanılan görsel."
    >
      {heroImageUrl ? (
        <div className="relative aspect-[16/7] overflow-hidden bg-[#EEEAE3]">
          <Image
            src={heroImageUrl}
            alt="Hero önizleme"
            fill
            sizes="700px"
            className="object-cover"
          />
        </div>
      ) : null}

      <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-[#CFC9BE] bg-[#FAF9F6] px-4 py-8 text-xs font-semibold text-[#626860] transition hover:border-[#A8754F]">
        <Upload size={16} aria-hidden="true" />
        {heroImage ? heroImage.name : "Yeni Hero Görseli Seç"}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => onFileChange(event.currentTarget.files?.[0] ?? null)}
        />
      </label>

      {error ? (
        <div
          className="border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs text-[#98584E]"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onUpload}
        disabled={!heroImage || isUploading}
        className="flex h-11 w-full items-center justify-center gap-2 bg-[#263A2D] px-4 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isUploading ? (
          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
        ) : (
          <Upload size={15} aria-hidden="true" />
        )}

        {isUploading ? "Yükleniyor..." : "Hero Görselini Güncelle"}
      </button>
    </SettingsSection>
  );
}
