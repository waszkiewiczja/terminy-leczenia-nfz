import type { Table } from "../api/nfzStatApi";

const TABLE_TYPE_ORDER: Record<string, number> = {
  "basic-data": 0,
  "hospitalizations-by-patient-gender": 1,
  "hospitalizations-by-patient-age": 2,
};

export function sortTables(tables: Table[]): Table[] {
  return [...tables].sort((a, b) => {
    const oa = TABLE_TYPE_ORDER[a.attributes["resource-name"]] ?? 99;
    const ob = TABLE_TYPE_ORDER[b.attributes["resource-name"]] ?? 99;
    return oa - ob;
  });
}
