import { useState, useEffect, useCallback, useRef } from "react";
import type { Meta, TerminRecord, SearchFilters } from "./types";
import { AppTitle } from "./AppTitle";
import { Footer } from "./Footer";
import { SearchForm } from "./SearchForm";
import { ResultsTable } from "./ResultsTable";
import { mapQueueToRecord } from "./functions/mapQueueToRecord";
import { filtersFromParams } from "./functions/filtersFromParams";
import { fetchQueuesPage, getProvinceCode } from "./api/nfzApi";
import type { FetchQueuesParams } from "./api/nfzApi";
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

type ComboState = { params: FetchQueuesParams; page: number; hasMore: boolean };

function buildCombos(filters: SearchFilters): FetchQueuesParams[] {
  const regions =
    filters.wojewodztwo.length > 0 ? filters.wojewodztwo : meta.wojewodztwa;
  const result: FetchQueuesParams[] = [];
  for (const woj of regions) {
    const code = getProvinceCode(woj);
    if (!code) continue;
    for (const caseType of [1, 2]) {
      result.push({
        caseType,
        province: code,
        benefit: filters.swiadczenie,
        locality: filters.miejscowosc || undefined,
        provider: filters.szpital || undefined,
      });
    }
  }
  return result;
}

function sortResults(arr: TerminRecord[]): TerminRecord[] {
  return [...arr].sort((a, b) => {
    const queueA = a.kolejka ?? Number.POSITIVE_INFINITY;
    const queueB = b.kolejka ?? Number.POSITIVE_INFINITY;
    return queueA - queueB;
  });
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function setMetaTag(
  attr: "name" | "property",
  key: string,
  value: string,
): void {
  if (typeof document === "undefined") return;
  const selector = `meta[${attr}="${key}"]`;
  const tag = document.querySelector<HTMLMetaElement>(selector);
  if (tag) {
    tag.setAttribute("content", value);
  }
}

function App() {
  const [filters, setFilters] = useState<SearchFilters>(
    () => filtersFromParams() ?? EMPTY_FILTERS,
  );
  const [results, setResults] = useState<TerminRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreApi, setHasMoreApi] = useState(false);
  const [searched, setSearched] = useState(false);
  const autoSearchDone = useRef(false);
  const combosRef = useRef<ComboState[]>([]);

  function filterRecord(record: TerminRecord, f: SearchFilters): boolean {
    if (f.dzieci && !record.dzieci) return false;
    return true;
  }

  async function fetchPage(
    combos: ComboState[],
    f: SearchFilters,
  ): Promise<{ records: TerminRecord[]; updatedCombos: ComboState[] }> {
    const fetches = combos
      .filter((c) => c.hasMore)
      .map((c) =>
        fetchQueuesPage(c.params, c.page)
          .then((res) => ({ combo: c, res }))
          .catch(() => ({ combo: c, res: { entries: [], hasMore: false } })),
      );

    const settled = await Promise.all(fetches);
    const records: TerminRecord[] = [];

    const updatedCombos = combos.map((c) => {
      const found = settled.find((s) => s.combo === c);
      if (!found) return c;
      for (const entry of found.res.entries) {
        const record = mapQueueToRecord(entry);
        if (filterRecord(record, f)) records.push(record);
      }
      return { ...c, page: c.page + 1, hasMore: found.res.hasMore };
    });

    return { records, updatedCombos };
  }

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    setResults([]);
    setHasMoreApi(false);

    const initialCombos: ComboState[] = buildCombos(filters).map((params) => ({
      params,
      page: 1,
      hasMore: true,
    }));

    const { records, updatedCombos } = await fetchPage(initialCombos, filters);
    combosRef.current = updatedCombos;

    setResults(sortResults(records));
    setHasMoreApi(updatedCombos.some((c) => c.hasMore));
    setLoading(false);
  }, [filters]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    const { records, updatedCombos } = await fetchPage(
      combosRef.current,
      filters,
    );
    combosRef.current = updatedCombos;
    setResults((prev) => sortResults([...prev, ...records]));
    setHasMoreApi(updatedCombos.some((c) => c.hasMore));
    setLoadingMore(false);
  }, [filters]);

  useEffect(() => {
    if (filtersFromParams() && !autoSearchDone.current) {
      autoSearchDone.current = true;
      search();
    }
  }, [search]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const service = params.get("s")?.trim() ?? "";
    const province = params.get("w")?.trim() ?? "";

    if (!service) return;

    const parts = [toTitleCase(service)];
    if (province) parts.push(toTitleCase(province));

    const dynamicTitle = `${parts.join(" ")} - Terminy Leczenia NFZ`;
    document.title = dynamicTitle;

    setMetaTag("property", "og:title", dynamicTitle);
    setMetaTag("name", "twitter:title", dynamicTitle);
  }, []);

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
        <ResultsTable
          results={results}
          loading={loading}
          filters={filters}
          hasMoreApi={hasMoreApi}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
