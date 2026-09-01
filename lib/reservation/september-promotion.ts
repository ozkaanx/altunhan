import { calculateNightCount, getTurkeyToday } from "@/lib/reservation/date-utils";

export const SEPTEMBER_PROMOTION = {
  startDate: "2026-09-01",
  endDateExclusive: "2026-10-01",
  discountPercentage: 20,
  label: "Eylül Fırsatı",
} as const;

export type SeptemberPromotionPricing = {
  nightCount: number;
  regularTotal: number;
  discountedNightCount: number;
  discountAmount: number;
  totalPrice: number;
  firstNightPrice: number;
  hasDiscount: boolean;
};

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getSeptemberPromotionalNightlyPrice(nightlyPrice: number) {
  return roundMoney(nightlyPrice * (1 - SEPTEMBER_PROMOTION.discountPercentage / 100));
}

export function isSeptemberPromotionVisible(today = getTurkeyToday()) {
  return today < SEPTEMBER_PROMOTION.endDateExclusive;
}

export function calculateSeptemberPromotionPricing(
  nightlyPrice: number,
  checkIn: string,
  checkOut: string,
): SeptemberPromotionPricing {
  const safeNightlyPrice = Math.max(0, Number(nightlyPrice) || 0);
  const nightCount = calculateNightCount(checkIn, checkOut);
  const regularTotal = roundMoney(safeNightlyPrice * nightCount);

  if (nightCount <= 0) {
    return {
      nightCount: 0,
      regularTotal: 0,
      discountedNightCount: 0,
      discountAmount: 0,
      totalPrice: 0,
      firstNightPrice: 0,
      hasDiscount: false,
    };
  }

  const discountStart = checkIn > SEPTEMBER_PROMOTION.startDate
    ? checkIn
    : SEPTEMBER_PROMOTION.startDate;
  const discountEnd = checkOut < SEPTEMBER_PROMOTION.endDateExclusive
    ? checkOut
    : SEPTEMBER_PROMOTION.endDateExclusive;
  const discountedNightCount = calculateNightCount(discountStart, discountEnd);
  const discountAmount = roundMoney(
    safeNightlyPrice * discountedNightCount * (SEPTEMBER_PROMOTION.discountPercentage / 100),
  );
  const firstNightHasDiscount =
    checkIn >= SEPTEMBER_PROMOTION.startDate &&
    checkIn < SEPTEMBER_PROMOTION.endDateExclusive;

  return {
    nightCount,
    regularTotal,
    discountedNightCount,
    discountAmount,
    totalPrice: roundMoney(Math.max(regularTotal - discountAmount, 0)),
    firstNightPrice: firstNightHasDiscount
      ? getSeptemberPromotionalNightlyPrice(safeNightlyPrice)
      : safeNightlyPrice,
    hasDiscount: discountedNightCount > 0,
  };
}
