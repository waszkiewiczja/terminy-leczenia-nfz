import { useState, useRef, useEffect } from "react";
import { searchBenefits, type Benefit } from "../api/nfzStatApi";

interface BenefitSearchProps {
  onSelect: (b: Benefit) => void;
}

export function BenefitSearch({ onSelect }: BenefitSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Benefit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

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
