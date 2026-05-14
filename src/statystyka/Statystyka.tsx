import { useState, useCallback, useRef, useEffect } from "react";
import {
  searchBenefits,
  fetchIndexOfTables,
  fetchTableData,
  fetchTotalBenefitsCount,
  type Benefit,
  type IndexYear,
  type Table,
  type BasicDataEntry,
  type GenderEntry,
  type AdmissionEntry,
  type DischargeEntry,
  type AgeEntry,
  type ProcedureEntry,
  type DiseaseEntry,
  type HealthcareServiceEntry,
  type ProductCategoryEntry,
} from "../nfzStatApi";
import { AppTitle } from "../AppTitle";
import { Footer } from "../Footer";
import "./Statystyka.css";

type TableData =
  | BasicDataEntry
  | GenderEntry
  | AdmissionEntry
  | DischargeEntry
  | AgeEntry
  | ProcedureEntry
  | DiseaseEntry
  | HealthcareServiceEntry
  | ProductCategoryEntry;

function fmt(n: number | undefined | null, decimals = 0): string {
  if (n == null) return "–";
  return n.toLocaleString("pl-PL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtPct(n: number | undefined | null): string {
  if (n == null) return "–";
  return (
    n.toLocaleString("pl-PL", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + "%"
  );
}

// ─── Benefit Search ─────────────────────────────────────────────────────────

interface BenefitSearchProps {
  onSelect: (b: Benefit) => void;
}

function BenefitSearch({ onSelect }: BenefitSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Benefit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTotalBenefitsCount()
      .then(setTotalCount)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setSearchError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setSearchError(null);
      try {
        const results = await searchBenefits(value);
        setSuggestions(results);
        setOpen(results.length > 0);
        if (results.length === 0) setSearchError(null);
      } catch (e) {
        setSuggestions([]);
        setSearchError(e instanceof Error ? e.message : "Błąd wyszukiwania");
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  const handleSelect = (b: Benefit) => {
    setQuery(b.name);
    setOpen(false);
    onSelect(b);
  };

  return (
    <div className="benefit-search" ref={wrapRef}>
      <label className="benefit-search-label" htmlFor="benefit-input">
        Wyszukaj świadczenie (JGP, kod lub nazwa)
        {totalCount !== null && (
          <span className="benefit-search-count">
            {totalCount.toLocaleString("pl-PL")} świadczeń w bazie
          </span>
        )}
      </label>
      <div className="benefit-search-input-wrap">
        <input
          id="benefit-input"
          type="text"
          className="benefit-search-input"
          value={query}
          placeholder="np. udar mózgu, A48, endoproteza..."
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        {loading && <span className="benefit-search-spinner" />}
      </div>
      {open && (
        <ul className="benefit-search-dropdown">
          {suggestions.map((b) => (
            <li
              key={b.code}
              className="benefit-search-option"
              onMouseDown={() => handleSelect(b)}
            >
              <span className="benefit-code">{b.code}</span>
              <span className="benefit-name">{b.name}</span>
            </li>
          ))}
        </ul>
      )}
      {searchError && <div className="benefit-search-error">{searchError}</div>}
    </div>
  );
}

// ─── Table renderers ─────────────────────────────────────────────────────────

function BasicDataTable({ entry }: { entry: BasicDataEntry }) {
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
                {hasBranch && <td>{r.branch ?? "–"}</td>}
                {hasHospitalTypes && <td>{r["hospital-types"] ?? "–"}</td>}
                <td className="num">{fmt(r["number-of-patients"])}</td>
                <td className="num">{fmt(r["number-of-hospitalizations"])}</td>
                <td className="num">
                  {fmt(r["ratio-of-rehospitalizations"], 2)}
                </td>
                <td className="num">{fmtPct(r.percentage)}</td>
                <td className="num">
                  {fmt(r["duration-of-hospitalization-mediana"])}
                </td>
                <td className="num">
                  {r["duration-of-hospitalization-mode"]
                    ? fmt(r["duration-of-hospitalization-mode"])
                    : "–"}
                </td>
                {hasValues && (
                  <td className="num">
                    {fmt(r["average-value-of-hospitalization"], 2)}
                  </td>
                )}
                {hasValues && (
                  <td className="num">{fmt(r["average-value-of-drg"], 2)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function GenderTable({ entry }: { entry: GenderEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Płeć</th>
              <th className="num">Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r["gender-name"]}</td>
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

function AdmissionTable({ entry }: { entry: AdmissionEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Tryb przyjęcia</th>
              <th className="num">Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r["type-of-admission-name"]}</td>
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

function DischargeTable({ entry }: { entry: DischargeEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Tryb wypisu</th>
              <th className="num">Hospitalizacje</th>
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

function AgeTable({ entry }: { entry: AgeEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Grupa wiekowa</th>
              <th className="num">Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r["age-group-name"]}</td>
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

function ProcedureTable({ entry }: { entry: ProcedureEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Kod ICD-9</th>
              <th>Procedura</th>
              <th className="num">Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <code>{r["procedure-code"]}</code>
                </td>
                <td>{r["procedure-name"]}</td>
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

function DiseaseTable({ entry }: { entry: DiseaseEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Kod ICD-10</th>
              <th>Rozpoznanie</th>
              <th className="num">Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <code>{r["disease-code"]}</code>
                </td>
                <td>{r["disease-name"]}</td>
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

function HealthcareServiceTable({ entry }: { entry: HealthcareServiceEntry }) {
  const a = entry.attributes;
  const rows = a.data ?? [];
  return (
    <>
      <div className="stat-table-scroll">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Zakres świadczeń</th>
              <th>Hospitalizacje</th>
              <th>Udział (%)</th>
              <th>Mediana pobytu (dni)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r["contract-product-name"]}</td>
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

function ProductCategoryTable({ entry }: { entry: ProductCategoryEntry }) {
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
                <td>{r["product-category-name"]}</td>
                <td className="num">{fmt(r["number-of-hospitalizations"])}</td>
                <td className="num">{fmtPct(r.percentage)}</td>
                <td className="num">
                  {fmt(r["duration-of-hospitalization-mediana"])}
                </td>
                <td className="num">{fmt(r.value, 2)}</td>
                <td className="num">{fmtPct(r["value-percentage"])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function renderTableData(resourceName: string, entries: TableData[]) {
  if (!entries.length) return <p className="stat-empty">Brak danych</p>;

  switch (resourceName) {
    case "basic-data":
      return entries.map((e, i) => (
        <BasicDataTable key={i} entry={e as BasicDataEntry} />
      ));
    case "hospitalizations-by-patient-gender":
      return entries.map((e, i) => (
        <GenderTable key={i} entry={e as GenderEntry} />
      ));
    case "hospitalizations-by-admission-type":
    case "hospitalizations-by-admission-type-nfz-categorized":
      return entries.map((e, i) => (
        <AdmissionTable key={i} entry={e as AdmissionEntry} />
      ));
    case "hospitalizations-by-discharge-type":
      return entries.map((e, i) => (
        <DischargeTable key={i} entry={e as DischargeEntry} />
      ));
    case "hospitalizations-by-patient-age":
      return entries.map((e, i) => <AgeTable key={i} entry={e as AgeEntry} />);
    case "icd9-procedures":
      return entries.map((e, i) => (
        <ProcedureTable key={i} entry={e as ProcedureEntry} />
      ));
    case "icd10-diseases":
      return entries.map((e, i) => (
        <DiseaseTable key={i} entry={e as DiseaseEntry} />
      ));
    case "hospitalizations-by-healthcare-service":
      return entries.map((e, i) => (
        <HealthcareServiceTable key={i} entry={e as HealthcareServiceEntry} />
      ));
    case "hospitalizations-by-product-category":
      return entries.map((e, i) => (
        <ProductCategoryTable key={i} entry={e as ProductCategoryEntry} />
      ));
    default:
      return <pre className="stat-raw">{JSON.stringify(entries, null, 2)}</pre>;
  }
}

// ─── Table panel ─────────────────────────────────────────────────────────────

interface TablePanelProps {
  table: Table;
}

const TABLE_TYPE_ORDER: Record<string, number> = {
  "basic-data": 0,
  "hospitalizations-by-patient-gender": 1,
  "hospitalizations-by-patient-age": 2,
};

function sortTables(tables: Table[]): Table[] {
  return [...tables].sort((a, b) => {
    const oa = TABLE_TYPE_ORDER[a.attributes["resource-name"]] ?? 99;
    const ob = TABLE_TYPE_ORDER[b.attributes["resource-name"]] ?? 99;
    return oa - ob;
  });
}

function TablePanel({ table }: TablePanelProps) {
  const [data, setData] = useState<TableData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const load = useCallback(async () => {
    if (data || loading) return;
    setLoading(true);
    setError(null);
    try {
      const resourceName = table.attributes["resource-name"];
      const result = await fetchTableData<TableData>(resourceName, table.id);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd pobierania danych");
    } finally {
      setLoading(false);
    }
  }, [table, data, loading]);

  useEffect(() => {
    load();
  }, []);

  const handleToggle = () => {
    setExpanded((x) => !x);
  };

  return (
    <div className={`table-panel ${expanded ? "expanded" : ""}`}>
      <button className="table-panel-toggle" onClick={handleToggle}>
        <span className="table-panel-title">{table.attributes.header}</span>
        <span className="table-panel-arrow">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div className="table-panel-body">
          {loading && <div className="stat-loading">Ładowanie danych…</div>}
          {error && <div className="stat-error">{error}</div>}
          {data && renderTableData(table.attributes["resource-name"], data)}
        </div>
      )}
    </div>
  );
}

// ─── Year + category view ─────────────────────────────────────────────────────

interface YearViewProps {
  yearData: IndexYear;
}

function YearView({ yearData }: YearViewProps) {
  const allTables = sortTables([
    ...(yearData.tables ?? []),
    ...(yearData.periods?.flatMap((p) => p.tables ?? []) ?? []),
  ]);

  return (
    <div className="year-view">
      {allTables.map((t) => (
        <TablePanel key={t.id} table={t} />
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function Statystyka() {
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [years, setYears] = useState<IndexYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(false);
  const [indexError, setIndexError] = useState<string | null>(null);

  const handleSelectBenefit = useCallback(async (b: Benefit) => {
    setSelectedBenefit(b);
    setYears([]);
    setSelectedYear(null);
    setIndexError(null);
    setLoadingIndex(true);
    try {
      const entries = await fetchIndexOfTables(b.code);
      if (!entries.length) {
        setIndexError(
          "Nie znaleziono danych statystycznych dla tego świadczenia.",
        );
        return;
      }
      const allYears = entries.flatMap((e) => e.attributes.years ?? []);
      allYears.sort((a, z) => z.year - a.year);
      setYears(allYears);
      if (allYears.length) setSelectedYear(allYears[0].year);
    } catch (e) {
      setIndexError(
        e instanceof Error ? e.message : "Błąd pobierania indeksu tabel",
      );
    } finally {
      setLoadingIndex(false);
    }
  }, []);

  const currentYearData = years.find((y) => y.year === selectedYear);

  return (
    <div className="app">
      <AppTitle />

      <div className="stat-page">
        <div className="stat-intro">
          <h2 className="stat-page-title">Statystyki świadczeń NFZ</h2>
          <p className="stat-page-desc">
            Przeglądaj dane statystyczne dotyczące hospitalizacji — liczbę
            pacjentów, strukturę według płci, wieku, trybu przyjęcia, rozpoznań
            ICD-10, procedur ICD-9 i wartości finansowych świadczeń.
          </p>
        </div>

        <div className="stat-search-box">
          <BenefitSearch onSelect={handleSelectBenefit} />
        </div>

        {selectedBenefit && (
          <div className="stat-benefit-badge">
            <span className="badge-code">{selectedBenefit.code}</span>
            <span className="badge-name">{selectedBenefit.name}</span>
          </div>
        )}

        {loadingIndex && (
          <div className="stat-loading">
            Pobieranie dostępnych tabel statystycznych…
          </div>
        )}

        {indexError && <div className="stat-error">{indexError}</div>}

        {years.length > 0 && (
          <>
            <div className="year-selector">
              <label className="year-selector-label">Rok:</label>
              <div className="year-buttons">
                {years.slice(0, 3).map((y) => (
                  <button
                    key={y.year}
                    className={`year-btn ${selectedYear === y.year ? "active" : ""}`}
                    onClick={() => setSelectedYear(y.year)}
                  >
                    {y.year}
                  </button>
                ))}
              </div>
            </div>

            {currentYearData && <YearView yearData={currentYearData} />}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
