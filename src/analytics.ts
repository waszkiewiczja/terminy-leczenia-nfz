import { seoRoutes } from "./seo";
import type { Meta, SearchFilters } from "./types";

export const GA_MEASUREMENT_ID = "G-VR4S69HXNZ";
export const CONSENT_KEY = "nfz-analytics-consent-v3";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: Gtag;
    "ga-disable-G-VR4S69HXNZ"?: boolean;
  }
}

let initialized = false;
let enabled = false;
let lastPageKey: string | null = null;

export function readAnalyticsConsent(): boolean | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (
      value === null &&
      window.localStorage.getItem("nfz-analytics-consent-v2") === "rejected"
    ) {
      return false;
    }
    return value === "accepted" ? true : value === "rejected" ? false : null;
  } catch {
    return null;
  }
}

export function saveAnalyticsConsent(accepted: boolean): void {
  try {
    window.localStorage.setItem(
      CONSENT_KEY,
      accepted ? "accepted" : "rejected",
    );
  } catch {
    // The choice remains in memory when storage is unavailable.
  }
}

export function safePageData(pathname: string, origin: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const route = seoRoutes.find((candidate) => candidate.path === path);
  const safePath = route?.path ?? "/";
  return {
    page_location: origin + (safePath === "/" ? "/" : `${safePath}/`),
    page_title: route?.title ?? "Terminy Leczenia NFZ",
    page_referrer: "",
  };
}

export function startAnalytics(): void {
  if (typeof window === "undefined") return;
  window["ga-disable-G-VR4S69HXNZ"] = false;
  enabled = true;

  if (initialized) {
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer?.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    ...safePageData(window.location.pathname, window.location.origin),
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement("script");
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  initialized = true;
}

export function stopAnalytics(): void {
  if (typeof window === "undefined") return;
  enabled = false;
  lastPageKey = null;
  window["ga-disable-G-VR4S69HXNZ"] = true;
  if (initialized) {
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
  }
  const domains = window.location.hostname.split(".");
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && name !== `_ga_${GA_MEASUREMENT_ID.slice(2)}`)
      continue;
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    for (let i = 0; i < domains.length - 1; i++) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domains.slice(i).join(".")}; SameSite=Lax`;
    }
  }
}

export function trackPage(pathname: string, key: string): void {
  if (!enabled || key === lastPageKey) return;
  lastPageKey = key;
  const page = safePageData(pathname, window.location.origin);
  window.gtag?.("set", page);
  window.gtag?.("event", "page_view", page);
}

function addTextParameters(
  parameters: Record<string, string>,
  name: string,
  value: string,
): void {
  const characters = Array.from(value);
  // GA4 limits each parameter to 100 characters; three parts cover the current catalog.
  for (
    let offset = 0;
    offset < characters.length && offset < 300;
    offset += 100
  ) {
    const suffix = offset === 0 ? "" : `_${offset / 100 + 1}`;
    parameters[name + suffix] = characters.slice(offset, offset + 100).join("");
  }
}

export function trackSearch(filters: SearchFilters, meta: Meta): void {
  if (
    !enabled ||
    typeof window === "undefined" ||
    !filters.swiadczenie ||
    !meta.services.includes(filters.swiadczenie)
  )
    return;

  const parameters: Record<string, string> = {
    search_children: filters.dzieci ? "yes" : "no",
  };
  addTextParameters(parameters, "search_term", filters.swiadczenie);
  const provinces = [...new Set(filters.wojewodztwo)]
    .filter((province) => meta.wojewodztwa.includes(province))
    .sort();
  addTextParameters(parameters, "search_provinces", provinces.join(", "));
  if (filters.miejscowosc && meta.allCities.includes(filters.miejscowosc)) {
    addTextParameters(parameters, "search_city", filters.miejscowosc);
  }
  if (filters.szpital && meta.allProviders.includes(filters.szpital)) {
    addTextParameters(parameters, "search_provider", filters.szpital);
  }

  window.gtag?.("event", "search", {
    ...parameters,
    ...safePageData(window.location.pathname, window.location.origin),
  });
}
