"use client";

import {
  Check,
  Loader2,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  updateHomepageContent,
} from "@/app/admin/homepage/action";

import type {
  HomepageContent,
  HomepageContentFormValues,
} from "@/types/homepage-content";

type HomepageContentFormProps = {
  content: HomepageContent;
};

export function HomepageContentForm({
  content,
}: HomepageContentFormProps) {
  const [
    form,
    setForm,
  ] =
    useState<HomepageContentFormValues>({
      heroLabel:
        content.hero_label,

      heroTitle:
        content.hero_title,

      heroDescription:
        content.hero_description,

      experienceTitle:
        content.experience_title,

      experienceDescription:
        content.experience_description,

      feature1Title:
        content.feature_1_title,

      feature1Description:
        content.feature_1_description,

      feature2Title:
        content.feature_2_title,

      feature2Description:
        content.feature_2_description,

      feature3Title:
        content.feature_3_title,

      feature3Description:
        content.feature_3_description,

      accommodationLabel:
        content.accommodation_label,

      accommodationTitle:
        content.accommodation_title,

      accommodationDescription:
        content.accommodation_description,

      locationLabel:
        content.location_label,

      locationTitle:
        content.location_title,

      reviewsLabel:
        content.reviews_label,

      reviewsTitle:
        content.reviews_title,

      footerLabel:
        content.footer_label,

      footerTitle:
        content.footer_title,

      footerDescription:
        content.footer_description,
    });

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

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
    useState(false);

  function updateField<
    K extends keyof HomepageContentFormValues,
  >(
    key: K,
    value: HomepageContentFormValues[K],
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,
        [key]: value,
      }),
    );

    setSuccess(
      false,
    );
  }

  async function handleSubmit() {
    try {
      setIsSaving(
        true,
      );

      setError(
        null,
      );

      setSuccess(
        false,
      );

      await updateHomepageContent(
        form,
      );

      setSuccess(
        true,
      );
    } catch (
      error
    ) {
      setError(
        error instanceof Error
          ? error.message
          : "Bir hata oluştu.",
      );
    } finally {
      setIsSaving(
        false,
      );
    }
  }

  return (
    <div className="space-y-6">
      <ContentSection
        title="Hero"
        description="Ana sayfanın ilk büyük alanındaki metinler."
      >
        <TextField
          label="Üst Etiket"
          value={
            form.heroLabel
          }
          onChange={(
            value,
          ) =>
            updateField(
              "heroLabel",
              value,
            )
          }
        />

        <TextField
          label="Başlık"
          value={
            form.heroTitle
          }
          onChange={(
            value,
          ) =>
            updateField(
              "heroTitle",
              value,
            )
          }
        />

        <TextareaField
          label="Açıklama"
          value={
            form.heroDescription
          }
          onChange={(
            value,
          ) =>
            updateField(
              "heroDescription",
              value,
            )
          }
        />
      </ContentSection>

      <ContentSection
        title="Deneyim"
        description="Sadece bir konaklama değil bölümündeki içerikler."
      >
        <TextField
          label="Başlık"
          value={
            form.experienceTitle
          }
          onChange={(
            value,
          ) =>
            updateField(
              "experienceTitle",
              value,
            )
          }
        />

        <TextareaField
          label="Açıklama"
          value={
            form.experienceDescription
          }
          onChange={(
            value,
          ) =>
            updateField(
              "experienceDescription",
              value,
            )
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FeatureFields
            title="Özellik 1"
            fieldTitle={
              form.feature1Title
            }
            description={
              form.feature1Description
            }
            onTitleChange={(
              value,
            ) =>
              updateField(
                "feature1Title",
                value,
              )
            }
            onDescriptionChange={(
              value,
            ) =>
              updateField(
                "feature1Description",
                value,
              )
            }
          />

          <FeatureFields
            title="Özellik 2"
            fieldTitle={
              form.feature2Title
            }
            description={
              form.feature2Description
            }
            onTitleChange={(
              value,
            ) =>
              updateField(
                "feature2Title",
                value,
              )
            }
            onDescriptionChange={(
              value,
            ) =>
              updateField(
                "feature2Description",
                value,
              )
            }
          />

          <FeatureFields
            title="Özellik 3"
            fieldTitle={
              form.feature3Title
            }
            description={
              form.feature3Description
            }
            onTitleChange={(
              value,
            ) =>
              updateField(
                "feature3Title",
                value,
              )
            }
            onDescriptionChange={(
              value,
            ) =>
              updateField(
                "feature3Description",
                value,
              )
            }
          />
        </div>
      </ContentSection>

      <ContentSection
        title="Konaklama Bölümü"
        description="Ana sayfadaki konaklama kartlarının üstündeki metinler."
      >
        <TextField
          label="Etiket"
          value={
            form.accommodationLabel
          }
          onChange={(
            value,
          ) =>
            updateField(
              "accommodationLabel",
              value,
            )
          }
        />

        <TextField
          label="Başlık"
          value={
            form.accommodationTitle
          }
          onChange={(
            value,
          ) =>
            updateField(
              "accommodationTitle",
              value,
            )
          }
        />

        <TextareaField
          label="Açıklama"
          value={
            form.accommodationDescription
          }
          onChange={(
            value,
          ) =>
            updateField(
              "accommodationDescription",
              value,
            )
          }
        />
      </ContentSection>

      <ContentSection
        title="Konum ve Yorumlar"
        description="Ana sayfanın konum ve misafir yorumları alanı."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <TextField
              label="Konum Etiketi"
              value={
                form.locationLabel
              }
              onChange={(
                value,
              ) =>
                updateField(
                  "locationLabel",
                  value,
                )
              }
            />

            <TextField
              label="Konum Başlığı"
              value={
                form.locationTitle
              }
              onChange={(
                value,
              ) =>
                updateField(
                  "locationTitle",
                  value,
                )
              }
            />
          </div>

          <div className="space-y-4">
            <TextField
              label="Yorum Etiketi"
              value={
                form.reviewsLabel
              }
              onChange={(
                value,
              ) =>
                updateField(
                  "reviewsLabel",
                  value,
                )
              }
            />

            <TextField
              label="Yorum Başlığı"
              value={
                form.reviewsTitle
              }
              onChange={(
                value,
              ) =>
                updateField(
                  "reviewsTitle",
                  value,
                )
              }
            />
          </div>
        </div>
      </ContentSection>

      <ContentSection
        title="Footer CTA"
        description="Sayfanın en altındaki rezervasyon çağrı alanı."
      >
        <TextField
          label="Etiket"
          value={
            form.footerLabel
          }
          onChange={(
            value,
          ) =>
            updateField(
              "footerLabel",
              value,
            )
          }
        />

        <TextField
          label="Başlık"
          value={
            form.footerTitle
          }
          onChange={(
            value,
          ) =>
            updateField(
              "footerTitle",
              value,
            )
          }
        />

        <TextareaField
          label="Açıklama"
          value={
            form.footerDescription
          }
          onChange={(
            value,
          ) =>
            updateField(
              "footerDescription",
              value,
            )
          }
        />
      </ContentSection>

      {error && (
        <div className="border border-[#ECD4CE] bg-[#FAF0ED] px-4 py-3 text-xs text-[#9A544A]">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 border border-[#CEE0CD] bg-[#EDF5EC] px-4 py-3 text-xs text-[#4E684D]">
          <Check
            size={15}
          />

          Ana sayfa
          içeriği
          kaydedildi.
        </div>
      )}

      <button
        type="button"
        disabled={
          isSaving
        }
        onClick={
          handleSubmit
        }
        className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white transition-colors hover:bg-[#344B3A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
            />

            Kaydediliyor...
          </>
        ) : (
          <>
            <Check
              size={16}
            />

            Değişiklikleri
            Kaydet
          </>
        )}
      </button>
    </div>
  );
}

function ContentSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="border border-[#E3E0D8] bg-white p-5 sm:p-6">
      <div className="border-b border-[#ECE8E1] pb-4">
        <h2 className="text-sm font-semibold text-[#263A2D]">
          {title}
        </h2>

        <p className="mt-1 text-[11px] leading-5 text-[#92968E]">
          {description}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {children}
      </div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange:
    (
      value: string,
    ) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777C75]">
        {label}
      </label>

      <input
        value={
          value
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value,
          )
        }
        className="mt-2 h-11 w-full border border-[#DDD9D1] px-3 text-sm text-[#263A2D] outline-none focus:border-[#263A2D]"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange:
    (
      value: string,
    ) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777C75]">
        {label}
      </label>

      <textarea
        value={
          value
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value,
          )
        }
        rows={4}
        className="mt-2 w-full resize-none border border-[#DDD9D1] px-3 py-3 text-sm leading-6 text-[#263A2D] outline-none focus:border-[#263A2D]"
      />
    </div>
  );
}

function FeatureFields({
  title,
  fieldTitle,
  description,
  onTitleChange,
  onDescriptionChange,
}: {
  title: string;
  fieldTitle: string;
  description: string;
  onTitleChange:
    (
      value: string,
    ) => void;
  onDescriptionChange:
    (
      value: string,
    ) => void;
}) {
  return (
    <div className="border border-[#ECE8E1] bg-[#FAF9F6] p-4">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A8754F]">
        {title}
      </p>

      <div className="space-y-4">
        <TextField
          label="Başlık"
          value={
            fieldTitle
          }
          onChange={
            onTitleChange
          }
        />

        <TextareaField
          label="Açıklama"
          value={
            description
          }
          onChange={
            onDescriptionChange
          }
        />
      </div>
    </div>
  );
}