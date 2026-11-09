import { useState, useCallback, useEffect } from "react";
import {
  fetchIndexOfTables,
  type Benefit,
  type IndexYear,
} from "../api/nfzStatApi";
import { BenefitSearch } from "./BenefitSearch";
import { YearView } from "./YearView";
import { useT } from "../lang/LangContext";
import "./Statystyka.css";

export function Statystyka() {
  const t = useT();
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
          setIndexError(t.statNoData);
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
        setIndexError(e instanceof Error ? e.message : t.statIndexError);
      } finally {
        setLoadingIndex(false);
      }
    },
    [t],
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
    <main className="app">
      <div className="stat-page">
        <div className="stat-intro">
          <h1 className="stat-page-title">{t.statTitle}</h1>
          <p className="stat-page-desc">{t.statDesc}</p>
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
              title={t.statCopyTitle}
            >
              {copied ? t.statCopied : t.statCopy}
            </button>
          </div>
        )}

        {loadingIndex && (
          <div className="stat-loading">{t.statLoadingIndex}</div>
        )}

        {indexError && <div className="stat-error">{indexError}</div>}

        {years.length > 0 && (
          <>
            <div className="year-selector">
              <label className="year-selector-label">{t.statYear}</label>
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
    </main>
  );
}
