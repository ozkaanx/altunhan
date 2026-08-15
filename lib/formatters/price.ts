export function formatPrice(value: number | string) {
  return `${Number(value).toLocaleString("tr-TR")} TL`;
}
