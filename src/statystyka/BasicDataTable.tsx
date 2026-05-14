import { fmt } from "./fmt";
import { fmtPct } from "./fmtPct";
import type { BasicDataEntry } from "../api/nfzStatApi";

export function BasicDataTable({ entry }: { entry: BasicDataEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  const hasBranch = rows.some((r) => r.branch);
  const hasHospitalTypes = rows.some((r) => r["hospital-types"]);
  const hasValues = rows.some(
    (r) =>
      r["average-value-of-hospitalization"] != null ||
      r["average-value-of-drg"] != null,
  );
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              {hasBranch && <th>Oddział NFZ</th>}
              {hasHospitalTypes && <th>Typ szpitala</th>}
              <th className="num">Pacjenci</th>
              <th className="num">Hospitalizacje</th>
              <th className="num">Wsp. rehospitalizacji</th>
              <th className="num">Udział (%)</th>
              <th className="num">Mediana pobytu (dni)</th>
              <th className="num">Dominanta pobytu (dni)</th>
              {hasValues && <th className="num">Śr. wartość hosp. (zł)</th>}
              {hasValues && <th className="num">Śr. wartość grupy (zł)</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {hasBranch && (
                  <td data-label="Oddział NFZ">{r.branch ?? "–"}</td>
                )}
                {hasHospitalTypes && (
                  <td data-label="Typ szpitala">
                    {r["hospital-types"] ?? "–"}
                  </td>
                )}
                <td data-label="Pacjenci" className="num">
                  {fmt(r["number-of-patients"])}
                </td>
                <td data-label="Hospitalizacje" className="num">
                  {fmt(r["number-of-hospitalizations"])}
                </td>
                <td data-label="Wsp. rehospitalizacji" className="num">
                  {fmt(r["ratio-of-rehospitalizations"], 2)}
                </td>
                <td data-label="Udział (%)" className="num">
                  {fmtPct(r.percentage)}
                </td>
                <td data-label="Mediana pobytu (dni)" className="num">
                  {fmt(r["duration-of-hospitalization-mediana"])}
                </td>
                <td data-label="Dominanta pobytu (dni)" className="num">
                  {r["duration-of-hospitalization-mode"]
                    ? fmt(r["duration-of-hospitalization-mode"])
                    : "–"}
                </td>
                {hasValues && (
                  <td data-label="Śr. wartość hosp. (zł)" className="num">
                    {fmt(r["average-value-of-hospitalization"], 2)}
                  </td>
                )}
                {hasValues && (
                  <td data-label="Śr. wartość grupy (zł)" className="num">
                    {fmt(r["average-value-of-drg"], 2)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
