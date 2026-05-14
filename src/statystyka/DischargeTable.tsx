import { useState } from "react";
import { fmt } from "./fmt";
import { fmtPct } from "./fmtPct";
import { PieChart } from "./PieChart";
import type { DischargeEntry } from "../api/nfzStatApi";

export function DischargeTable({ entry }: { entry: DischargeEntry }) {
  const a = entry.attributes;
  const [dir, setDir] = useState<"desc" | "asc">("desc");
  const rows = [...(a.data ?? [])].sort((a, b) =>
    dir === "desc"
      ? b["number-of-hospitalizations"] - a["number-of-hospitalizations"]
      : a["number-of-hospitalizations"] - b["number-of-hospitalizations"],
  );
  return (
    <>
      <PieChart slices={rows.map((r) => ({ label: r["type-of-discharge-name"], value: r["number-of-hospitalizations"] }))} />
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Tryb wypisu</th>
              <th
                className="num sortable"
                onClick={() => setDir((d) => (d === "desc" ? "asc" : "desc"))}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                Hospitalizacje {dir === "desc" ? "↓" : "↑"}
              </th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r["type-of-discharge-name"]}</td>
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
