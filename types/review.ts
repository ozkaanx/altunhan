export type Review = {
  id: number;
  guest_name: string;
  review_text: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ReviewFormValues = {
  guestName: string;
  reviewText: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
};