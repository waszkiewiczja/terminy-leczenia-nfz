import { fmt } from "./fmt";
import { fmtPct } from "./fmtPct";
import { PieChart } from "./PieChart";
import type { AgeEntry } from "../api/nfzStatApi";

export function AgeTable({ entry }: { entry: AgeEntry }) {
  const a = entry.attributes;
  const rows = [...(a.data ?? [])]
    .filter((r) => r["number-of-hospitalizations"] > 0)
    .sort((a, b) => a["age-group-code"] - b["age-group-code"]);
  return (
    <>
      <PieChart
        slices={rows.map((r) => ({
          label: r["age-group-name"],
          value: r["number-of-hospitalizations"],
        }))}
      />
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Grupa wiekowa</th>
              <th className="num">Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r["age-group-name"]}</td>
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
