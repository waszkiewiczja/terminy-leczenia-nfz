export function fmtPct(n: number | undefined | null): string {
  if (n == null) return "–";
  return (
    n.toLocaleString("pl-PL", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + "%"
  );
}
