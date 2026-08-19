export function normalizeTckn(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function isValidTckn(value: string) {
  const normalized = normalizeTckn(value);

  if (!/^[1-9]\d{10}$/.test(normalized)) {
    return false;
  }

  const digits = Array.from(normalized, Number);

  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];

  const tenthDigit = (((oddSum * 7 - evenSum) % 10) + 10) % 10;
  const eleventhDigit = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;

  return digits[9] === tenthDigit && digits[10] === eleventhDigit;
}

export function formatTcknForDisplay(value: string) {
  const normalized = normalizeTckn(value);

  if (normalized.length !== 11) {
    return value;
  }

  return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6, 9)} ${normalized.slice(9)}`;
}
