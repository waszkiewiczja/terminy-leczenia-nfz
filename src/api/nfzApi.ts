import { QueueEntry } from "../types";

const API_BASE = "https://apinfz.nfz.gov.pl/app-itl-api-pcus";

const PROVINCE_CODES: Record<string, string> = {
  DOLNOŚLĄSKIE: "01",
  "KUJAWSKO-POMORSKIE": "02",
  LUBELSKIE: "03",
  LUBUSKIE: "04",
  ŁÓDZKIE: "05",
  MAŁOPOLSKIE: "06",
  MAZOWIECKIE: "07",
  OPOLSKIE: "08",
  PODKARPACKIE: "09",
  PODLASKIE: "10",
  POMORSKIE: "11",
  ŚLĄSKIE: "12",
  ŚWIĘTOKRZYSKIE: "13",
  "WARMIŃSKO-MAZURSKIE": "14",
  WIELKOPOLSKIE: "15",
  ZACHODNIOPOMORSKIE: "16",
};

interface ApiResponse<T> {
  meta: { count: number; page: number; limit: number };
  links: { next: string | null };
  data: T[];
}

export interface FetchQueuesParams {
  caseType: number;
  province: string;
  benefit: string;
  locality?: string;
  provider?: string;
}

export function getProvinceCode(name: string): string | undefined {
  return PROVINCE_CODES[name];
}

export async function fetchQueuesPage(
  params: FetchQueuesParams,
  page: number,
  limit = 25,
): Promise<{ entries: QueueEntry[]; hasMore: boolean }> {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    format: "json",
    case: String(params.caseType),
    province: params.province,
    benefit: params.benefit,
  });
  if (params.locality) searchParams.set("locality", params.locality);
  if (params.provider) searchParams.set("provider", params.provider);

  const url = `${API_BASE}/queues?${searchParams}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Queues API error: ${res.status}`);
  const data: ApiResponse<QueueEntry> = await res.json();
  return {
    entries: data.data,
    hasMore: !!data.links.next,
  };
}

/** Legacy: fetch all pages (used by prerender/scripts) */
export async function fetchQueues(
  params: FetchQueuesParams,
): Promise<QueueEntry[]> {
  const all: QueueEntry[] = [];
  let page = 1;
  const limit = 25;
  while (true) {
    const { entries, hasMore } = await fetchQueuesPage(params, page, limit);
    all.push(...entries);
    if (!hasMore) break;
    page++;
  }
  return all;
}
