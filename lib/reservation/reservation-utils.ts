export const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;

export const ALLOWED_RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export function calculateReservationTotal(nightlyPrice: number, nightCount: number) {
  return Math.max(0, nightlyPrice * nightCount);
}

export function formatReservationPrice(price: number) {
  return `${price.toLocaleString("tr-TR")} TL`;
}

export function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() || "jpg";
}

export function isAllowedReceiptType(type: string) {
  return (ALLOWED_RECEIPT_TYPES as readonly string[]).includes(type);
}

export function isReceiptSizeValid(size: number) {
  return size <= MAX_RECEIPT_SIZE;
}
