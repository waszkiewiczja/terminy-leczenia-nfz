import { useState, useCallback } from "react";
import {
  fetchIndexOfTables,
  type Benefit,
  type IndexYear,
} from "../api/nfzStatApi";
import { AppTitle } from "../AppTitle";
import { BenefitSearch } from "./BenefitSearch";
import { YearView } from "./YearView";
import "./Statystyka.css";

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
    </div>
  );
}
