import { useState, useEffect, useCallback, useRef } from "react";
import type { Meta, TerminRecord, SearchFilters, QueueEntry } from "./types";
import { AppTitle } from "./AppTitle";
import { Footer } from "./Footer";
import { SearchForm } from "./SearchForm";
import { ResultsTable } from "./ResultsTable";
import { mapQueueToRecord } from "./functions/mapQueueToRecord";
import { filtersFromParams } from "./functions/filtersFromParams";
import { fetchQueues, getProvinceCode } from "./api/nfzApi";
import metaJson from "../public/dane/meta.json";
import "./App.css";

const EMPTY_FILTERS: SearchFilters = {
  dzieci: false,
  swiadczenie: "",
  wojewodztwo: [],
  miejscowosc: "",
  szpital: "",
};

const meta: Meta = metaJson;

function App() {
  const [filters, setFilters] = useState<SearchFilters>(
    () => filtersFromParams() ?? EMPTY_FILTERS,
  );
  const [results, setResults] = useState<TerminRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const autoSearchDone = useRef(false);

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);

    const regions =
      filters.wojewodztwo.length > 0 ? filters.wojewodztwo : meta.wojewodztwa;

    const today = new Date().toISOString().slice(0, 10);

    // For each province, fetch both case=1 (stabilny) and case=2 (pilny) in parallel
    const fetches = regions.flatMap((woj) => {
      const code = getProvinceCode(woj);
      if (!code) return [];
      return [1, 2].map((caseType) =>
        fetchQueues({
          caseType,
          province: code,
          benefit: filters.swiadczenie,
          locality: filters.miejscowosc || undefined,
          provider: filters.szpital || undefined,
        }).catch(() => [] as QueueEntry[]),
      );
    });

    const fetchResults = await Promise.all(fetches);

    const allResults: TerminRecord[] = [];
    for (const entries of fetchResults) {
      for (const entry of entries) {
        const record = mapQueueToRecord(entry);
        if (
          record.termin &&
          record.termin < today &&
          /^\d{4}-\d{2}-\d{2}$/.test(record.termin)
        )
          continue;
        if (filters.dzieci && !record.dzieci) continue;
        allResults.push(record);
      }
    }

    allResults.sort((a, b) => {
      const da = a.termin || "\uffff";
      const db = b.termin || "\uffff";
      return da.localeCompare(db);
    });

    setResults(allResults);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    if (filtersFromParams() && !autoSearchDone.current) {
      autoSearchDone.current = true;
      search();
    }
  }, [search]);

  return (
    <div className="app">
      <AppTitle />
      <SearchForm
        meta={meta}
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={search}
        loading={loading}
      />
      {searched && (
        <ResultsTable results={results} loading={loading} filters={filters} />
      )}
      <Footer />
    </div>
  );
}

export default App;
