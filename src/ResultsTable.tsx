import { useState } from "react";
import type { TerminRecord, SearchFilters } from "./types";
import { capitalizeWords, formatProviderDisplayName } from "./textFormat";

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
  filters: SearchFilters;
}

function buildShareUrl(filters: SearchFilters): string {
  const p = new URLSearchParams();
  if (filters.swiadczenie) p.set("s", filters.swiadczenie);
  filters.wojewodztwo.forEach((w) => p.append("w", w));
  if (filters.miejscowosc) p.set("m", filters.miejscowosc);
  if (filters.szpital) p.set("p", filters.szpital);
  if (filters.dzieci) p.set("d", "1");
  const base = window.location.origin + window.location.pathname;
  return `${base}?${p.toString()}`;
}

export const ResultsTable = ({
  results,
  loading,
  filters,
}: ResultsTableProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(buildShareUrl(filters)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

  const displayServiceName = capitalizeWords(results[0].sw);

  return (
    <div className="results">
      <div className="results-header">
        <button
          className="copy-btn"
          onClick={handleCopy}
          title="Kopiuj wyniki do schowka"
        >
          {copied ? "Skopiowano!" : "Kopiuj"}
        </button>
        <p className="results-count">
          Znaleziono: {results.length} wyników - {displayServiceName}
        </p>
      </div>

      {/* Desktop table */}
      <div className="table-wrapper desktop-only">
        <table>
          <thead>
            <tr>
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
                  <td
                    className={
                      r.kat === "PRZYPADEK PILNY" ? "pilny" : "stabilny"
                    }
                  >
                    {r.kat === "PRZYPADEK PILNY" ? "Pilny" : "Stabilny"}
                  </td>
                  <td>{formatProviderDisplayName(r.swiadczeniodawca)}</td>
                  <td className="termin">
                    {r.termin ? formatDisplayDate(r.termin) : "—"}
                  </td>
                  <td>
                    {capitalizeWords(r.komorka)}
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
                      {capitalizeWords(r.miasto)}
                      {ulica ? `, ${capitalizeWords(ulica)}` : ""}
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
              <div className="card-termin">
                <span>{r.termin ? formatDisplayDate(r.termin) : "—"}</span>
                <span
                  className={`card-badge ${
                    r.kat === "PRZYPADEK PILNY" ? "pilny" : "stabilny"
                  }`}
                >
                  {r.kat === "PRZYPADEK PILNY" ? "Pilny" : "Stabilny"}
                </span>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="card-label">Placówka</span>
                  <span>{formatProviderDisplayName(r.swiadczeniodawca)}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Komórka</span>
                  <span>
                    {capitalizeWords(r.komorka)}
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
                      {capitalizeWords(r.miasto)}
                      {ulica ? `, ${capitalizeWords(ulica)}` : ""}
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
};
