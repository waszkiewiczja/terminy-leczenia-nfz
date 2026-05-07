import { useState, useEffect, useCallback } from "react";
import type { Meta, TerminRecord, SearchFilters } from "./types";
import { AppTitle } from "./AppTitle";
import { InfoModal } from "./InfoModal";
import { SearchForm } from "./SearchForm";
import { ResultsTable } from "./ResultsTable";
import "./App.css";

const EMPTY_FILTERS: SearchFilters = {
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
      <AppTitle />
      <InfoModal />
      <SearchForm
        meta={meta}
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={search}
        loading={loading}
      />
      {searched && <ResultsTable results={results} loading={loading} />}
    </div>
  );
}

export default App;
