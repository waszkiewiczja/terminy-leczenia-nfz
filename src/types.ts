export interface TerminRecord {
  sw: string; // Nazwa świadczenia
  kat: string; // Kategoria medyczna (PRZYPADEK PILNY / STABILNY)
  kod_sw: string; // Kod świadczenia
  swiadczeniodawca: string;
  komorka: string; // Nazwa komórki
  adres: string; // pełny adres: MIASTO;ULICA;TELEFON
  miasto: string;
  dzieci: boolean;
  oczekujacy: number;
  skresleni: number;
  sredni_czas: number; // Średni czas oczekiwania (dni)
  termin: string; // Pierwszy wolny termin (data)
  data_info: string;
}

export interface Meta {
  wojewodztwa: string[];
  services: string[];
  cities: Record<string, string[]>;
  allCities: string[];
  providers: Record<string, string[]>;
  allProviders: string[];
}

export interface SearchFilters {
  dzieci: boolean;
  swiadczenie: string;
  wojewodztwo: string[];
  miejscowosc: string;
  szpital: string;
}
