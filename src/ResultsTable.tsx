import type { TerminRecord } from "./types";

function capitalize(s: string) {
  return s
    .toLowerCase()
    .replace(/(^|[\s-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

function formatDisplayDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const [yyyy, mm, dd] = date.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

interface ResultsTableProps {
  results: TerminRecord[];
  loading: boolean;
}

export default function ResultsTable({ results, loading }: ResultsTableProps) {
  if (loading) {
    return <div className="results-info">Ładowanie danych...</div>;
  }

  if (results.length === 0) {
    return (
      <div className="results-info">
        Brak wyników. Zmień kryteria wyszukiwania.
      </div>
    );
  }

  return (
    <div className="results">
      <p className="results-count">Znaleziono: {results.length} wyników</p>

      {/* Desktop table */}
      <div className="table-wrapper desktop-only">
        <table>
          <thead>
            <tr>
              <th>Świadczenie</th>
              <th>Przypadek</th>
              <th>Placówka</th>
              <th>Pierwszy wolny termin</th>
              <th>Komórka</th>
              <th>Adres</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const parts = r.adres.split(";");
              const ulica = parts[1] || "";
              const telefon = parts[2] || "";
              return (
                <tr key={i}>
                  <td>{capitalize(r.sw)}</td>
                  <td
                    className={
                      r.kat === "PRZYPADEK PILNY" ? "pilny" : "stabilny"
                    }
                  >
                    {r.kat === "PRZYPADEK PILNY" ? "Pilny" : "Stabilny"}
                  </td>
                  <td>{r.swiadczeniodawca}</td>
                  <td className="termin">
                    {r.termin ? formatDisplayDate(r.termin) : "—"}
                  </td>
                  <td>
                    {capitalize(r.komorka)}
                    {r.dzieci && <span className="badge-dzieci">dzieci</span>}
                  </td>
                  <td>
                    <a
                      className="adres-link"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        r.miasto + (ulica ? ", " + ulica : ""),
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {capitalize(r.miasto)}
                      {ulica ? `, ${capitalize(ulica)}` : ""}
                    </a>
                    {telefon && (
                      <div className="telefon">
                        <a href={`tel:${telefon.replace(/\s/g, "")}`}>
                          {telefon}
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="cards-wrapper mobile-only">
        {results.map((r, i) => {
          const parts = r.adres.split(";");
          const ulica = parts[1] || "";
          const telefon = parts[2] || "";
          return (
            <div className="result-card" key={i}>
              <div className="card-header">
                <span className="card-service">{capitalize(r.sw)}</span>
                <span
                  className={`card-badge ${
                    r.kat === "PRZYPADEK PILNY" ? "pilny" : "stabilny"
                  }`}
                >
                  {r.kat === "PRZYPADEK PILNY" ? "Pilny" : "Stabilny"}
                </span>
              </div>
              <div className="card-termin">
                {r.termin ? formatDisplayDate(r.termin) : "—"}
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="card-label">Placówka</span>
                  <span>{r.swiadczeniodawca}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Komórka</span>
                  <span>
                    {capitalize(r.komorka)}
                    {r.dzieci && <span className="badge-dzieci">dzieci</span>}
                  </span>
                </div>
                <div className="card-row">
                  <span className="card-label">Adres</span>
                  <span>
                    <a
                      className="adres-link"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        r.miasto + (ulica ? ", " + ulica : ""),
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {capitalize(r.miasto)}
                      {ulica ? `, ${capitalize(ulica)}` : ""}
                    </a>
                  </span>
                </div>
                {telefon && (
                  <div className="card-row">
                    <span className="card-label">Telefon</span>
                    <span className="telefon">
                      <a href={`tel:${telefon.replace(/\s/g, "")}`}>
                        {telefon}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
