import type { Meta, SearchFilters } from "./types";
import Autocomplete from "./Autocomplete";

interface SearchFormProps {
  meta: Meta;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading: boolean;
}

function capitalize(s: string) {
  return s
    .toLowerCase()
    .replace(
      /(^|[\s\-."'„”‚‘’])(\p{L})/gu,
      (_, sep, ch) => sep + ch.toUpperCase(),
    );
}

export default function SearchForm({
  meta,
  filters,
  onFiltersChange,
  onSearch,
  loading,
}: SearchFormProps) {
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
          <label>Województwo</label>
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
                {capitalize(w)}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="form-row">
        <Autocomplete
          label="Jakiego świadczenia szukasz?"
          options={meta.services}
          value={filters.swiadczenie}
          onChange={(v) => update({ swiadczenie: v })}
          placeholder="Wpisz lub wybierz z listy..."
          displayTransform={capitalize}
        />
      </div>

      <div className="form-row">
        <Autocomplete
          label="Miejscowość"
          options={cities}
          value={filters.miejscowosc}
          onChange={(v) => update({ miejscowosc: v })}
          placeholder="Wpisz lub wybierz z listy..."
          displayTransform={capitalize}
        />
      </div>

      <div className="form-row">
        <Autocomplete
          label="Placówka"
          options={providersList}
          value={filters.szpital}
          onChange={(v) => update({ szpital: v })}
          placeholder="Wpisz lub wybierz z listy..."
          displayTransform={capitalize}
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
            Świadczenia udzielane dzieciom
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="btn-search"
        disabled={loading || !filters.swiadczenie}
      >
        {loading ? "Szukam..." : "Szukaj"}
      </button>
    </form>
  );
}
