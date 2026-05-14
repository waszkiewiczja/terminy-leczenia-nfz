import { fmt } from "./fmt";
import { fmtPct } from "./fmtPct";
import type { ProductCategoryEntry } from "../api/nfzStatApi";

export function ProductCategoryTable({
  entry,
}: {
  entry: ProductCategoryEntry;
}) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Kategoria produktu</th>
              <th>Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
              <th>Wartość (zł)</th>
              <th>Udział wartości (%)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td data-label="Kategoria produktu">
                  {r["product-category-name"]}
                </td>
                <td data-label="Hospitalizacje" className="num">
                  {fmt(r["number-of-hospitalizations"])}
                </td>
                <td data-label="Udział (%)" className="num">
                  {fmtPct(r.percentage)}
                </td>
                <td data-label="Mediana pobytu (dni)" className="num">
                  {fmt(r["duration-of-hospitalization-mediana"])}
                </td>
                <td data-label="Wartość (zł)" className="num">
                  {fmt(r.value, 2)}
                </td>
                <td data-label="Udział wartości (%)" className="num">
                  {fmtPct(r["value-percentage"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
