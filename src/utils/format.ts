// bt:ec52ad88d4b0903b
const EASTERN = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toEastern(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => EASTERN[Number(d)]);
}

export function formatPrice(n: number): string {
  return `${n} ر.س`;
}
