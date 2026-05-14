import type { SearchFilters } from "../types";

export function filtersFromParams(): SearchFilters | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  if (!p.has("s")) return null;
  return {
    swiadczenie: p.get("s") ?? "",
    wojewodztwo: p.getAll("w"),
    miejscowosc: p.get("m") ?? "",
    szpital: p.get("p") ?? "",
    dzieci: p.get("d") === "1",
  };
}
