import { useState, useRef, useEffect, type ReactNode } from "react";

interface AutocompleteProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: ReactNode;
  displayTransform?: (s: string) => string;
}

export default function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "",
  label,
  displayTransform,
}: AutocompleteProps) {
  const display = displayTransform || ((s: string) => s);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = inputValue
    ? options.filter((o) => o.toLowerCase().includes(inputValue.toLowerCase()))
    : options;

  return (
    <div className="autocomplete" ref={wrapperRef}>
      <label>{label}</label>
      <div className="autocomplete-input-wrap">
        <input
          type="text"
          value={display(inputValue)}
          placeholder={placeholder}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
            if (e.target.value === "") {
              onChange("");
            }
          }}
          onFocus={() => setOpen(true)}
        />
        <button
          type="button"
          className="autocomplete-toggle"
          onClick={() => setOpen(!open)}
          tabIndex={-1}
        >
          ▼
        </button>
      </div>
      {open && filtered.length > 0 && (
        <ul className="autocomplete-list">
          {filtered.slice(0, 100).map((opt) => (
            <li
              key={opt}
              className={opt === value ? "selected" : ""}
              onClick={() => {
                setInputValue(opt);
                onChange(opt);
                setOpen(false);
              }}
            >
              {display(opt)}
            </li>
          ))}
          {filtered.length > 100 && (
            <li className="more">
              ...i {filtered.length - 100} więcej — wpisz więcej liter
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
