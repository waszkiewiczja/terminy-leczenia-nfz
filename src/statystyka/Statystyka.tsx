import { useState, useCallback, useEffect } from "react";
import {
  fetchIndexOfTables,
  type Benefit,
  type IndexYear,
} from "../api/nfzStatApi";
import { BenefitSearch } from "./BenefitSearch";
import { YearView } from "./YearView";
import "./Statystyka.css";

export function Statystyka() {
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [years, setYears] = useState<IndexYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(false);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadBenefit = useCallback(
    async (b: Benefit, preferredYear?: number) => {
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
        const productName = entries[0].attributes["product-name"];
        if (productName) {
          setSelectedBenefit({ code: b.code, name: productName });
        }
        const allYears = entries.flatMap((e) => e.attributes.years ?? []);
        allYears.sort((a, z) => z.year - a.year);
        setYears(allYears);
        if (!allYears.length) return;
        if (
          preferredYear &&
          allYears.some((candidateYear) => candidateYear.year === preferredYear)
        ) {
          setSelectedYear(preferredYear);
        } else {
          setSelectedYear(allYears[0].year);
        }
      } catch (e) {
        setIndexError(
          e instanceof Error ? e.message : "Błąd pobierania indeksu tabel",
        );
      } finally {
        setLoadingIndex(false);
      }
    },
    [],
  );

  const handleSelectBenefit = useCallback(
    async (b: Benefit) => {
      await loadBenefit(b);
    },
    [loadBenefit],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const benefitCode = params.get("b");
    const yearParam = params.get("y");
    const preferredYear = yearParam
      ? Number.parseInt(yearParam, 10)
      : undefined;

    if (!benefitCode) return;

    void loadBenefit(
      { code: benefitCode, name: benefitCode },
      Number.isFinite(preferredYear) ? preferredYear : undefined,
    );
  }, [loadBenefit]);

  const handleCopy = () => {
    if (!selectedBenefit) return;
    const params = new URLSearchParams();
    params.set("b", selectedBenefit.code);
    if (selectedYear) params.set("y", String(selectedYear));
    const base = window.location.origin + window.location.pathname;

    navigator.clipboard.writeText(`${base}?${params.toString()}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentYearData = years.find((y) => y.year === selectedYear);

  return (
    <div className="app">
      <div className="stat-page">
        <div className="stat-intro">
          <h2 className="stat-page-title">Statystyki świadczeń NFZ</h2>
          <p className="stat-page-desc">
            Przeglądaj dane statystyczne dotyczące hospitalizacji. Liczbę
            pacjentów, strukturę według płci, wieku, trybu przyjęcia, rozpoznań
            ICD-10.
          </p>
        </div>

        <div className="stat-search-box">
          <BenefitSearch onSelect={handleSelectBenefit} />
        </div>

        {selectedBenefit && (
          <div className="stat-benefit-actions">
            <div className="stat-benefit-badge">
              <span className="badge-code">{selectedBenefit.code}</span>
              <span className="badge-name">{selectedBenefit.name}</span>
            </div>
            <button
              className="copy-btn"
              onClick={handleCopy}
              title="Kopiuj link do aktualnych statystyk"
            >
              {copied ? "Skopiowano" : "Kopiuj"}
            </button>
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
    </div>
  );
}
