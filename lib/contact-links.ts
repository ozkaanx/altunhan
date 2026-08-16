export function getPhoneHref(value: string | null | undefined) {
  const phone = value?.trim();

  if (!phone) {
    return null;
  }

  const normalizedPhone = phone.replace(/[^\d+]/g, "");

  return normalizedPhone ? `tel:${normalizedPhone}` : null;
}

export function getWhatsAppHref(value: string | null | undefined) {
  const phone = value?.replace(/\D/g, "") ?? "";

  if (!phone) {
    return null;
  }

  let internationalPhone = phone;

  if (internationalPhone.startsWith("00")) {
    internationalPhone = internationalPhone.slice(2);
  } else if (internationalPhone.startsWith("0")) {
    internationalPhone = `90${internationalPhone.slice(1)}`;
  } else if (internationalPhone.length === 10 && internationalPhone.startsWith("5")) {
    internationalPhone = `90${internationalPhone}`;
  }

  return `https://wa.me/${internationalPhone}`;
}
