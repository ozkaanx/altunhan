const MAX_HERO_IMAGE_SIZE = 10 * 1024 * 1024;

const HERO_IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function validateHeroImage(file: File) {
  if (file.size > MAX_HERO_IMAGE_SIZE) {
    return "Hero görseli en fazla 10 MB olabilir.";
  }

  if (!HERO_IMAGE_EXTENSIONS[file.type]) {
    return "Sadece JPG, PNG veya WEBP yükleyebilirsiniz.";
  }

  return null;
}

export function createHeroImageStoragePath(file: File) {
  const extension = HERO_IMAGE_EXTENSIONS[file.type] ?? "jpg";

  return `hero/hero-${Date.now()}.${extension}`;
}
