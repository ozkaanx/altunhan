import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

import type { AccommodationImageValue, DeletedAccommodationImage } from "@/types/accommodation";

const STORAGE_BUCKET = "accommodations";

const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

type NewAccommodationImage = AccommodationImageValue & {
  file: File;
};

function hasFile(image: AccommodationImageValue): image is NewAccommodationImage {
  return Boolean(image.file);
}

function getImageExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!file.type.startsWith("image/") || !extension || !ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    throw new Error("Desteklenmeyen görsel formatı.");
  }

  return extension === "jpeg" ? "jpg" : extension;
}

async function uploadAccommodationImage({
  supabase,
  accommodationId,
  image,
  sortOrder,
}: {
  supabase: SupabaseClient;
  accommodationId: number;
  image: NewAccommodationImage;
  sortOrder: number;
}) {
  const extension = getImageExtension(image.file);

  const storagePath = `${accommodationId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, image.file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Fotoğraf yüklenemedi: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

  const { error: insertError } = await supabase.from("accommodation_images").insert({
    accommodation_id: accommodationId,
    image_url: publicUrlData.publicUrl,
    storage_path: storagePath,
    sort_order: sortOrder,
    is_cover: image.isCover,
  });

  if (!insertError) {
    return;
  }

  const { error: cleanupError } = await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);

  if (cleanupError) {
    console.error("Yüklenen fakat kaydedilemeyen görsel temizlenemedi:", cleanupError);
  }

  throw new Error(insertError.message);
}

async function deleteAccommodationImage(
  supabase: SupabaseClient,
  image: DeletedAccommodationImage,
) {
  const { error: deleteError } = await supabase
    .from("accommodation_images")
    .delete()
    .eq("id", image.id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([image.storagePath]);

  if (storageError) {
    console.error("Silinen görselin Storage dosyası temizlenemedi:", storageError);
  }
}

export async function uploadAccommodationImages(
  accommodationId: number,
  images: AccommodationImageValue[],
) {
  const supabase = createClient();
  const newImages = images.filter(hasFile);

  for (const [index, image] of newImages.entries()) {
    await uploadAccommodationImage({
      supabase,
      accommodationId,
      image,
      sortOrder: index,
    });
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
  const supabase = createClient();

  for (const image of deletedImages) {
    await deleteAccommodationImage(supabase, image);
  }

  const existingImages = images.filter((image) => image.isExisting && !image.file);

  for (const [index, image] of existingImages.entries()) {
    const { error } = await supabase
      .from("accommodation_images")
      .update({
        is_cover: image.isCover,
        sort_order: index,
      })
      .eq("id", Number(image.id));

    if (error) {
      throw new Error(error.message);
    }
  }

  const newImages = images.filter(hasFile);

  for (const [index, image] of newImages.entries()) {
    await uploadAccommodationImage({
      supabase,
      accommodationId,
      image,
      sortOrder: existingImages.length + index,
    });
  }
}
