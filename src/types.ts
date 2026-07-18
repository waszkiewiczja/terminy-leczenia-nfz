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
  kolejka: number | null; // Prognozowany czas oczekiwania (dni)
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

export interface QueueAttributes {
  case: number;
  benefit: string;
  provider: string;
  place: string;
  address: string;
  locality: string;
  phone: string;
  "benefits-for-children": string | null;
  "age-range": string | null;
  statistics: {
    "provider-data": {
      awaiting: number;
      removed: number;
      "average-period": number;
      update: string;
    };
    "computed-data": null;
  };
  dates: {
    applicable: boolean;
    pcus: string | null;
    "date-situation-as-at": string;
  };
}

export interface QueueEntry {
  type: string;
  id: string;
  attributes: QueueAttributes;
}
