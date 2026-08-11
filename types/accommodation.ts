export type AccommodationImage = {
  id: number;
  image_url: string;
  storage_path: string;
  sort_order: number;
  is_cover: boolean;
};

export type Accommodation = {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  capacity: number;
  bed_count: number;
  bathroom_count: number;
  amenities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;

  accommodation_images: AccommodationImage[];
};


export type AccommodationImageValue = {
  id: string;
  file?: File;

  previewUrl: string;

  existingUrl?: string;
  storagePath?: string;

  isCover: boolean;

  isExisting?: boolean;
};