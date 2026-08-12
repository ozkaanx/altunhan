export type ReservationStatus =
  | "pending_payment"
  | "pending_approval"
  | "confirmed"
  | "rejected"
  | "cancelled";

export type Reservation = {
  id: number;
  accommodation_id: number;

  reservation_code: string;

  guest_name: string;
  guest_phone: string;
  guest_email: string | null;

  check_in: string;
  check_out: string;

  guest_count: number;

  nightly_price: number;
  night_count: number;
  total_price: number;

  payment_method: string;

  receipt_url: string | null;
  receipt_storage_path: string | null;

  status: ReservationStatus;

  admin_note: string | null;

  rejection_reason: string | null;

  cancellation_reason: string | null;

  created_at: string;
  updated_at: string;

  accommodations: {
    id: number;
    title: string;
  } | null;
};