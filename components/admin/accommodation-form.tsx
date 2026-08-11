"use client";

import { useState } from "react";
import {
  BedDouble,
  Bath,
  ImagePlus,
  Minus,
  Plus,
  Save,
  Users,
  Wifi,
  Wind,
  Utensils,
  Waves,
  Trash2,
} from "lucide-react";

export type AccommodationFormValues = {
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  capacity: number;
  bedCount: number;
  bathroomCount: number;
  isActive: boolean;
  amenities: string[];
  images: string[];
};


type AccommodationFormProps = {
  initialValues?: Partial<AccommodationFormValues>;
  submitLabel?: string;
  onSubmit?: (values: AccommodationFormValues) => void;
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
];

const defaultValues: AccommodationFormValues = {
  title: "",
  shortDescription: "",
  description: "",
  price: 0,
  capacity: 2,
  bedCount: 1,
  bathroomCount: 1,
  isActive: true,
  amenities: [],
  images: [],
};

export function AccommodationForm({
  initialValues,
  submitLabel = "Konaklamayı Kaydet",
  onSubmit,
}: AccommodationFormProps) {
  const [values, setValues] = useState<AccommodationFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const updateValue = <K extends keyof AccommodationFormValues>(
    key: K,
    value: AccommodationFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const increment = (
    key: "capacity" | "bedCount" | "bathroomCount",
  ) => {
    updateValue(key, values[key] + 1);
  };

  const decrement = (
    key: "capacity" | "bedCount" | "bathroomCount",
  ) => {
    updateValue(key, Math.max(1, values[key] - 1));
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

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;

    if (!files) return;

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );

    updateValue("images", [
      ...values.images,
      ...newImages,
    ]);
  };

  const removeImage = (image: string) => {
    updateValue(
      "images",
      values.images.filter((item) => item !== image),
    );
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    onSubmit?.(values);

    console.log("Accommodation:", values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-[900px] space-y-5"
    >
      {/* Temel bilgiler */}
      <section className="border border-[#E3E0D8] bg-white">
        <div className="border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
          <h2 className="text-sm font-semibold text-[#263A2D]">
            Temel Bilgiler
          </h2>

          <p className="mt-1 text-[11px] text-[#92968E]">
            Konaklamanın ana bilgilerini girin.
          </p>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <div>
            <label className="text-xs font-medium text-[#40463F]">
              Konaklama Adı
            </label>

            <input
              value={values.title}
              onChange={(event) =>
                updateValue("title", event.target.value)
              }
              placeholder="Örn. Bungalov"
              className="mt-2 h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#40463F]">
              Kısa Açıklama
            </label>

            <input
              value={values.shortDescription}
              onChange={(event) =>
                updateValue(
                  "shortDescription",
                  event.target.value,
                )
              }
              placeholder="Kartlarda gösterilecek kısa açıklama"
              className="mt-2 h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#40463F]">
                Açıklama
              </label>

              <span className="text-[10px] text-[#A0A39C]">
                {values.description.length}/1000
              </span>
            </div>

            <textarea
              value={values.description}
              maxLength={1000}
              onChange={(event) =>
                updateValue(
                  "description",
                  event.target.value,
                )
              }
              placeholder="Konaklama hakkında detaylı açıklama..."
              rows={6}
              className="mt-2 w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-sm leading-6 text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]"
            />
          </div>
        </div>
      </section>

      {/* Fiyat */}
      <section className="border border-[#E3E0D8] bg-white">
        <div className="border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
          <h2 className="text-sm font-semibold text-[#263A2D]">
            Fiyatlandırma
          </h2>
        </div>

        <div className="p-4 sm:p-5">
          <label className="text-xs font-medium text-[#40463F]">
            Gecelik Fiyat
          </label>

          <div className="relative mt-2">
            <input
              type="number"
              min={0}
              value={values.price || ""}
              onChange={(event) =>
                updateValue(
                  "price",
                  Number(event.target.value),
                )
              }
              placeholder="0"
              className="h-12 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 pr-14 text-lg font-semibold text-[#263A2D] outline-none focus:border-[#263A2D]"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#888D85]">
              TL
            </span>
          </div>
        </div>
      </section>

      {/* Kapasite */}
      <section className="border border-[#E3E0D8] bg-white">
        <div className="border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
          <h2 className="text-sm font-semibold text-[#263A2D]">
            Konaklama Bilgileri
          </h2>

          <p className="mt-1 text-[11px] text-[#92968E]">
            Kapasite ve oda detaylarını belirleyin.
          </p>
        </div>

        <div className="divide-y divide-[#EEEAE3] px-4 sm:px-5">
          <CounterRow
            icon={Users}
            label="Kapasite"
            description="Maksimum misafir sayısı"
            value={values.capacity}
            onDecrease={() => decrement("capacity")}
            onIncrease={() => increment("capacity")}
          />

          <CounterRow
            icon={BedDouble}
            label="Yatak"
            description="Toplam yatak sayısı"
            value={values.bedCount}
            onDecrease={() => decrement("bedCount")}
            onIncrease={() => increment("bedCount")}
          />

          <CounterRow
            icon={Bath}
            label="Banyo"
            description="Toplam banyo sayısı"
            value={values.bathroomCount}
            onDecrease={() =>
              decrement("bathroomCount")
            }
            onIncrease={() =>
              increment("bathroomCount")
            }
          />
        </div>
      </section>

      {/* Fotoğraflar */}
      <section className="border border-[#E3E0D8] bg-white">
        <div className="border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
          <h2 className="text-sm font-semibold text-[#263A2D]">
            Fotoğraflar
          </h2>

          <p className="mt-1 text-[11px] text-[#92968E]">
            Konaklamaya ait fotoğrafları yükleyin.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center border border-dashed border-[#CBC7BE] bg-[#FAF9F6] px-4 text-center transition-colors hover:border-[#263A2D]">
            <ImagePlus
              size={28}
              strokeWidth={1.5}
              className="text-[#A8754F]"
            />

            <p className="mt-3 text-xs font-semibold text-[#263A2D]">
              Fotoğraf Ekle
            </p>

            <p className="mt-1 max-w-[300px] text-[10px] leading-4 text-[#969990]">
              Telefonunuzdan fotoğraf seçebilir veya
              kamerayla yeni bir fotoğraf çekebilirsiniz.
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {values.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {values.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden bg-[#EEEAE3]"
                >
                  <img
                    src={image}
                    alt={`Konaklama fotoğrafı ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute left-2 top-2 bg-[#263A2D] px-2 py-1 text-[9px] font-semibold text-white">
                      Ana Fotoğraf
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    aria-label="Fotoğrafı sil"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-white text-[#98584E] shadow"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Özellikler */}
      <section className="border border-[#E3E0D8] bg-white">
        <div className="border-b border-[#ECE8E1] px-4 py-4 sm:px-5">
          <h2 className="text-sm font-semibold text-[#263A2D]">
            Özellikler
          </h2>

          <p className="mt-1 text-[11px] text-[#92968E]">
            Konaklamada bulunan imkanları seçin.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5">
          {amenityOptions.map((amenity) => {
            const Icon = amenity.icon;

            const selected = values.amenities.includes(
              amenity.value,
            );

            return (
              <button
                key={amenity.value}
                type="button"
                onClick={() =>
                  toggleAmenity(amenity.value)
                }
                className={`
                  flex
                  min-h-20
                  flex-col
                  items-center
                  justify-center
                  gap-2
                  border
                  px-3
                  py-3
                  text-center
                  transition-all
                  ${
                    selected
                      ? "border-[#263A2D] bg-[#EEF0EA] text-[#263A2D]"
                      : "border-[#E1DED7] bg-white text-[#777C75]"
                  }
                `}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                />

                <span className="text-[11px] font-medium">
                  {amenity.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Yayın */}
      <section className="border border-[#E3E0D8] bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-[#263A2D]">
              Yayın Durumu
            </p>

            <p className="mt-1 text-[11px] leading-4 text-[#969990]">
              Konaklamayı web sitesinde göster.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateValue("isActive", !values.isActive)
            }
            aria-label="Yayın durumunu değiştir"
            className={`
              relative
              h-7
              w-12
              shrink-0
              rounded-full
              transition-colors
              ${
                values.isActive
                  ? "bg-[#263A2D]"
                  : "bg-[#D8D6D0]"
              }
            `}
          >
            <span
              className={`
                absolute
                top-1
                h-5
                w-5
                rounded-full
                bg-white
                shadow-sm
                transition-all
                ${
                  values.isActive
                    ? "left-6"
                    : "left-1"
                }
              `}
            />
          </button>
        </div>
      </section>

      {/* Submit */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t border-[#DDD9D1] bg-[#F3F1EC]/95 p-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white transition-colors hover:bg-[#344B3A] sm:ml-auto sm:w-auto sm:px-8"
        >
          <Save size={16} />

          {submitLabel}
        </button>
      </div>
    </form>
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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
          <Icon
            size={18}
            strokeWidth={1.5}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-[#40463F]">
            {label}
          </p>

          <p className="mt-0.5 text-[10px] text-[#969990]">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center border border-[#DDD9D1]">
        <button
          type="button"
          onClick={onDecrease}
          className="flex h-10 w-10 items-center justify-center text-[#626860] active:bg-[#EEEAE3]"
        >
          <Minus size={15} />
        </button>

        <span className="flex h-10 min-w-10 items-center justify-center border-x border-[#DDD9D1] text-sm font-semibold text-[#263A2D]">
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-10 w-10 items-center justify-center text-[#626860] active:bg-[#EEEAE3]"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}