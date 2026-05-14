export function fmt(n: number | undefined | null, decimals = 0): string {
  if (n == null) return "–";
  return n.toLocaleString("pl-PL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
