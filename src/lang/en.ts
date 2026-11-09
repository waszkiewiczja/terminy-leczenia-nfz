import type { pl } from "./pl";

export const en: typeof pl = {
  // Nav
  navTerminy: "NFZ Treatment Dates",
  navStatystyki: "Statistics",
  langSwitch: "PL",

  // AppTitle
  appAlt: "NFZ Treatment Dates logo",
  appH1: "Current NFZ Treatment Dates",
  appLead:
    "Check current NFZ treatment dates in Poland and find the nearest available appointment or procedure by service, province, city, or facility.",

  // SearchForm
  labelWojewodztwo: "Province",
  provinceLimitMessage: "You can select up to 5 provinces.",
  labelSwiadczenie: "What service are you looking for?",
  labelMiejscowosc: "City (optional)",
  labelPlacowka: "Facility (optional)",
  placeholder: "Type or select from list...",
  requiredField: "(required)",
  clearField: "Clear field",
  toggleSuggestions: "Show or hide suggestions",
  moreSuggestions: (n: number) => `...and ${n} more — type more letters`,
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

  // HomeContent (also used for FAQPage JSON-LD)
  homeHowTitle: "How to check NFZ treatment dates?",
  homeHowSteps: [
    "Select the province where you want to be treated. You can select up to 5 provinces at once.",
    "Type the name of the service, e.g. magnetic resonance imaging (rezonans magnetyczny), knee replacement (endoprotezoplastyka stawu kolanowego) or cardiology, and pick it from the suggestions.",
    "Optionally narrow the results down to a city, a specific facility or services for children.",
    "Click “Search”. Results are sorted from the shortest average waiting time and include the facility name, queue category, address and phone number.",
    "Call the selected facility to confirm the date and join the queue. Most services require a referral.",
  ],
  homeCaseTitle: "Urgent vs. stable case – what does it mean?",
  homeCaseParagraphs: [
    "Each result shows the medical category of the queue: urgent case or stable case. Facilities keep separate waiting lists for them, so the same clinic may have two different waiting times.",
    "An urgent case applies when a delay in treatment could lead to a rapid deterioration of health. Patients in this category get an appointment earlier than stable patients.",
    "A stable case covers all other situations where treatment can safely be scheduled for a later date. The category is based on medical criteria – the referring doctor may mark the referral as urgent, and the facility qualifies the patient at registration.",
  ],
  homeDataTitle: "Where does the data come from and how often is it updated?",
  homeDataParagraphs: [
    "Treatment dates come from official data of the National Health Fund (NFZ). Search results are fetched live from the public NFZ API (api.nfz.gov.pl) when you click “Search” – we neither store nor modify them.",
    "The lists of services, cities and facilities used in suggestions are updated automatically once a week based on files published by NFZ at terminyleczenia.nfz.gov.pl.",
    "Queue information is reported to NFZ by the facilities themselves, so waiting times may change. Always confirm the date by phone with the selected facility before your visit.",
  ],

  // Statystyka
  statTitle: "NFZ Service Statistics",
  statDesc:
    "Browse hospitalisation statistics: number of patients and breakdown by gender, age, admission mode and ICD-10 diagnoses.",
  statNoData: "No statistical data found for this service.",
  statIndexError: "Failed to load the table index",
  statCopyTitle: "Copy link to current statistics",
  statCopy: "Copy",
  statCopied: "Copied",
  statLoadingIndex: "Loading available statistical tables…",
  statYear: "Year:",
};
