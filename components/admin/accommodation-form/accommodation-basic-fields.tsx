import {
  Field,
  SectionHeader,
  inputClass,
} from "@/components/admin/accommodation-form/form-elements";

import type { AccommodationFormValues } from "@/types/accommodation";

type UpdateAccommodationValue = <K extends keyof AccommodationFormValues>(
  key: K,
  value: AccommodationFormValues[K],
) => void;

type AccommodationBasicFieldsProps = {
  values: AccommodationFormValues;
  onChange: UpdateAccommodationValue;
};

export function AccommodationBasicFields({ values, onChange }: AccommodationBasicFieldsProps) {
  return (
    <>
      <section className="border border-[#E3E0D8] bg-white">
        <SectionHeader title="Temel Bilgiler" description="Konaklamanın ana bilgilerini girin." />

        <div className="space-y-5 p-4 sm:p-5">
          <Field label="Konaklama Adı">
            <input
              value={values.title}
              required
              onChange={(event) => onChange("title", event.target.value)}
              placeholder="Örn. Bungalov"
              className={inputClass}
            />
          </Field>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="accommodation-short-description"
                className="text-xs font-medium text-[#40463F]"
              >
                Kısa Açıklama
              </label>

              <span className="text-[10px] text-[#A0A39C]">
                {values.shortDescription.length}/180
              </span>
            </div>

            <input
              id="accommodation-short-description"
              value={values.shortDescription}
              minLength={10}
              maxLength={180}
              onChange={(event) => onChange("shortDescription", event.target.value)}
              placeholder="Kartlarda gösterilecek kısa açıklama"
              className={`${inputClass} mt-2`}
            />

            <p className="mt-1.5 text-[10px] leading-4 text-[#8A8F88]">
              Yayına alınacak konaklamalarda müşteriye anlaşılır bir açıklama yazın.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#40463F]">Açıklama</label>

              <span className="text-[10px] text-[#A0A39C]">{values.description.length}/1000</span>
            </div>

            <textarea
              value={values.description}
              maxLength={1000}
              onChange={(event) => onChange("description", event.target.value)}
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
                onChange={(event) => onChange("price", Number(event.target.value))}
                className={`${inputClass} pr-14 text-lg font-semibold`}
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#888D85]">
                TL
              </span>
            </div>
          </Field>
        </div>
      </section>
    </>
  );
}
