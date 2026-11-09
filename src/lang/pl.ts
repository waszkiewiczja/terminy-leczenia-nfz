export const pl = {
  // Nav
  navTerminy: "Terminy leczenia NFZ",
  navStatystyki: "Statystyki",
  langSwitch: "EN",

  // AppTitle
  appAlt: "Logo Terminy Leczenia NFZ",
  appH1: "Aktualne Terminy Leczenia NFZ",
  appLead:
    "Sprawdź aktualne terminy leczenia NFZ w Polsce i znajdź najbliższy wolny termin wizyty lub zabiegu według świadczenia, województwa, miasta czy placówki.",

  // SearchForm
  labelWojewodztwo: "Województwo",
  provinceLimitMessage: "Możesz wybrać maksymalnie 5 województw.",
  labelSwiadczenie: "Jakiego świadczenia szukasz?",
  labelMiejscowosc: "Miejscowość (opcjonalne)",
  labelPlacowka: "Placówka (opcjonalne)",
  placeholder: "Wpisz lub wybierz z listy...",
  requiredField: "(wymagane)",
  clearField: "Wyczyść pole",
  toggleSuggestions: "Pokaż lub ukryj podpowiedzi",
  moreSuggestions: (n: number) => `...i ${n} więcej — wpisz więcej liter`,
  labelDzieci: "Świadczenia udzielane dzieciom (opcjonalne)",
  btnSearch: "Szukaj",
  btnSearching: "Szukam...",

  // ResultsTable
  loading: "Ładowanie danych...",
  noResults: "Brak wyników. Zmień kryteria wyszukiwania.",
  copyBtn: "Kopiuj (udostępnij)",
  copiedBtn: "Skopiowano!",
  copyTitle: "Kopiuj wyszukiwanie",
  resultsCount: (n: number, name: string) =>
    `Znaleziono: ${n} wyników - ${name}`,
  thCase: "Przypadek",
  thFacility: "Placówka",
  thQueue: "Kolejka",
  queueDays: (days: number) => (days === 1 ? "1 dzień" : `${days} dni`),
  thUnit: "Komórka",
  thAddress: "Adres",
  urgent: "Pilny",
  stable: "Stabilny",
  children: "dzieci",
  phone: "Telefon",
  loadMore: "Załaduj więcej wyników",
  loadingMore: "Ładowanie...",

  // HomeContent (also used for FAQPage JSON-LD)
  homeHowTitle: "Jak sprawdzić terminy leczenia NFZ?",
  homeHowSteps: [
    "Zaznacz województwo, w którym chcesz się leczyć. Możesz wybrać maksymalnie 5 województw jednocześnie.",
    "Wpisz nazwę świadczenia, np. rezonans magnetyczny, endoprotezoplastyka stawu kolanowego lub świadczenia z zakresu kardiologii, i wybierz je z listy podpowiedzi.",
    "Opcjonalnie zawęź wyniki do miejscowości, konkretnej placówki lub świadczeń udzielanych dzieciom.",
    "Kliknij „Szukaj”. Wyniki są posortowane od najkrótszego średniego czasu oczekiwania i zawierają nazwę placówki, kategorię kolejki, adres oraz telefon.",
    "Zadzwoń do wybranej placówki, aby potwierdzić termin i zapisać się do kolejki. Na większość świadczeń potrzebne jest skierowanie.",
  ],
  homeCaseTitle: "Przypadek pilny a stabilny – co to znaczy?",
  homeCaseParagraphs: [
    "Przy każdym wyniku podajemy kategorię medyczną kolejki: przypadek pilny albo przypadek stabilny. Placówki prowadzą dla nich osobne listy oczekujących, dlatego ta sama poradnia może mieć dwa różne czasy oczekiwania.",
    "Przypadek pilny dotyczy sytuacji, w których zwłoka w leczeniu może doprowadzić do szybkiego pogorszenia stanu zdrowia. Pacjenci z tej kategorii otrzymują termin wcześniej niż pacjenci stabilni.",
    "Przypadek stabilny obejmuje pozostałe sytuacje, w których leczenie można bezpiecznie zaplanować w dłuższym terminie. O kategorii decyduje się na podstawie kryteriów medycznych – lekarz kierujący może oznaczyć skierowanie jako pilne, a placówka kwalifikuje pacjenta przy zapisie.",
  ],
  homeDataTitle: "Skąd pochodzą dane i jak często są aktualizowane?",
  homeDataParagraphs: [
    "Terminy leczenia pochodzą z oficjalnych danych Narodowego Funduszu Zdrowia. Wyniki wyszukiwania pobieramy na bieżąco z publicznego API NFZ (api.nfz.gov.pl) w chwili kliknięcia „Szukaj” – nie przechowujemy ich i nie modyfikujemy.",
    "Informacje o kolejkach przekazują do NFZ same placówki, dlatego czas oczekiwania może się zmienić. Przed wizytą zawsze potwierdź termin telefonicznie w wybranej placówce.",
  ],

  // Statystyka
  statTitle: "Statystyki świadczeń NFZ",
  statDesc:
    "Przeglądaj dane statystyczne dotyczące hospitalizacji. Liczbę pacjentów, strukturę według płci, wieku, trybu przyjęcia, rozpoznań ICD-10.",
  statNoData: "Nie znaleziono danych statystycznych dla tego świadczenia.",
  statIndexError: "Błąd pobierania indeksu tabel",
  statCopyTitle: "Kopiuj link do aktualnych statystyk",
  statCopy: "Kopiuj",
  statCopied: "Skopiowano",
  statLoadingIndex: "Pobieranie dostępnych tabel statystycznych…",
  statYear: "Rok:",
};
