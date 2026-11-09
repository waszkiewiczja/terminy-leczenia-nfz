import { useState, useRef, useEffect, useId } from "react";
import { searchBenefits, type Benefit } from "../api/nfzStatApi";

interface BenefitSearchProps {
  onSelect: (b: Benefit) => void;
}

export function BenefitSearch({ onSelect }: BenefitSearchProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const listId = `${id}-list`;
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Benefit[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);
  const allowOpenRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        allowOpenRef.current = false;
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    return () => {
      requestRef.current += 1;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const expanded = open && suggestions.length > 0;
  const activeOption = expanded ? suggestions[activeIndex] : undefined;

  useEffect(() => {
    if (expanded && activeOption) {
      listRef.current?.children[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex, activeOption, expanded]);

  const handleChange = (value: string) => {
    setQuery(value);
    setSearchError(null);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    setLoading(false);
    allowOpenRef.current = true;
    const request = ++requestRef.current;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = null;
    if (value.length < 2) {
      return;
    }
    debounceRef.current = setTimeout(async () => {
      debounceRef.current = null;
      setLoading(true);
      setSearchError(null);
      try {
        const results = await searchBenefits(value);
        if (request !== requestRef.current) return;
        setSuggestions(results);
        setOpen(allowOpenRef.current && results.length > 0);
        if (results.length === 0) setSearchError(null);
      } catch (e) {
        if (request !== requestRef.current) return;
        setSuggestions([]);
        setSearchError(e instanceof Error ? e.message : "Błąd wyszukiwania");
      } finally {
        if (request === requestRef.current) setLoading(false);
      }
    }, 350);
  };

  const handleSelect = (b: Benefit) => {
    requestRef.current += 1;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = null;
    allowOpenRef.current = false;
    setQuery(b.name);
    setOpen(false);
    setActiveIndex(-1);
    setSuggestions([]);
    setLoading(false);
    onSelect(b);
  };

  return (
    <div
      className="benefit-search"
      ref={wrapRef}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          allowOpenRef.current = false;
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <label
        id={`${id}-label`}
        className="benefit-search-label"
        htmlFor={inputId}
      >
        Wyszukaj świadczenie (JGP, kod lub nazwa)
      </label>
      <div className="benefit-search-input-wrap">
        <input
          id={inputId}
          type="text"
          className="benefit-search-input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={
            activeOption ? `${id}-option-${activeIndex}` : undefined
          }
          value={query}
          placeholder="np. udar mózgu, A48, endoproteza..."
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            allowOpenRef.current = true;
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (
              (e.key === "ArrowDown" || e.key === "ArrowUp") &&
              suggestions.length
            ) {
              e.preventDefault();
              allowOpenRef.current = true;
              setOpen(true);
              setActiveIndex((current) => {
                if (!expanded || current < 0) {
                  return e.key === "ArrowDown" ? 0 : suggestions.length - 1;
                }
                return e.key === "ArrowDown"
                  ? Math.min(current + 1, suggestions.length - 1)
                  : Math.max(current - 1, 0);
              });
            } else if (e.key === "Enter" && activeOption) {
              e.preventDefault();
              handleSelect(activeOption);
            } else if (
              e.key === "Escape" &&
              (open || loading || debounceRef.current)
            ) {
              e.preventDefault();
              allowOpenRef.current = false;
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
          autoComplete="off"
        />
        {loading && <span className="benefit-search-spinner" />}
      </div>
      {expanded && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="benefit-search-dropdown"
        >
          {suggestions.map((b, index) => (
            <li
              key={b.code}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`benefit-search-option${index === activeIndex ? " active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(b)}
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
