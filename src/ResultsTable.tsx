import { useState } from "react";
import type { TerminRecord, SearchFilters } from "./types";
import { capitalizeWords, formatProviderDisplayName } from "./textFormat";
import { useT } from "./lang/LangContext";

interface ResultsTableProps {
  results: TerminRecord[];
  loading: boolean;
  filters: SearchFilters;
  hasMoreApi?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
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
  hasMoreApi = false,
  loadingMore = false,
  onLoadMore,
}: ResultsTableProps) => {
  const [copied, setCopied] = useState(false);
  const t = useT();

  const handleCopy = () => {
    navigator.clipboard.writeText(buildShareUrl(filters)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="results-info">
        <span className="spinner" />
        {t.loading}
      </div>
    );
  }

  if (results.length === 0) {
    return <div className="results-info">{t.noResults}</div>;
  }

  const displayServiceName = capitalizeWords(results[0].sw);

  return (
    <div className="results">
      <div className="results-header">
        <button className="copy-btn" onClick={handleCopy} title={t.copyTitle}>
          {copied ? t.copiedBtn : t.copyBtn}
        </button>
        <p className="results-count">
          {t.resultsCount(results.length, displayServiceName)}
        </p>
      </div>

      {/* Desktop table */}
      <div className="table-wrapper desktop-only">
        <table>
          <thead>
            <tr>
              <th>{t.thCase}</th>
              <th>{t.thFacility}</th>
              <th>{t.thQueue}</th>
              <th>{t.thUnit}</th>
              <th>{t.thAddress}</th>
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
                    {r.kat === "PRZYPADEK PILNY" ? t.urgent : t.stable}
                  </td>
                  <td>
                    <a
                      className="facility-link"
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        `${formatProviderDisplayName(r.swiadczeniodawca)} ${capitalizeWords(r.miasto)}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatProviderDisplayName(r.swiadczeniodawca)}
                    </a>
                  </td>
                  <td className="termin">{t.queueDays(r.sredni_czas)}</td>
                  <td>
                    {capitalizeWords(r.komorka)}
                    {r.dzieci && (
                      <span className="badge-dzieci">{t.children}</span>
                    )}
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
                <span>{t.queueDays(r.sredni_czas)}</span>
                <span
                  className={`card-badge ${
                    r.kat === "PRZYPADEK PILNY" ? "pilny" : "stabilny"
                  }`}
                >
                  {r.kat === "PRZYPADEK PILNY" ? t.urgent : t.stable}
                </span>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="card-label">{t.thFacility}</span>
                  <span>
                    <a
                      className="facility-link"
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        `${formatProviderDisplayName(r.swiadczeniodawca)} ${capitalizeWords(r.miasto)}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatProviderDisplayName(r.swiadczeniodawca)}
                    </a>
                  </span>
                </div>
                <div className="card-row">
                  <span className="card-label">{t.thUnit}</span>
                  <span>
                    {capitalizeWords(r.komorka)}
                    {r.dzieci && (
                      <span className="badge-dzieci">{t.children}</span>
                    )}
                  </span>
                </div>
                <div className="card-row">
                  <span className="card-label">{t.thAddress}</span>
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
                    <span className="card-label">{t.phone}</span>
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

      {(hasMoreApi || loadingMore) && (
        <div className="pagination">
          <button
            className="page-btn load-more-btn"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <span className="spinner" />
                {t.loadingMore}
              </>
            ) : (
              t.loadMore
            )}
          </button>
        </div>
      )}
    </div>
  );
};
