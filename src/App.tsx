import { useState, useEffect, useCallback } from "react";
import type { Meta, TerminRecord, SearchFilters } from "./types";
import SearchForm from "./SearchForm";
import ResultsTable from "./ResultsTable";
import "./App.css";

const EMPTY_FILTERS: SearchFilters = {
  przypadek: "PRZYPADEK STABILNY",
  dzieci: false,
  swiadczenie: "",
  wojewodztwo: [],
  miejscowosc: "",
  szpital: "",
};

function App() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [results, setResults] = useState<TerminRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}dane/meta.json`)
      .then((r) => r.json())
      .then(setMeta);
  }, []);

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);

    const regions =
      filters.wojewodztwo.length > 0
        ? filters.wojewodztwo
        : (meta?.wojewodztwa ?? []);

    const allResults: TerminRecord[] = [];

    const today = new Date().toISOString().slice(0, 10);

    for (const woj of regions) {
      const res = await fetch(
        `${import.meta.env.BASE_URL}dane/${encodeURIComponent(woj)}.json`,
      );
      const data: TerminRecord[] = await res.json();

      for (const row of data) {
        if (
          row.termin &&
          row.termin < today &&
          /^\d{4}-\d{2}-\d{2}$/.test(row.termin)
        )
          continue;
        if (filters.dzieci && !row.dzieci) continue;
        if (
          filters.swiadczenie &&
          !row.sw.toLowerCase().includes(filters.swiadczenie.toLowerCase())
        )
          continue;
        if (
          filters.miejscowosc &&
          row.miasto.toLowerCase() !== filters.miejscowosc.toLowerCase()
        )
          continue;
        if (
          filters.szpital &&
          !row.swiadczeniodawca
            .toLowerCase()
            .includes(filters.szpital.toLowerCase())
        )
          continue;
        allResults.push(row);
      }
    }

    allResults.sort((a, b) => {
      const da = a.termin || "\uffff";
      const db = b.termin || "\uffff";
      return da.localeCompare(db);
    });

    setResults(allResults);
    setLoading(false);
  }, [filters, meta]);

  if (!meta) {
    return <div className="app-loading">Ładowanie...</div>;
  }

  return (
    <div className="app">
      <h1>Wyszukiwarka Terminów Leczenia NFZ</h1>
      <SearchForm
        meta={meta}
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={search}
        loading={loading}
      />
      {searched && <ResultsTable results={results} loading={loading} />}

      <button className="info-trigger" onClick={() => setShowInfo(true)}>
        info.
      </button>

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>
              ×
            </button>
            <article>
              <h2>Terminy leczenia NFZ — aktualne dane</h2>
              <p>
                Serwis <strong>terminy leczenia NFZ</strong> umożliwia szybkie
                wyszukiwanie dostępnych terminów wizyt i zabiegów w ramach
                Narodowego Funduszu Zdrowia. Dane są pobierane bezpośrednio ze
                strony NFZ i aktualizowane codziennie.
              </p>
              <p>
                Dzięki naszej wyszukiwarce{" "}
                <strong>terminów leczenia NFZ</strong> możesz porównać czasy
                oczekiwania na świadczenia medyczne w różnych placówkach i
                województwach. Znajdziesz tutaj informacje o pierwszych wolnych
                terminach u specjalistów, na zabiegi operacyjne, rehabilitację,
                diagnostykę i wiele innych.
              </p>
              <p>
                Sprawdź <strong>terminy leczenia NFZ</strong> w swoim regionie —
                wybierz województwo, rodzaj świadczenia lub konkretną placówkę.
                Wyszukiwarka obsługuje wszystkie 16 województw i ponad 470
                rodzajów świadczeń medycznych.
              </p>
              <p>
                Dane źródłowe pochodzą z oficjalnego portalu{" "}
                <em>Informator o terminach leczenia</em> prowadzonego przez
                Narodowy Fundusz Zdrowia.
              </p>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
