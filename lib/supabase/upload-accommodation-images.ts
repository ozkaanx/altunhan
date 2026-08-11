import { createClient } from "@/lib/supabase/client";

import type {
  AccommodationImageValue,
} from "@/components/admin/accommodation-form";

type DeletedImage = {
  id: number;
  storagePath: string;
};

type UpdateAccommodationImagesParams = {
  accommodationId: number;
  images: AccommodationImageValue[];
  deletedImages: DeletedImage[];
};

export async function updateAccommodationImages({
  accommodationId,
  images,
  deletedImages,
}: UpdateAccommodationImagesParams) {
  const supabase = createClient();

  // 1. Silinen fotoğraflar
  for (const image of deletedImages) {
    const { error: storageError } =
      await supabase.storage
        .from("accommodations")
        .remove([
          image.storagePath,
        ]);

    if (storageError) {
      throw new Error(
        `Fotoğraf silinemedi: ${storageError.message}`,
      );
    }

    const { error: databaseError } =
      await supabase
        .from("accommodation_images")
        .delete()
        .eq("id", image.id);

    if (databaseError) {
      throw new Error(
        `Fotoğraf kaydı silinemedi: ${databaseError.message}`,
      );
    }
  }

  // 2. Mevcut fotoğrafların cover/sıra bilgisi
  const existingImages =
    images.filter(
      (image) =>
        image.isExisting &&
        !image.file,
    );

  for (
    let index = 0;
    index < existingImages.length;
    index++
  ) {
    const image =
      existingImages[index];

    const { error } = await supabase
      .from("accommodation_images")
      .update({
        is_cover:
          image.isCover,
        sort_order:
          index,
      })
      .eq(
        "id",
        Number(image.id),
      );

    if (error) {
      throw new Error(
        `Fotoğraf güncellenemedi: ${error.message}`,
      );
    }
  }

  // 3. Yeni seçilen fotoğraflar
  const newImages =
    images.filter(
      (
        image,
      ): image is AccommodationImageValue & {
        file: File;
      } => Boolean(image.file),
    );

  for (
    let index = 0;
    index < newImages.length;
    index++
  ) {
    const image = newImages[index];

    const extension =
      image.file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName =
      `${crypto.randomUUID()}.${extension}`;

    const storagePath =
      `${accommodationId}/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from("accommodations")
        .upload(
          storagePath,
          image.file,
          {
            cacheControl: "3600",
            upsert: false,
          },
        );

    if (uploadError) {
      throw new Error(
        `Yeni fotoğraf yüklenemedi: ${uploadError.message}`,
      );
    }

    const { data } =
      supabase.storage
        .from("accommodations")
        .getPublicUrl(
          storagePath,
        );

    const sortOrder =
      existingImages.length +
      index;

    const { error: insertError } =
      await supabase
        .from(
          "accommodation_images",
        )
        .insert({
          accommodation_id:
            accommodationId,

          image_url:
            data.publicUrl,

          storage_path:
            storagePath,

          sort_order:
            sortOrder,

          is_cover:
            image.isCover,
        });

    if (insertError) {
      await supabase.storage
        .from("accommodations")
        .remove([
          storagePath,
        ]);

      throw new Error(
        `Fotoğraf kaydedilemedi: ${insertError.message}`,
      );
    }
  }
}