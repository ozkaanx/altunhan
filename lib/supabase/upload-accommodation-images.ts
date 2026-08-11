import { createClient } from "@/lib/supabase/client";

import type {
  AccommodationImageValue,
  DeletedAccommodationImage,
} from "@/types/accommodation";

export async function uploadAccommodationImages(
  accommodationId: number,
  images: AccommodationImageValue[],
) {
  const supabase = createClient();

  const newImages = images.filter(
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
        ?.toLowerCase() ??
      "jpg";

    const storagePath =
      `${accommodationId}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from("accommodations")
        .upload(
          storagePath,
          image.file,
          {
            cacheControl:
              "3600",
            upsert: false,
          },
        );

    if (uploadError) {
      throw new Error(
        `Fotoğraf yüklenemedi: ${uploadError.message}`,
      );
    }

    const { data } =
      supabase.storage
        .from(
          "accommodations",
        )
        .getPublicUrl(
          storagePath,
        );

    const { error } =
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
            index,
          is_cover:
            image.isCover,
        });

    if (error) {
      await supabase.storage
        .from(
          "accommodations",
        )
        .remove([
          storagePath,
        ]);

      throw new Error(
        error.message,
      );
    }
  }
}

type UpdateImagesParams = {
  accommodationId: number;
  images: AccommodationImageValue[];
  deletedImages: DeletedAccommodationImage[];
};

export async function updateAccommodationImages({
  accommodationId,
  images,
  deletedImages,
}: UpdateImagesParams) {
  const supabase =
    createClient();

  for (const image of deletedImages) {
    const { error: storageError } =
      await supabase.storage
        .from(
          "accommodations",
        )
        .remove([
          image.storagePath,
        ]);

    if (storageError) {
      throw new Error(
        storageError.message,
      );
    }

    const { error: deleteError } =
      await supabase
        .from(
          "accommodation_images",
        )
        .delete()
        .eq("id", image.id);

    if (deleteError) {
      throw new Error(
        deleteError.message,
      );
    }
  }

  const existingImages =
    images.filter(
      (image) =>
        image.isExisting &&
        !image.file,
    );

  for (
    let index = 0;
    index <
    existingImages.length;
    index++
  ) {
    const image =
      existingImages[index];

    const { error } =
      await supabase
        .from(
          "accommodation_images",
        )
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
        error.message,
      );
    }
  }

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
    index <
    newImages.length;
    index++
  ) {
    const image =
      newImages[index];

    const extension =
      image.file.name
        .split(".")
        .pop()
        ?.toLowerCase() ??
      "jpg";

    const storagePath =
      `${accommodationId}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from(
          "accommodations",
        )
        .upload(
          storagePath,
          image.file,
        );

    if (uploadError) {
      throw new Error(
        uploadError.message,
      );
    }

    const { data } =
      supabase.storage
        .from(
          "accommodations",
        )
        .getPublicUrl(
          storagePath,
        );

    const { error } =
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
            existingImages.length +
            index,
          is_cover:
            image.isCover,
        });

    if (error) {
      throw new Error(
        error.message,
      );
    }
  }
}