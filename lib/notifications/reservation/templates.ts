import { CHECK_IN_POLICY_TEXT, CHECK_OUT_POLICY_TEXT } from "@/lib/reservation/stay-policy";

export function escapeHtml(value: string | number | null | undefined) {
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

export function createEmailLayout({
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
                  <td style="padding:28px;">
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
                    Bu e-posta Altunhan Farm rezervasyon
                    sistemi tarafından otomatik olarak
                    gönderilmiştir.
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

type ReservationDetailsParams = {
  reservationCode: string;
  accommodationTitle: string;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  totalPrice: number;
};

export function reservationDetailsHtml({
  reservationCode,
  accommodationTitle,
  checkIn,
  checkOut,
  adultCount,
  childCount,
  totalPrice,
}: ReservationDetailsParams) {
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
          <div style="font-size:11px;color:#969990;">
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
          ${escapeHtml(formatDate(checkIn))} · ${escapeHtml(CHECK_IN_POLICY_TEXT)}

          &nbsp;&nbsp;

          <strong>Çıkış:</strong>
          ${escapeHtml(formatDate(checkOut))} · ${escapeHtml(CHECK_OUT_POLICY_TEXT)}
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
