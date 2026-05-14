import type { Meta, SearchFilters } from "./types";
import Autocomplete from "./Autocomplete";
import { capitalizeWords, formatProviderDisplayName } from "./textFormat";
import { useT } from "./lang/LangContext";

interface SearchFormProps {
  meta: Meta;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading: boolean;
}

export const SearchForm = ({
  meta,
  filters,
  onFiltersChange,
  onSearch,
  loading,
}: SearchFormProps) => {
  const t = useT();
  const update = (patch: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const cities =
    filters.wojewodztwo.length > 0
      ? [
          ...new Set(filters.wojewodztwo.flatMap((w) => meta.cities[w] || [])),
        ].sort()
      : meta.allCities;

  const providersList =
    filters.wojewodztwo.length > 0
      ? [
          ...new Set(
            filters.wojewodztwo.flatMap((w) => meta.providers[w] || []),
          ),
        ].sort()
      : meta.allProviders;

  return (
    <form
      className="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <div className="form-row">
        <div className="form-group">
          <label>
            {t.labelWojewodztwo}
            <span className="required-asterisk"> *</span>
          </label>
          <div className="woj-checkboxes">
            {meta.wojewodztwa.map((w) => (
              <label key={w} className="woj-checkbox">
                <input
                  type="checkbox"
                  checked={filters.wojewodztwo.includes(w)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...filters.wojewodztwo, w]
                      : filters.wojewodztwo.filter((v) => v !== w);
                    update({ wojewodztwo: next, miejscowosc: "" });
                  }}
                />
                {capitalizeWords(w)}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="form-row">
        <Autocomplete
          label={
            <>
              {t.labelSwiadczenie}
              <span className="required-asterisk"> *</span>
            </>
          }
          options={meta.services}
          value={filters.swiadczenie}
          onChange={(v) => update({ swiadczenie: v })}
          placeholder={t.placeholder}
          displayTransform={capitalizeWords}
        />
      </div>

      <div className="form-row">
        <Autocomplete
          label={t.labelMiejscowosc}
          options={cities}
          value={filters.miejscowosc}
          onChange={(v) => update({ miejscowosc: v })}
          placeholder={t.placeholder}
          displayTransform={capitalizeWords}
        />
      </div>

      <div className="form-row">
        <Autocomplete
          label={t.labelPlacowka}
          options={providersList}
          value={filters.szpital}
          onChange={(v) => update({ szpital: v })}
          placeholder={t.placeholder}
          displayTransform={formatProviderDisplayName}
        />
      </div>

      <div className="form-row">
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={filters.dzieci}
              onChange={(e) => update({ dzieci: e.target.checked })}
            />
            {t.labelDzieci}
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="btn-search"
        disabled={loading || !filters.swiadczenie}
      >
        {loading ? t.btnSearching : t.btnSearch}
      </button>
    </form>
  );
};
