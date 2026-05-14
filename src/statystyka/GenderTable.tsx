import { fmt } from "./fmt";
import { fmtPct } from "./fmtPct";
import { PieChart } from "./PieChart";
import type { GenderEntry } from "../api/nfzStatApi";

export function GenderTable({ entry }: { entry: GenderEntry }) {
  const a = entry.attributes;
  const rows = (a.data ?? []).filter(
    (r) => r["number-of-hospitalizations"] > 0,
  );
  return (
    <>
      <PieChart
        slices={rows.map((r) => ({
          label: r["gender-name"],
          value: r["number-of-hospitalizations"],
        }))}
      />
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Płeć</th>
              <th className="num">Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r["gender-name"]}</td>
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
