const API_BASE = "https://api.nfz.gov.pl/app-stat-api-jgp";
const API_VERSION = "1.1";

export interface Benefit {
  code: string;
  name: string;
}

export interface Table {
  id: string;
  type: string;
  attributes: {
    header: string;
    "resource-name": string;
    "additional-infromation"?: {
      "divided-by-branches": boolean;
      "divided-by-hospital-types": boolean;
      "divided-by-products": boolean;
    };
  };
  links?: { related?: string };
}

export interface IndexYear {
  year: number;
  tables: Table[];
  periods?: Array<{
    "date-from": string;
    "date-to": string | null;
    tables: Table[];
  }>;
}

export interface IndexOfTablesAttributes {
  "product-code": string;
  "product-name": string;
  comment?: string;
  years: IndexYear[];
}

export interface IndexOfTablesEntry {
  type: string;
  attributes: IndexOfTablesAttributes;
}

interface StatApiListResponse<T> {
  meta?: { count?: number; page?: number; limit?: number };
  data: T[];
}

async function statGet<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<StatApiListResponse<T>> {
  const searchParams = new URLSearchParams({
    "api-version": API_VERSION,
    ...params,
  });
  const url = `${API_BASE}/${path}?${searchParams}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`NFZ Stat API błąd: ${res.status}`);
  return res.json();
}

async function statGetOne<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  const searchParams = new URLSearchParams({
    "api-version": API_VERSION,
    ...params,
  });
  const url = `${API_BASE}/${path}?${searchParams}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`NFZ Stat API błąd: ${res.status}`);
  const json = (await res.json()) as { data: T | null };
  return json.data ?? null;
}

// Catalog codes for /benefits endpoint (required; searching without catalog returns 500)
const STAT_CATALOGS = ["1a", "1b", "1c", "1d", "1e"];

export async function fetchTotalBenefitsCount(): Promise<number> {
  const results = await Promise.allSettled(
    STAT_CATALOGS.map((cat) =>
      statGet<Benefit>("benefits", { catalog: cat, limit: "1" }).then(
        (r) => r.meta?.count ?? 0,
      ),
    ),
  );
  return results.reduce(
    (sum, r) => sum + (r.status === "fulfilled" ? r.value : 0),
    0,
  );
}

export async function searchBenefits(query: string): Promise<Benefit[]> {
  if (!query || query.length < 2) return [];
  // Search across all known catalogs in parallel and merge results
  const results = await Promise.allSettled(
    STAT_CATALOGS.map((cat) =>
      statGet<Benefit>("benefits", {
        benefit: query,
        catalog: cat,
        limit: "25",
      }),
    ),
  );
  const seen = new Set<string>();
  const merged: Benefit[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const item of r.value.data ?? []) {
        if (!seen.has(item.code)) {
          seen.add(item.code);
          merged.push(item);
        }
      }
    }
  }
  return merged;
}

// Extracts resource name from a related URL like:
// https://api.nfz.gov.pl/app-stat-api-jgp/basic-data/{id}?format=json
function resourceNameFromUrl(url: string): string {
  const match = url.match(/\/app-stat-api-jgp\/([^/?]+)\//);
  return match ? match[1] : "";
}

export async function fetchIndexOfTables(
  benefitCode: string,
): Promise<IndexOfTablesEntry[]> {
  const entry = await statGetOne<IndexOfTablesEntry>("index-of-tables", {
    name: benefitCode,
  });
  if (!entry) return [];
  // Fix resource-name: null — extract from links.related URL
  for (const yearObj of entry.attributes.years ?? []) {
    const allTables = [
      ...(yearObj.tables ?? []),
      ...(yearObj.periods?.flatMap((p) => p.tables ?? []) ?? []),
    ];
    for (const table of allTables) {
      if (!table.attributes["resource-name"] && table.links?.related) {
        table.attributes["resource-name"] = resourceNameFromUrl(
          table.links.related,
        );
      }
    }
  }
  return [entry];
}

// Some endpoints (e.g. hospitalizations-by-product-category) return keys with
// an uppercase first letter (Id, Type, Attributes). Normalize to camelCase.
function normalizeItem<T>(item: unknown): T {
  if (!item || typeof item !== "object" || Array.isArray(item)) return item as T;
  const obj = item as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const normalized = k.charAt(0).toLowerCase() + k.slice(1);
    result[normalized] = v;
  }
  return result as T;
}

export async function fetchTableData<T>(
  resourceName: string,
  id: string,
): Promise<T[]> {
  const entry = await statGetOne<T | T[]>(`${resourceName}/${id}`);
  if (!entry) return [];
  if (Array.isArray(entry)) return (entry as unknown[]).map(normalizeItem) as T[];
  return [normalizeItem<T>(entry)];
}

// Type definitions for individual stat entries
export interface BasicDataValues {
  branch?: string;
  "hospital-types"?: string;
  "number-of-patients": number;
  "number-of-hospitalizations": number;
  "ratio-of-rehospitalizations"?: number;
  percentage?: number;
  "percentage-of-sections"?: number;
  "duration-of-hospitalization-mediana": number;
  "duration-of-hospitalization-mode": number;
  "average-value-of-hospitalization"?: number;
  "average-value-of-hospitalization-points"?: number;
  "average-value-of-drg"?: number;
  "average-value-of-drg-points"?: number;
}

export interface BasicDataEntry {
  id: string;
  attributes: {
    year: number;
    code: string;
    name: string;
    header: string;
    data: BasicDataValues[];
  };
}

export interface GenderRow {
  branch?: string;
  "hospital-types"?: string;
  "gender-code": number;
  "gender-name": string;
  "number-of-hospitalizations": number;
  percentage: number;
  "duration-of-hospitalization-mediana": number;
}

export interface GenderEntry {
  id: string;
  attributes: {
    year: number;
    code: string;
    name: string;
    header: string;
    data: GenderRow[];
  };
}

export interface AdmissionRow {
  branch?: string;
  "hospital-types"?: string;
  "type-of-admission-code": number;
  "type-of-admission-name": string;
  "number-of-hospitalizations": number;
  percentage: number;
  "duration-of-hospitalization-mediana": number;
}

export interface AdmissionEntry {
  id: string;
  attributes: {
    year: number;
    code: string;
    name: string;
    header: string;
    data: AdmissionRow[];
  };
}

export interface DischargeRow {
  branch?: string;
  "hospital-types"?: string;
  "type-of-discharge-code": number;
  "type-of-discharge-name": string;
  "number-of-hospitalizations": number;
  percentage: number;
  "duration-of-hospitalization-mediana": number;
}

export interface DischargeEntry {
  id: string;
  attributes: {
    year: number;
    code: string;
    name: string;
    header: string;
    data: DischargeRow[];
  };
}

export interface AgeRow {
  branch?: string;
  "hospital-types"?: string;
  "age-group-code": number;
  "age-group-name": string;
  "number-of-hospitalizations": number;
  percentage: number;
  "duration-of-hospitalization-mediana": number;
}

export interface AgeEntry {
  id: string;
  attributes: {
    year: number;
    code: string;
    name: string;
    header: string;
    data: AgeRow[];
  };
}

export interface ProcedureRow {
  "procedure-code": string;
  "procedure-name": string;
  "number-of-hospitalizations": number;
  percentage: number;
  "duration-of-hospitalization-mediana": number;
}

export interface ProcedureEntry {
  id: string;
  attributes: {
    year: number;
    code: string;
    name: string;
    header: string;
    data: ProcedureRow[];
  };
}

export interface DiseaseRow {
  "disease-code": string;
  "disease-name": string;
  "number-of-hospitalizations": number;
  percentage: number;
  "duration-of-hospitalization-mediana": number;
}

export interface DiseaseEntry {
  id: string;
  attributes: {
    year: number;
    code: string;
    name: string;
    header: string;
    data: DiseaseRow[];
  };
}

export interface HealthcareServiceRow {
  branch?: string;
  "hospital-types"?: string;
  "contract-product-code": number;
  "contract-product-name": string;
  "number-of-hospitalizations": number;
  percentage: number;
  "duration-of-hospitalization-mediana": number;
}

export interface HealthcareServiceEntry {
  id: string;
  attributes: {
    year: number;
    code: string;
    name: string;
    header: string;
    data: HealthcareServiceRow[];
  };
}

export interface ProductCategoryRow {
  branch?: string;
  "hospital-types"?: string;
  "product-category-code": number;
  "product-category-name": string;
  "number-of-hospitalizations": number;
  percentage: number;
  "duration-of-hospitalization-mediana": number;
  value?: number;
  "value-percentage"?: number;
}

export interface ProductCategoryEntry {
  id: string;
  attributes: {
    year: number;
    code: string;
    name: string;
    header: string;
    data: ProductCategoryRow[];
  };
}
