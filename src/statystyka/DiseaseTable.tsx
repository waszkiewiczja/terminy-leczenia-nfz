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
                <td>
                  <code>{r["disease-code"]}</code>
                </td>
                <td>{r["disease-name"]}</td>
                <td className="num">{fmt(r["number-of-hospitalizations"])}</td>
                <td className="num">{fmtPct(r.percentage)}</td>
                <td className="num">
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
