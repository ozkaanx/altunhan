import type { SupabaseClient } from "@supabase/supabase-js";

import { sendEmail } from "@/lib/notifications/email";

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

type ReservationDecision = "confirmed" | "rejected";

type ReservationDecisionRow = {
  id: number;
  accommodation_id: number;
  reservation_code: string;
  guest_name: string;
  guest_email: string | null;
  check_in: string;
  check_out: string;
  adult_count: number;
  child_count: number;
  night_count: number;
  total_price: number;
};

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}.${month}.${year}`;
}

function formatGuestSummary(adultCount: number, childCount: number) {
  if (childCount > 0) {
    return `${adultCount} yetişkin · ${childCount} çocuk`;
  }

  return `${adultCount} yetişkin`;
}

function createEmailLayout({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: string;
}) {
  return `
    <!doctype html>
    <html lang="tr">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f3f1ec;
          font-family:Arial,Helvetica,sans-serif;
          color:#263a2d;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background:#f3f1ec;padding:32px 16px;"
        >
          <tr>
            <td align="center">

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width:600px;
                  background:#ffffff;
                  border:1px solid #e3e0d8;
                "
              >
                <tr>
                  <td
                    style="
                      padding:28px;
                      background:#263a2d;
                      color:#ffffff;
                    "
                  >
                    <div
                      style="
                        font-size:11px;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        opacity:.7;
                      "
                    >
                      ALTUNHAN FARM
                    </div>

                    <div
                      style="
                        margin-top:8px;
                        font-size:24px;
                        font-weight:700;
                      "
                    >
                      ${escapeHtml(title)}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:28px;
                    "
                  >
                    <p
                      style="
                        margin:0;
                        font-size:14px;
                        line-height:1.7;
                        color:#626860;
                      "
                    >
                      ${escapeHtml(description)}
                    </p>

                    ${content}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:20px 28px;
                      border-top:1px solid #eeeae3;
                      font-size:11px;
                      line-height:1.6;
                      color:#969990;
                    "
                  >
                    Bu e-posta Altunhan Farm
                    rezervasyon sistemi tarafından
                    otomatik olarak gönderilmiştir.
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function reservationDetailsHtml({
  reservationCode,
  accommodationTitle,
  checkIn,
  checkOut,
  adultCount,
  childCount,

  totalPrice,
}: {
  reservationCode: string;
  accommodationTitle: string;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  totalPrice: number;
}) {
  return `
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        margin-top:24px;
        background:#faf9f6;
        border:1px solid #e4e1d9;
      "
    >
      <tr>
        <td style="padding:16px;">
          <div
            style="
              font-size:11px;
              color:#969990;
            "
          >
            Rezervasyon No
          </div>

          <div
            style="
              margin-top:4px;
              font-size:16px;
              font-weight:700;
              color:#263a2d;
            "
          >
            ${escapeHtml(reservationCode)}
          </div>
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:16px;
            border-top:1px solid #e4e1d9;
          "
        >
          <strong>Konaklama:</strong>
          ${escapeHtml(accommodationTitle)}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:16px;
            border-top:1px solid #e4e1d9;
          "
        >
          <strong>Giriş:</strong>
          ${escapeHtml(formatDate(checkIn))}

          &nbsp;&nbsp;

          <strong>Çıkış:</strong>
          ${escapeHtml(formatDate(checkOut))}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:16px;
            border-top:1px solid #e4e1d9;
          "
        >
       <strong>Misafir:</strong>
${escapeHtml(formatGuestSummary(adultCount, childCount))}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:16px;
            border-top:1px solid #e4e1d9;
          "
        >
          <strong>Toplam:</strong>
          ${escapeHtml(formatMoney(totalPrice))}
        </td>
      </tr>
    </table>
  `;
}

/*
 * ==================================================
 * DEKONT YÜKLENDİ
 * ==================================================
 */

export async function notifyReceiptSubmitted(
  supabase: SupabaseClient,
  reservationCode: string,
  storagePath: string,
) {
  const { data, error } = await supabase.rpc(
    "get_receipt_notification_context_v2",
    {
      p_reservation_code: reservationCode,

      p_storage_path: storagePath,
    },
  );

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

  /*
   * MÜŞTERİ MAILİ
   */

  if (reservation.guest_email?.trim()) {
    await sendEmail({
      to: reservation.guest_email,

      subject: `Dekontunuz Alındı • ${reservation.reservation_code}`,

      idempotencyKey: `receipt-received/${reservation.reservation_code}`,

      html: createEmailLayout({
        title: "Dekontunuz Alındı",

        description: `${reservation.guest_name}, ödeme dekontunuz başarıyla tarafımıza ulaştı. Rezervasyonunuz yönetici onayına gönderildi.`,

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
              Yönetici kontrolünden sonra size
              ayrıca bilgilendirme yapılacaktır.
            </div>
          `,
      }),

      text: `Dekontunuz alındı. Rezervasyon No: ${reservation.reservation_code}. Rezervasyonunuz yönetici onayına gönderildi.`,
    });
  }

  /*
   * ADMIN MAILI
   */

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();

  if (adminEmail) {
    await sendEmail({
      to: adminEmail,

      subject: `Yeni Dekont • ${reservation.reservation_code}`,

      idempotencyKey: `admin-receipt/${reservation.reservation_code}`,

      html: createEmailLayout({
        title: "Yeni Dekont Yüklendi",

        description: `${reservation.guest_name} adlı misafirin rezervasyonu onay bekliyor.`,

        content: details,
      }),

      text: `Yeni dekont yüklendi. ${reservation.reservation_code} numaralı rezervasyon onay bekliyor.`,
    });
  }
}

/*
 * ==================================================
 * ADMIN ONAY / RED
 * ==================================================
 */

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
        id,
        accommodation_id,
        reservation_code,
        guest_name,
        guest_email,
        check_in,
        check_out,
       adult_count,
child_count,
night_count,
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

    adultCount: Number(reservation.adult_count),

    childCount: Number(reservation.child_count),

    totalPrice: Number(typedReservation.total_price),
  });

  if (decision === "confirmed") {
    await sendEmail({
      to: typedReservation.guest_email,

      subject: `Rezervasyonunuz Onaylandı • ${typedReservation.reservation_code}`,

      idempotencyKey: `reservation-confirmed/${typedReservation.reservation_code}`,

      html: createEmailLayout({
        title: "Rezervasyonunuz Onaylandı",

        description: `${typedReservation.guest_name}, ödemeniz kontrol edildi ve rezervasyonunuz onaylandı.`,

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
              Sizi Altunhan Farm'da ağırlamak
              için sabırsızlanıyoruz.
            </div>
          `,
      }),

      text: `Rezervasyonunuz onaylandı. Rezervasyon No: ${typedReservation.reservation_code}.`,
    });

    return;
  }

  await sendEmail({
    to: typedReservation.guest_email,

    subject: `Rezervasyonunuz Hakkında • ${typedReservation.reservation_code}`,

    idempotencyKey: `reservation-rejected/${typedReservation.reservation_code}`,

    html: createEmailLayout({
      title: "Rezervasyonunuz Onaylanamadı",

      description: `${typedReservation.guest_name}, rezervasyonunuz yapılan kontrol sonucunda onaylanamadı.`,

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

            <div
              style="
                margin-top:8px;
              "
            >
              ${escapeHtml(reason || "Rezervasyon onaylanamadı.")}
            </div>
          </div>
        `,
    }),

    text: `Rezervasyonunuz onaylanamadı. Rezervasyon No: ${typedReservation.reservation_code}. Sebep: ${reason || "Rezervasyon onaylanamadı."}`,
  });
}
