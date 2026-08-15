export type HomeAccommodation = {
  id: number;
  title: string;
  slug: string | null;
  short_description: string | null;
  price: number;
  capacity: number;

  accommodation_images: Array<{
    id: number;
    image_url: string;
    sort_order: number;
    is_cover: boolean;
  }>;
};
