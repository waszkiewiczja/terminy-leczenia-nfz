import { fmt } from "./fmt";
import { fmtPct } from "./fmtPct";
import type { DiseaseEntry } from "../api/nfzStatApi";

export function DiseaseTable({ entry }: { entry: DiseaseEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Kod ICD-10</th>
              <th>Rozpoznanie</th>
              <th className="num">Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td data-label="Kod ICD-10">
                  <code>{r["disease-code"]}</code>
                </td>
                <td data-label="Rozpoznanie">{r["disease-name"]}</td>
                <td data-label="Hospitalizacje" className="num">
                  {fmt(r["number-of-hospitalizations"])}
                </td>
                <td data-label="Udział (%)" className="num">
                  {fmtPct(r.percentage)}
                </td>
                <td data-label="Mediana pobytu (dni)" className="num">
                  {fmt(r["duration-of-hospitalization-mediana"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
