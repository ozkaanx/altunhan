import type { SupabaseClient } from "@supabase/supabase-js";

import { sendEmail } from "@/lib/notifications/email";

import {
  createEmailLayout,
  reservationDetailsHtml,
} from "@/lib/notifications/reservation/templates";

type ReceiptNotificationContext = {
  reservation_code: string;
  guest_name: string;
  guest_email: string | null;
  accommodation_title: string;
  check_in: string;
  check_out: string;
  adult_count: number;
  child_count: number;
  night_count: number;
  total_price: number;
};

export async function notifyReceiptSubmitted(
  supabase: SupabaseClient,
  reservationCode: string,
  storagePath: string,
) {
  const { data, error } = await supabase.rpc("get_receipt_notification_context_v2", {
    p_reservation_code: reservationCode,
    p_storage_path: storagePath,
  });

  if (error) {
    console.error("Dekont bildirim bilgisi alınamadı:", error);

    return;
  }

  const reservation = (data as ReceiptNotificationContext[] | null)?.[0];

  if (!reservation) {
    console.error("Dekont bildirimi için rezervasyon bulunamadı.");

    return;
  }

  const details = reservationDetailsHtml({
    reservationCode: reservation.reservation_code,
    accommodationTitle: reservation.accommodation_title,
    checkIn: reservation.check_in,
    checkOut: reservation.check_out,
    adultCount: Number(reservation.adult_count),
    childCount: Number(reservation.child_count),
    totalPrice: Number(reservation.total_price),
  });

  if (reservation.guest_email?.trim()) {
    await sendEmail({
      to: reservation.guest_email,

      subject: `Dekontunuz Alındı • ${reservation.reservation_code}`,

      idempotencyKey: `receipt-received/${reservation.reservation_code}`,

      html: createEmailLayout({
        title: "Dekontunuz Alındı",

        description:
          `${reservation.guest_name}, ödeme dekontunuz başarıyla tarafımıza ulaştı. ` +
          "Rezervasyonunuz yönetici onayına gönderildi.",

        content: `
          ${details}

          <div
            style="
              margin-top:20px;
              padding:16px;
              background:#f1f6ef;
              color:#526a51;
              font-size:13px;
              line-height:1.6;
            "
          >
            Rezervasyonunuz henüz kesinleşmemiştir.
            Yönetici kontrolünden sonra size ayrıca
            bilgilendirme yapılacaktır.
          </div>
        `,
      }),

      text:
        `Dekontunuz alındı. Rezervasyon No: ` +
        `${reservation.reservation_code}. ` +
        "Rezervasyonunuz yönetici onayına gönderildi.",
    });
  }

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();

  if (!adminEmail) {
    return;
  }

  await sendEmail({
    to: adminEmail,

    subject: `Yeni Dekont • ${reservation.reservation_code}`,

    idempotencyKey: `admin-receipt/${reservation.reservation_code}`,

    html: createEmailLayout({
      title: "Yeni Dekont Yüklendi",

      description: `${reservation.guest_name} adlı misafirin ` + "rezervasyonu onay bekliyor.",

      content: details,
    }),

    text:
      `Yeni dekont yüklendi. ` +
      `${reservation.reservation_code} numaralı ` +
      "rezervasyon onay bekliyor.",
  });
}
