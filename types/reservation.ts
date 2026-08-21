export type ReservationStatus =
  "pending_payment" | "pending_approval" | "confirmed" | "rejected" | "cancelled";

export type ReservationPaymentPlan = "deposit" | "full";

export type ReservationPaymentStatus = "unpaid" | "pending" | "partial" | "paid";

export type ReservationPaymentMethod = "bank_transfer" | "cash" | "card" | "other";

export type ReservationPaymentType = "deposit" | "balance" | "full" | "refund";

export type ReservationPaymentRecordStatus = "pending" | "confirmed" | "rejected";

export type ReservationPayment = {
  id: number;
  reservation_id: number;
  amount: number;
  requested_amount: number;
  payment_type: ReservationPaymentType;
  payment_method: ReservationPaymentMethod;
  status: ReservationPaymentRecordStatus;
  receipt_storage_path: string | null;
  admin_note: string | null;
  paid_at: string | null;
  created_at: string;
};

export type Reservation = {
  id: number;
  accommodation_id: number;

  reservation_code: string;

  guest_name: string;
  guest_identity_number: string | null;
  guest_phone: string;
  guest_email: string | null;

  check_in: string;
  check_out: string;

  guest_count: number;
  adult_count: number;
  child_count: number;

  requested_bed_configuration: "one_double" | "double_single" | "two_double" | null;

  nightly_price: number;
  night_count: number;
  total_price: number;

  payment_method: string;

  payment_plan: ReservationPaymentPlan;
  deposit_percentage: number;
  deposit_target_amount: number;
  payment_status: ReservationPaymentStatus;

  reservation_payments?: ReservationPayment[];

  receipt_url: string | null;
  receipt_storage_path: string | null;

  status: ReservationStatus;

  admin_note: string | null;

  rejection_reason: string | null;

  cancellation_reason: string | null;

  created_at: string;
  updated_at: string;

  room_id: number | null;

  accommodations: {
    id: number;
    title: string;
  } | null;

  rooms: {
    id: number;
    room_name: string;
    room_number: string | null;
    bed_configuration: "one_double" | "double_single" | "two_double" | null;
    max_guests: number | null;
  } | null;
};
