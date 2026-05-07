const API_BASE = "https://api.nfz.gov.pl/app-itl-api";

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
    date: string;
    "date-situation-as-at": string;
  };
}

export interface QueueEntry {
  type: string;
  id: string;
  attributes: QueueAttributes;
}

export function getProvinceCode(name: string): string | undefined {
  return PROVINCE_CODES[name];
}

export async function fetchQueues(params: {
  caseType: number;
  province: string;
  benefit: string;
  locality?: string;
  provider?: string;
}): Promise<QueueEntry[]> {
  const all: QueueEntry[] = [];
  let page = 1;
  const limit = 25;

  while (true) {
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
    all.push(...data.data);

    if (!data.links.next || data.data.length < limit) break;
    page++;
  }

  return all;
}
