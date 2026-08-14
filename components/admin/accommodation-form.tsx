"use client";

import {
  Baby,
  Bath,
  BedDouble,
  Car,
  ImagePlus,
  Minus,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Trees,
  Umbrella,
  Users,
  Utensils,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createAccommodation } from "@/app/admin/accommodations/action";
import { uploadAccommodationImages } from "@/lib/supabase/upload-accommodation-images";

import type {
  AccommodationFormValues,
  AccommodationImageValue,
} from "@/types/accommodation";

type AccommodationFormProps = {
  initialValues?: Partial<AccommodationFormValues>;
  submitLabel?: string;
  onSubmit?: (values: AccommodationFormValues) => void | Promise<void>;
};

const amenityOptions = [
  {
    label: "Wi-Fi",
    value: "wifi",
    icon: Wifi,
  },
  {
    label: "Klima",
    value: "air_conditioning",
    icon: Wind,
  },
  {
    label: "Özel Banyo",
    value: "private_bathroom",
    icon: Bath,
  },
  {
    label: "Deniz Manzarası",
    value: "sea_view",
    icon: Waves,
  },
  {
    label: "Kahvaltı",
    value: "breakfast",
    icon: Utensils,
  },
  {
    label: "Kendine Ait Beach",
    value: "private_beach",
    icon: Waves,
  },
  {
    label: "Beyaz Şezlong ve Şemsiye",
    value: "white_sunbed_and_umbrella",
    icon: Umbrella,
  },
  {
    label: "Açık Otopark",
    value: "open_parking",
    icon: Car,
  },
  {
    label: "Geniş Bahçe",
    value: "large_garden",
    icon: Trees,
  },
  {
    label: "Çocuk Oyun Parkı",
    value: "children_playground",
    icon: Baby,
  },
  {
    label: "Sürekli İlaçlanan Alan",
    value: "regularly_treated_area",
    icon: ShieldCheck,
  },
  {
    label: "Denize Sıfır Restoran",
    value: "seafront_restaurant",
    icon: Utensils,
  },
];

const defaultValues: AccommodationFormValues = {
  title: "",
  shortDescription: "",
  description: "",
  price: 0,
  capacity: 2,
  maxAdults: 2,
  maxChildren: 0,
  maxTotalGuests: 2,
  bedCount: 1,
  bathroomCount: 1,
  isActive: true,
  amenities: [],
  images: [],
  deletedImages: [],
};

export function AccommodationForm({
  initialValues,
  submitLabel = "Konaklamayı Kaydet",
  onSubmit,
}: AccommodationFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<AccommodationFormValues>({
    ...defaultValues,
    ...initialValues,
    images: initialValues?.images ?? [],
    deletedImages: initialValues?.deletedImages ?? [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateValue = <K extends keyof AccommodationFormValues>(
    key: K,
    value: AccommodationFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  type CounterKey =
    | "maxAdults"
    | "maxChildren"
    | "maxTotalGuests"
    | "bedCount"
    | "bathroomCount";

  const increment = (key: CounterKey) => {
    setValues((current) => {
      const nextValue = current[key] + 1;

      if (key === "maxAdults" || key === "maxChildren") {
        const nextTotal = Math.max(current.maxTotalGuests, nextValue);

        return {
          ...current,
          [key]: nextValue,
          maxTotalGuests: nextTotal,
          capacity: nextTotal,
        };
      }

      if (key === "maxTotalGuests") {
        return {
          ...current,
          maxTotalGuests: nextValue,
          capacity: nextValue,
        };
      }

      return {
        ...current,
        [key]: nextValue,
      };
    });
  };

  const decrement = (key: CounterKey) => {
    setValues((current) => {
      if (key === "maxAdults") {
        return {
          ...current,
          maxAdults: Math.max(1, current.maxAdults - 1),
        };
      }

      if (key === "maxChildren") {
        return {
          ...current,
          maxChildren: Math.max(0, current.maxChildren - 1),
        };
      }

      if (key === "maxTotalGuests") {
        const minimumTotal = Math.max(
          1,
          current.maxAdults,
          current.maxChildren,
        );

        const nextTotal = Math.max(minimumTotal, current.maxTotalGuests - 1);

        return {
          ...current,
          maxTotalGuests: nextTotal,
          capacity: nextTotal,
        };
      }

      return {
        ...current,
        [key]: Math.max(1, current[key] - 1),
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = values.amenities.includes(amenity);

    updateValue(
      "amenities",
      exists
        ? values.amenities.filter((item) => item !== amenity)
        : [...values.amenities, amenity],
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    setSubmitError(null);

    const selectedFiles = Array.from(files);

    const maxFileSize = 10 * 1024 * 1024;

    const oversizedFile = selectedFiles.find((file) => file.size > maxFileSize);

    if (oversizedFile) {
      setSubmitError("Fotoğrafların her biri en fazla 10 MB olabilir.");

      event.target.value = "";
      return;
    }

    const newImages: AccommodationImageValue[] = selectedFiles.map(
      (file, index) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        isCover: values.images.length === 0 && index === 0,
      }),
    );

    updateValue("images", [...values.images, ...newImages]);

    event.target.value = "";
  };

  const setCoverImage = (id: string) => {
    updateValue(
      "images",
      values.images.map((image) => ({
        ...image,
        isCover: image.id === id,
      })),
    );
  };

  const removeImage = (id: string) => {
    const imageToRemove = values.images.find((image) => image.id === id);

    if (!imageToRemove) {
      return;
    }

    let deletedImages = values.deletedImages;

    if (imageToRemove.isExisting && imageToRemove.storagePath) {
      deletedImages = [
        ...deletedImages,
        {
          id: Number(imageToRemove.id),
          storagePath: imageToRemove.storagePath,
        },
      ];
    }

    let remainingImages = values.images.filter((image) => image.id !== id);

    if (imageToRemove.file && imageToRemove.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    if (imageToRemove.isCover && remainingImages.length > 0) {
      remainingImages = remainingImages.map((image, index) => ({
        ...image,
        isCover: index === 0,
      }));
    }

    setValues((current) => ({
      ...current,
      images: remainingImages,
      deletedImages,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
        return;
      }

      const result = await createAccommodation({
        title: values.title,
        shortDescription: values.shortDescription,
        description: values.description,
        price: values.price,
        maxAdults: values.maxAdults,
        maxChildren: values.maxChildren,
        maxTotalGuests: values.maxTotalGuests,
        bedCount: values.bedCount,
        bathroomCount: values.bathroomCount,
        amenities: values.amenities,
        isActive: values.isActive,
      });

      if (!result.success) {
        setSubmitError(result.message);
        return;
      }

      if (values.images.length > 0) {
        await uploadAccommodationImages(result.accommodationId, values.images);
      }

      router.push("/admin/accommodations");
      router.refresh();
    } catch (error) {
      console.error(error);

      setSubmitError(
        error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[900px] space-y-5">
      <section className="border border-[#E3E0D8] bg-white">
        <SectionHeader
          title="Temel Bilgiler"
          description="Konaklamanın ana bilgilerini girin."
        />

        <div className="space-y-5 p-4 sm:p-5">
          <Field label="Konaklama Adı">
            <input
              value={values.title}
              required
              onChange={(event) => updateValue("title", event.target.value)}
              placeholder="Örn. Bungalov"
              className={inputClass}
            />
          </Field>

          <Field label="Kısa Açıklama">
            <input
              value={values.shortDescription}
              onChange={(event) =>
                updateValue("shortDescription", event.target.value)
              }
              placeholder="Kartlarda gösterilecek kısa açıklama"
              className={inputClass}
            />
          </Field>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#40463F]">
                Açıklama
              </label>

              <span className="text-[10px] text-[#A0A39C]">
                {values.description.length}
                /1000
              </span>
            </div>

            <textarea
              value={values.description}
              maxLength={1000}
              onChange={(event) =>
                updateValue("description", event.target.value)
              }
              rows={6}
              placeholder="Konaklama hakkında detaylı açıklama..."
              className="mt-2 w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-sm leading-6 text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]"
            />
          </div>
        </div>
      </section>

      <section className="border border-[#E3E0D8] bg-white">
        <SectionHeader title="Fiyatlandırma" />

        <div className="p-4 sm:p-5">
          <Field label="Gecelik Fiyat">
            <div className="relative">
              <input
                type="number"
                min={0}
                required
                value={values.price || ""}
                onChange={(event) =>
                  updateValue("price", Number(event.target.value))
                }
                className={`${inputClass} pr-14 text-lg font-semibold`}
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#888D85]">
                TL
              </span>
            </div>
          </Field>
        </div>
      </section>

      <section className="border border-[#E3E0D8] bg-white">
        <SectionHeader
          title="Konaklama Bilgileri"
          description="Yetişkin, çocuk, toplam misafir kapasitesi ve oda detaylarını belirleyin."
        />
        <div className="divide-y divide-[#EEEAE3] px-4 sm:px-5">
          <CounterRow
            icon={Users}
            label="Maks. Yetişkin"
            description="Aynı rezervasyonda seçilebilecek en fazla yetişkin"
            value={values.maxAdults}
            onDecrease={() => decrement("maxAdults")}
            onIncrease={() => increment("maxAdults")}
          />

          <CounterRow
            icon={Baby}
            label="Maks. Çocuk"
            description="Aynı rezervasyonda seçilebilecek en fazla çocuk"
            value={values.maxChildren}
            onDecrease={() => decrement("maxChildren")}
            onIncrease={() => increment("maxChildren")}
          />

          <CounterRow
            icon={Users}
            label="Toplam Misafir"
            description="Yetişkin + çocuk toplam kapasitesi"
            value={values.maxTotalGuests}
            onDecrease={() => decrement("maxTotalGuests")}
            onIncrease={() => increment("maxTotalGuests")}
          />
        </div>
      </section>

      <section className="border border-[#E3E0D8] bg-white">
        <SectionHeader
          title="Fotoğraflar"
          description="Konaklamaya ait fotoğrafları yükleyin."
        />

        <div className="p-4 sm:p-5">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center border border-dashed border-[#CBC7BE] bg-[#FAF9F6] px-4 text-center transition-colors hover:border-[#263A2D]">
            <ImagePlus size={28} strokeWidth={1.5} className="text-[#A8754F]" />

            <p className="mt-3 text-xs font-semibold text-[#263A2D]">
              Fotoğraf Ekle
            </p>

            <p className="mt-1 max-w-[300px] text-[10px] leading-4 text-[#969990]">
              JPG, PNG veya WEBP. Maksimum 10 MB.
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {values.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {values.images.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden border border-[#E3E0D8] bg-white"
                >
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
                      onClick={() => removeImage(image.id)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-white text-[#98584E] shadow"
                      aria-label="Fotoğrafı sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {!image.isCover && (
                    <button
                      type="button"
                      onClick={() => setCoverImage(image.id)}
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

      <section className="border border-[#E3E0D8] bg-white">
        <SectionHeader
          title="Özellikler"
          description="Konaklamada bulunan imkanları seçin."
        />

        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5">
          {amenityOptions.map((amenity) => {
            const Icon = amenity.icon;

            const selected = values.amenities.includes(amenity.value);

            return (
              <button
                key={amenity.value}
                type="button"
                onClick={() => toggleAmenity(amenity.value)}
                className={`flex min-h-20 flex-col items-center justify-center gap-2 border px-3 py-3 text-center ${
                  selected
                    ? "border-[#263A2D] bg-[#EEF0EA] text-[#263A2D]"
                    : "border-[#E1DED7] bg-white text-[#777C75]"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />

                <span className="text-[11px] font-medium">{amenity.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border border-[#E3E0D8] bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-[#263A2D]">Yayın Durumu</p>

            <p className="mt-1 text-[11px] text-[#969990]">
              Web sitesinde göster.
            </p>
          </div>

          <button
            type="button"
            onClick={() => updateValue("isActive", !values.isActive)}
            className={`relative h-7 w-12 shrink-0 rounded-full ${
              values.isActive ? "bg-[#263A2D]" : "bg-[#D8D6D0]"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                values.isActive ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-[#DDD9D1] bg-[#F3F1EC]/95 p-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        {submitError && (
          <div className="mb-3 border border-[#E7D6D1] bg-[#F8EEEA] px-4 py-3 text-xs text-[#8A5147]">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-60 sm:ml-auto sm:w-auto sm:px-8"
        >
          <Save size={16} />

          {isSubmitting ? "Kaydediliyor..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "mt-2 h-11 w-full min-w-0 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-[#40463F]">{label}</label>

      {children}
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
      <h2 className="text-sm font-semibold text-[#263A2D]">{title}</h2>

      {description && (
        <p className="mt-1 text-[11px] text-[#92968E]">{description}</p>
      )}
    </div>
  );
}

type CounterRowProps = {
  icon: React.ElementType;
  label: string;
  description: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

function CounterRow({
  icon: Icon,
  label,
  description,
  value,
  onDecrease,
  onIncrease,
}: CounterRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
          <Icon size={18} />
        </div>

        <div>
          <p className="text-xs font-medium text-[#40463F]">{label}</p>

          <p className="mt-0.5 text-[10px] text-[#969990]">{description}</p>
        </div>
      </div>

      <div className="flex items-center border border-[#DDD9D1]">
        <button
          type="button"
          onClick={onDecrease}
          className="flex h-10 w-10 items-center justify-center"
        >
          <Minus size={15} />
        </button>

        <span className="flex h-10 min-w-10 items-center justify-center border-x border-[#DDD9D1] text-sm font-semibold text-[#263A2D]">
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-10 w-10 items-center justify-center"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
