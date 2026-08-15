import type { SupabaseClient } from "@supabase/supabase-js";

import { sendEmail } from "@/lib/notifications/email";

import {
  createEmailLayout,
  escapeHtml,
  reservationDetailsHtml,
} from "@/lib/notifications/reservation/templates";

type ReservationDecision = "confirmed" | "rejected";

type ReservationDecisionRow = {
  accommodation_id: number;
  reservation_code: string;
  guest_name: string;
  guest_email: string | null;
  check_in: string;
  check_out: string;
  adult_count: number;
  child_count: number;
  total_price: number;
};

export async function notifyReservationDecision(
  supabase: SupabaseClient,
  reservationId: number,
  decision: ReservationDecision,
  reason?: string,
) {
  const { data: reservation, error } = await supabase
    .from("reservations")
    .select(
      `
        accommodation_id,
        reservation_code,
        guest_name,
        guest_email,
        check_in,
        check_out,
        adult_count,
        child_count,
        total_price
      `,
    )
    .eq("id", reservationId)
    .maybeSingle();

  if (error || !reservation) {
    console.error("Rezervasyon mail bilgisi alınamadı:", error);

    return;
  }

  const typedReservation = reservation as ReservationDecisionRow;

  if (!typedReservation.guest_email?.trim()) {
    console.info("Rezervasyon bildirimi atlandı: müşteri e-posta adresi yok.");

    return;
  }

  const { data: accommodation, error: accommodationError } = await supabase
    .from("accommodations")
    .select("title")
    .eq("id", typedReservation.accommodation_id)
    .maybeSingle();

  if (accommodationError || !accommodation) {
    console.error("Konaklama bilgisi alınamadı:", accommodationError);

    return;
  }

  const details = reservationDetailsHtml({
    reservationCode: typedReservation.reservation_code,

    accommodationTitle: accommodation.title,

    checkIn: typedReservation.check_in,
    checkOut: typedReservation.check_out,

    adultCount: Number(typedReservation.adult_count),

    childCount: Number(typedReservation.child_count),

    totalPrice: Number(typedReservation.total_price),
  });

  if (decision === "confirmed") {
    await sendEmail({
      to: typedReservation.guest_email,

      subject: `Rezervasyonunuz Onaylandı • ` + typedReservation.reservation_code,

      idempotencyKey: `reservation-confirmed/` + typedReservation.reservation_code,

      html: createEmailLayout({
        title: "Rezervasyonunuz Onaylandı",

        description:
          `${typedReservation.guest_name}, ödemeniz ` +
          "kontrol edildi ve rezervasyonunuz onaylandı.",

        content: `
          ${details}

          <div
            style="
              margin-top:20px;
              padding:16px;
              background:#eaf2e8;
              color:#496449;
              font-size:13px;
              line-height:1.6;
              font-weight:600;
            "
          >
            Rezervasyonunuz kesinleşmiştir.
            Sizi Altunhan Farm'da ağırlamak için
            sabırsızlanıyoruz.
          </div>
        `,
      }),

      text: `Rezervasyonunuz onaylandı. Rezervasyon No: ` + `${typedReservation.reservation_code}.`,
    });

    return;
  }

  const rejectionReason = reason || "Rezervasyon onaylanamadı.";

  await sendEmail({
    to: typedReservation.guest_email,

    subject: `Rezervasyonunuz Hakkında • ` + typedReservation.reservation_code,

    idempotencyKey: `reservation-rejected/` + typedReservation.reservation_code,

    html: createEmailLayout({
      title: "Rezervasyonunuz Onaylanamadı",

      description:
        `${typedReservation.guest_name}, rezervasyonunuz ` +
        "yapılan kontrol sonucunda onaylanamadı.",

      content: `
        ${details}

        <div
          style="
            margin-top:20px;
            padding:16px;
            background:#f8eeea;
            color:#98584e;
            font-size:13px;
            line-height:1.6;
          "
        >
          <strong>Red Sebebi</strong>

          <div style="margin-top:8px;">
            ${escapeHtml(rejectionReason)}
          </div>
        </div>
      `,
    }),

    text:
      `Rezervasyonunuz onaylanamadı. Rezervasyon No: ` +
      `${typedReservation.reservation_code}. ` +
      `Sebep: ${rejectionReason}`,
  });
}
