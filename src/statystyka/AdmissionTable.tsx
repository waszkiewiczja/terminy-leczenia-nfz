import { fmt } from "./fmt";
import { fmtPct } from "./fmtPct";
import type { AdmissionEntry } from "../api/nfzStatApi";

export function AdmissionTable({ entry }: { entry: AdmissionEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Tryb przyjęcia</th>
              <th className="num">Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r["type-of-admission-name"]}</td>
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
