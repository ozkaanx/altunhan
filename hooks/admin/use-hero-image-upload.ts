"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createHeroImageStoragePath, validateHeroImage } from "@/lib/admin/hero-image-utils";
import { createClient } from "@/lib/supabase/client";

const SITE_ASSETS_BUCKET = "site-assets";

export function useHeroImageUpload(initialImageUrl: string | null) {
  const router = useRouter();

  const [heroImageUrl, setHeroImageUrl] = useState(initialImageUrl ?? "");
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  const selectHeroImage = (file: File | null) => {
    setHeroImage(file);
    setHeroError(null);
  };

  const uploadHeroImage = async () => {
    if (!heroImage) {
      return;
    }

    const validationError = validateHeroImage(heroImage);

    if (validationError) {
      setHeroError(validationError);
      return;
    }

    setHeroError(null);
    setIsUploadingHero(true);

    try {
      const storagePath = createHeroImageStoragePath(heroImage);
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from(SITE_ASSETS_BUCKET)
        .upload(storagePath, heroImage, {
          cacheControl: "3600",
          upsert: false,
          contentType: heroImage.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from(SITE_ASSETS_BUCKET)
        .getPublicUrl(storagePath);

      const imageUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("site_settings")
        .update({
          hero_image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (updateError) {
        await supabase.storage.from(SITE_ASSETS_BUCKET).remove([storagePath]);
        throw updateError;
      }

      setHeroImageUrl(imageUrl);
      setHeroImage(null);
      router.refresh();
    } catch (uploadError) {
      console.error(uploadError);
      setHeroError(
        uploadError instanceof Error ? uploadError.message : "Hero görseli yüklenemedi.",
      );
    } finally {
      setIsUploadingHero(false);
    }
  };

  return {
    heroImageUrl,
    heroImage,
    isUploadingHero,
    heroError,
    selectHeroImage,
    uploadHeroImage,
  };
}
