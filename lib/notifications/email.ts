type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  idempotencyKey?: string;
};

type SendEmailResult =
  | {
      success: true;
      skipped?: false;
      id?: string;
    }
  | {
      success: true;
      skipped: true;
      reason: string;
    }
  | {
      success: false;
      message: string;
    };

export async function sendEmail({
  to,
  subject,
  html,
  text,
  idempotencyKey,
}: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  const from = process.env.RESEND_FROM_EMAIL?.trim();

  const replyTo = process.env.RESEND_REPLY_TO_EMAIL?.trim();

  /*
   * Domain / Resend henüz hazır değilse
   * rezervasyon akışını kesinlikle bozma.
   */
  if (!apiKey || !from) {
    console.info("E-posta bildirimi atlandı: Resend henüz yapılandırılmadı.");

    return {
      success: true,
      skipped: true,
      reason: "E-posta sistemi henüz yapılandırılmadı.",
    };
  }

  const recipients = Array.isArray(to) ? to : [to];

  const cleanRecipients = recipients.map((item) => item.trim()).filter(Boolean);

  if (!cleanRecipients.length) {
    return {
      success: true,
      skipped: true,
      reason: "Alıcı e-posta adresi bulunamadı.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,

        "Content-Type": "application/json",

        /*
         * Resend doğrudan HTTP
         * isteklerinde User-Agent ister.
         */
        "User-Agent": "altunhan-reservation-system/1.0",

        ...(idempotencyKey
          ? {
              "Idempotency-Key": idempotencyKey,
            }
          : {}),
      },

      body: JSON.stringify({
        from,

        to: cleanRecipients,

        subject,

        html,

        ...(text
          ? {
              text,
            }
          : {}),

        ...(replyTo
          ? {
              reply_to: replyTo,
            }
          : {}),
      }),

      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as {
      id?: string;
      message?: string;
      error?: {
        message?: string;
      };
    } | null;

    if (!response.ok) {
      const message =
        payload?.message ||
        payload?.error?.message ||
        `E-posta servisi ${response.status} hatası döndürdü.`;

      console.error("Resend e-posta hatası:", {
        status: response.status,
        message,
      });

      return {
        success: false,
        message,
      };
    }

    return {
      success: true,
      id: payload?.id,
    };
  } catch (error) {
    console.error("Resend bağlantı hatası:", error);

    return {
      success: false,

      message:
        error instanceof Error ? error.message : "E-posta gönderilemedi.",
    };
  }
}
