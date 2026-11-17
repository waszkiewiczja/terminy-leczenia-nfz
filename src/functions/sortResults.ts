import type { TerminRecord } from "../types";

export function sortResults(records: TerminRecord[]): TerminRecord[] {
  return [...records].sort((a, b) => {
    if (a.sredni_czas === null) return b.sredni_czas === null ? 0 : 1;
    if (b.sredni_czas === null) return -1;
    return a.sredni_czas - b.sredni_czas;
  });
}
