const TURKISH_MOBILE_PATTERN = /^5\d{9}$/;

function getDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function getTurkishMobileNationalNumber(value: string) {
  let digits = getDigits(value);

  if (digits.startsWith("0090")) {
    digits = digits.slice(4);
  } else if (digits.startsWith("90") && digits.length > 10) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
}

export function formatTurkishMobileInput(value: string) {
  const nationalNumber = getTurkishMobileNationalNumber(value).slice(0, 10);
  const groups = [
    nationalNumber.slice(0, 3),
    nationalNumber.slice(3, 6),
    nationalNumber.slice(6, 8),
    nationalNumber.slice(8, 10),
  ].filter(Boolean);

  return groups.join(" ");
}

export function normalizeTurkishMobilePhone(value: string) {
  const nationalNumber = getTurkishMobileNationalNumber(value);

  if (!TURKISH_MOBILE_PATTERN.test(nationalNumber)) {
    return null;
  }

  return `+90${nationalNumber}`;
}

export function formatTurkishPhoneForDisplay(value: string) {
  const normalizedPhone = normalizeTurkishMobilePhone(value);

  if (!normalizedPhone) {
    return value;
  }

  return `+90 ${formatTurkishMobileInput(normalizedPhone)}`;
}
