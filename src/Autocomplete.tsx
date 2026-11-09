import { useState, useRef, useEffect, useId, type ReactNode } from "react";
import { useT } from "./lang/LangContext";

interface AutocompleteProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: ReactNode;
  required?: boolean;
  displayTransform?: (s: string) => string;
}

export default function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "",
  label,
  required = false,
  displayTransform,
}: AutocompleteProps) {
  const t = useT();
  const id = useId();
  const listId = `${id}-list`;
  const display = displayTransform || ((s: string) => s);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const skipValueSyncRef = useRef(false);

  useEffect(() => {
    if (skipValueSyncRef.current) {
      skipValueSyncRef.current = false;
      return;
    }
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
  const visibleOptions = filtered.slice(0, 100);
  const expanded = open && visibleOptions.length > 0;
  const activeOption = expanded ? visibleOptions[activeIndex] : undefined;

  useEffect(() => {
    if (expanded && activeOption) {
      listRef.current?.children[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex, activeOption, expanded]);

  const selectOption = (option: string) => {
    setInputValue(option);
    onChange(option);
    setActiveIndex(-1);
    setOpen(false);
  };

  return (
    <div
      className="autocomplete"
      ref={wrapperRef}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <label id={`${id}-label`} htmlFor={id}>
        {label}
      </label>
      <div className="autocomplete-input-wrap">
        <input
          id={id}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={
            activeOption ? `${id}-option-${activeIndex}` : undefined
          }
          aria-required={required || undefined}
          autoComplete="off"
          value={display(inputValue)}
          placeholder={placeholder}
          onChange={(e) => {
            setInputValue(e.target.value);
            setActiveIndex(-1);
            setOpen(true);
            if (value) {
              skipValueSyncRef.current = true;
              onChange("");
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (
              (e.key === "ArrowDown" || e.key === "ArrowUp") &&
              visibleOptions.length
            ) {
              e.preventDefault();
              setOpen(true);
              setActiveIndex((current) => {
                if (!expanded || current < 0) {
                  return e.key === "ArrowDown" ? 0 : visibleOptions.length - 1;
                }
                return e.key === "ArrowDown"
                  ? Math.min(current + 1, visibleOptions.length - 1)
                  : Math.max(current - 1, 0);
              });
            } else if (e.key === "Enter" && activeOption) {
              e.preventDefault();
              selectOption(activeOption);
            } else if (e.key === "Escape" && open) {
              e.preventDefault();
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
        />
        {inputValue && (
          <button
            type="button"
            className="autocomplete-clear"
            onClick={() => {
              setInputValue("");
              onChange("");
              setActiveIndex(-1);
              setOpen(false);
            }}
            aria-label={t.clearField}
          >
            ×
          </button>
        )}
        <button
          type="button"
          className="autocomplete-toggle"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            inputRef.current?.focus();
            setActiveIndex(-1);
            setOpen(!open);
          }}
          aria-label={t.toggleSuggestions}
          tabIndex={-1}
        >
          ▼
        </button>
      </div>
      {expanded && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="autocomplete-list"
        >
          {visibleOptions.map((opt, index) => (
            <li
              key={opt}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={
                index === activeIndex || (activeIndex < 0 && opt === value)
              }
              className={
                index === activeIndex
                  ? "active"
                  : activeIndex < 0 && opt === value
                    ? "selected"
                    : ""
              }
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectOption(opt)}
            >
              {display(opt)}
            </li>
          ))}
          {filtered.length > 100 && (
            <li className="more" role="presentation">
              {t.moreSuggestions(filtered.length - 100)}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
