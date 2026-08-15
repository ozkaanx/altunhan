import type { ChangeEvent } from "react";

import { ImagePlus, Trash2 } from "lucide-react";

import { SectionHeader } from "@/components/admin/accommodation-form/form-elements";

import type { AccommodationImageValue } from "@/types/accommodation";

type AccommodationImagesSectionProps = {
  images: AccommodationImageValue[];
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (imageId: string) => void;
  onSetCover: (imageId: string) => void;
};

export function AccommodationImagesSection({
  images,
  onUpload,
  onRemove,
  onSetCover,
}: AccommodationImagesSectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <SectionHeader title="Fotoğraflar" description="Konaklamaya ait fotoğrafları yükleyin." />

      <div className="p-4 sm:p-5">
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center border border-dashed border-[#CBC7BE] bg-[#FAF9F6] px-4 text-center transition-colors hover:border-[#263A2D]">
          <ImagePlus size={28} strokeWidth={1.5} className="text-[#A8754F]" />

          <p className="mt-3 text-xs font-semibold text-[#263A2D]">Fotoğraf Ekle</p>

          <p className="mt-1 max-w-[300px] text-[10px] leading-4 text-[#969990]">
            JPG, PNG veya WEBP. Maksimum 10 MB.
          </p>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={onUpload}
            className="hidden"
          />
        </label>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image) => (
              <div key={image.id} className="overflow-hidden border border-[#E3E0D8] bg-white">
                <div className="relative aspect-[4/3]">
                  <img
                    src={image.previewUrl}
                    alt="Konaklama fotoğrafı"
                    className="h-full w-full object-cover"
                  />

                  {image.isCover && (
                    <span className="absolute left-2 top-2 bg-[#263A2D] px-2 py-1 text-[9px] font-semibold text-white">
                      Ana Fotoğraf
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemove(image.id)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-white text-[#98584E] shadow"
                    aria-label="Fotoğrafı sil"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {!image.isCover && (
                  <button
                    type="button"
                    onClick={() => onSetCover(image.id)}
                    className="flex h-10 w-full items-center justify-center border-t border-[#E3E0D8] text-[10px] font-semibold text-[#263A2D]"
                  >
                    Ana Fotoğraf Yap
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
