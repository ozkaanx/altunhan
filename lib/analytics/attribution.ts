export type GoogleAnalyticsAttribution = {
  clientId: string;
  sessionId: string | null;
};

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function getGtagValue(fieldName: "client_id" | "session_id"): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof window.gtag !== "function" || !measurementId) {
      resolve(null);
      return;
    }

    let completed = false;

    const timeoutId = window.setTimeout(() => {
      if (completed) {
        return;
      }

      completed = true;
      resolve(null);
    }, 600);

    window.gtag("get", measurementId, fieldName, (value) => {
      if (completed) {
        return;
      }

      completed = true;
      window.clearTimeout(timeoutId);

      if (value === undefined || value === null || value === "") {
        resolve(null);
        return;
      }

      resolve(String(value));
    });
  });
}

export async function getGoogleAnalyticsAttribution(): Promise<GoogleAnalyticsAttribution | null> {
  const [clientId, sessionId] = await Promise.all([
    getGtagValue("client_id"),
    getGtagValue("session_id"),
  ]);

  if (!clientId) {
    return null;
  }

  return {
    clientId,
    sessionId,
  };
}
