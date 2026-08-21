import type { pl } from "./pl";

export const en: typeof pl = {
  // Nav
  navTerminy: "NFZ Treatment Dates",
  navStatystyki: "Statistics",
  langSwitch: "PL",

  // AppTitle
  appAlt: "Terminy leczenia NFZ",
  appH1: "Current NFZ Treatment Dates",
  appLead:
    "Check current NFZ treatment dates in Poland and find the nearest available appointment or procedure by service, province, city, or facility.",

  // SearchForm
  labelWojewodztwo: "Province",
  labelSwiadczenie: "What service are you looking for?",
  labelMiejscowosc: "City (optional)",
  labelPlacowka: "Facility (optional)",
  placeholder: "Type or select from list...",
  labelDzieci: "Services for children (optional)",
  btnSearch: "Search",
  btnSearching: "Searching...",

  // ResultsTable
  loading: "Loading...",
  noResults: "No results found. Try different search criteria.",
  copyBtn: "Copy",
  copiedBtn: "Copied!",
  copyTitle: "Copy results link",
  resultsCount: (n: number, name: string) => `Found: ${n} results – ${name}`,
  thCase: "Case",
  thFacility: "Facility",
  thQueue: "Queue",
  queueDays: (days: number) => (days === 1 ? "1 day" : `${days} days`),
  thUnit: "Unit",
  thAddress: "Address",
  urgent: "Urgent",
  stable: "Stable",
  children: "children",
  phone: "Phone",
  loadMore: "Load more results",
  loadingMore: "Loading...",
};
