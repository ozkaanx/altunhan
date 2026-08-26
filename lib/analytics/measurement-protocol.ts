type ReservationConfirmedEventInput = {
  clientId: string;
  reservationCode: string;
  totalPrice: number;
};

type MeasurementProtocolResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

const measurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const apiSecret =
  process.env.GA_MEASUREMENT_PROTOCOL_API_SECRET;

export async function sendReservationConfirmedEvent({
  clientId,
  reservationCode,
  totalPrice,
}: ReservationConfirmedEventInput): Promise<MeasurementProtocolResult> {
  if (!measurementId) {
    return {
      success: false,
      message:
        "NEXT_PUBLIC_GA_MEASUREMENT_ID tanımlı değil.",
    };
  }

  if (!apiSecret) {
    return {
      success: false,
      message:
        "GA_MEASUREMENT_PROTOCOL_API_SECRET tanımlı değil.",
    };
  }

  const cleanClientId = clientId.trim();

  if (!cleanClientId) {
    return {
      success: false,
      message: "Google Analytics client_id bulunamadı.",
    };
  }

  if (
    !Number.isFinite(totalPrice) ||
    totalPrice <= 0
  ) {
    return {
      success: false,
      message: "Rezervasyon tutarı geçersiz.",
    };
  }

  const endpoint = new URL(
    "https://region1.google-analytics.com/mp/collect",
  );

  endpoint.searchParams.set(
    "measurement_id",
    measurementId,
  );

  endpoint.searchParams.set(
    "api_secret",
    apiSecret,
  );

  try {
    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      cache: "no-store",

      body: JSON.stringify({
        client_id: cleanClientId,

        events: [
          {
            name: "reservation_confirmed",

            params: {
              value: totalPrice,
              currency: "TRY",
              transaction_id: reservationCode,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Google Analytics isteği başarısız oldu. HTTP ${response.status}`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Google Analytics Measurement Protocol hatası:",
      error,
    );

    return {
      success: false,
      message:
        "Google Analytics sunucusuna ulaşılamadı.",
    };
  }
}