import { createClient } from "@/lib/supabase/server";
import { getTurkeyToday } from "@/lib/reservation/date-utils";

import type {
  AdminFinancialReport,
  FinancialPaymentBreakdown,
  FinancialReportPayment,
  FinancialReportPaymentType,
  FinancialReportPeriod,
  FinancialReportRange,
} from "@/types/admin-financial-report";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function addDays(value: string, days: number) {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
}

function addMonths(value: string, months: number) {
  const date = parseDate(value);
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  return formatDate(date);
}

export function parseFinancialReportPeriod(value?: string): FinancialReportPeriod {
  return value === "day" || value === "week" || value === "month" ? value : "month";
}

export function parseFinancialReportDate(value?: string) {
  if (
    !value ||
    !DATE_PATTERN.test(value) ||
    Number.isNaN(parseDate(value).getTime()) ||
    formatDate(parseDate(value)) !== value
  ) {
    return getTurkeyToday();
  }

  return value;
}

export function getFinancialReportRange(
  period: FinancialReportPeriod,
  anchorDate: string,
): FinancialReportRange {
  if (period === "day") {
    return {
      period,
      anchorDate,
      startDate: anchorDate,
      endDate: anchorDate,
      previousAnchor: addDays(anchorDate, -1),
      nextAnchor: addDays(anchorDate, 1),
    };
  }

  if (period === "week") {
    const date = parseDate(anchorDate);
    const mondayOffset = (date.getUTCDay() + 6) % 7;
    const startDate = addDays(anchorDate, -mondayOffset);

    return {
      period,
      anchorDate,
      startDate,
      endDate: addDays(startDate, 6),
      previousAnchor: addDays(anchorDate, -7),
      nextAnchor: addDays(anchorDate, 7),
    };
  }

  const monthStart = `${anchorDate.slice(0, 7)}-01`;
  const nextMonthStart = addMonths(monthStart, 1);

  return {
    period,
    anchorDate,
    startDate: monthStart,
    endDate: addDays(nextMonthStart, -1),
    previousAnchor: addMonths(monthStart, -1),
    nextAnchor: nextMonthStart,
  };
}

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeReport(value: unknown): AdminFinancialReport | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const data = value as Record<string, unknown>;
  const summary = (data.summary ?? {}) as Record<string, unknown>;

  return {
    startDate: String(data.startDate ?? ""),
    endDate: String(data.endDate ?? ""),
    summary: {
      collectedRevenue: toNumber(summary.collectedRevenue),
      refundTotal: toNumber(summary.refundTotal),
      paymentCount: toNumber(summary.paymentCount),
      reservationCount: toNumber(summary.reservationCount),
      bookingValue: toNumber(summary.bookingValue),
      outstandingBalance: toNumber(summary.outstandingBalance),
      soldRoomNights: toNumber(summary.soldRoomNights),
      availableRoomNights: toNumber(summary.availableRoomNights),
      occupancyRate: toNumber(summary.occupancyRate),
    },
    daily: Array.isArray(data.daily)
      ? data.daily.map((item) => {
          const row = item as Record<string, unknown>;
          return {
            date: String(row.date ?? ""),
            revenue: toNumber(row.revenue),
            paymentCount: toNumber(row.paymentCount),
            occupiedRooms: toNumber(row.occupiedRooms),
            checkIns: toNumber(row.checkIns),
            checkOuts: toNumber(row.checkOuts),
            occupancyRate: toNumber(row.occupancyRate),
          };
        })
      : [],
    accommodations: Array.isArray(data.accommodations)
      ? data.accommodations.map((item) => {
          const row = item as Record<string, unknown>;
          return {
            accommodationId: toNumber(row.accommodationId),
            title: String(row.title ?? "Konaklama"),
            activeRoomCount: toNumber(row.activeRoomCount),
            soldRoomNights: toNumber(row.soldRoomNights),
            revenue: toNumber(row.revenue),
            occupancyRate: toNumber(row.occupancyRate),
          };
        })
      : [],
    paymentMethods: Array.isArray(data.paymentMethods)
      ? (data.paymentMethods.map((item) => {
          const row = item as Record<string, unknown>;
          return {
            method: String(row.method ?? "other"),
            amount: toNumber(row.amount),
            paymentCount: toNumber(row.paymentCount),
          };
        }) as AdminFinancialReport["paymentMethods"])
      : [],
    recentPayments: Array.isArray(data.recentPayments)
      ? (data.recentPayments.map((item) => {
          const row = item as Record<string, unknown>;
          return {
            paymentId: toNumber(row.paymentId),
            code: String(row.code ?? ""),
            guestName: String(row.guestName ?? ""),
            amount: toNumber(row.amount),
            method: String(row.method ?? "other"),
            paidAt: String(row.paidAt ?? ""),
          };
        }) as AdminFinancialReport["recentPayments"])
      : [],
  };
}

export async function getAdminFinancialReport(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_financial_report", {
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    console.error("Gelir ve doluluk raporu alınamadı:", error);
    return { report: null, error: error.message };
  }

  return {
    report: normalizeReport(data),
    error: null,
  };
}

function normalizePaymentBreakdown(value: unknown): FinancialPaymentBreakdown | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const data = value as Record<string, unknown>;

  return {
    grossCollected: toNumber(data.grossCollected),
    depositCollected: toNumber(data.depositCollected),
    balanceCollected: toNumber(data.balanceCollected),
    fullCollected: toNumber(data.fullCollected),
    refundTotal: toNumber(data.refundTotal),
    netCollected: toNumber(data.netCollected),
    collectionCount: toNumber(data.collectionCount),
    refundCount: toNumber(data.refundCount),
  };
}

export async function getAdminFinancialPaymentBreakdown(
  startDate: string,
  endDate: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_financial_payment_breakdown",
    {
      p_start_date: startDate,
      p_end_date: endDate,
    },
  );

  if (error) {
    console.error("Tahsilat kırılımı alınamadı:", error);

    return {
      breakdown: null,
      error: error.message,
    };
  }

  return {
    breakdown: normalizePaymentBreakdown(data),
    error: null,
  };
}

function normalizeRecentFinancialMovements(value: unknown): FinancialReportPayment[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  return value.map((item) => {
    const row = item as Record<string, unknown>;

    return {
      paymentId: toNumber(row.paymentId),
      code: String(row.code ?? ""),
      guestName: String(row.guestName ?? ""),
      amount: toNumber(row.amount),
      method: String(row.method ?? "other") as FinancialReportPayment["method"],
      paymentType: String(row.paymentType ?? "full") as FinancialReportPaymentType,
      paidAt: String(row.paidAt ?? ""),
    };
  });
}

export async function getAdminRecentFinancialMovements(
  startDate: string,
  endDate: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_recent_financial_movements",
    {
      p_start_date: startDate,
      p_end_date: endDate,
    },
  );

  if (error) {
    console.error("Son finansal hareketler alınamadı:", error);

    return {
      movements: null,
      error: error.message,
    };
  }

  return {
    movements: normalizeRecentFinancialMovements(data),
    error: null,
  };
}

