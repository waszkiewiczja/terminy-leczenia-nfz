import type { IndexYear } from "../api/nfzStatApi";
import { sortTables } from "./sortTables";
import { TablePanel } from "./TablePanel";

interface YearViewProps {
  yearData: IndexYear;
}

const EXCLUDED_TYPES = new Set([
  "product-categories",
  "hospitalization-by-admission-nfz",
  "hospitalization-by-service",
  "hospitalization-by-admission",
  "icd-9-procedures",
  "general-data",
]);

const AUTO_EXPANDED = new Set([
  "hospitalization-by-gender",
  "hospitalization-by-age",
]);

export function YearView({ yearData }: YearViewProps) {
  const allTables = sortTables([
    ...(yearData.tables ?? []),
    ...(yearData.periods?.flatMap((p) => p.tables ?? []) ?? []),
  ]).filter((t) => !EXCLUDED_TYPES.has(t.type));

  return (
    <div className="year-view">
      {allTables.map((t) => (
        <TablePanel key={t.id} table={t} defaultExpanded={AUTO_EXPANDED.has(t.type)} />
      ))}
    </div>
  );
}
