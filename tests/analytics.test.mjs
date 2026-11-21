import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let server;
let analytics;

before(async () => {
  server = await createServer({
    appType: "custom",
    server: { middlewareMode: true, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    logLevel: "error",
  });
  analytics = await server.ssrLoadModule("/src/analytics.ts");
});

after(async () => {
  await server?.close();
});

test("analytics only sends catalog searches after consent", () => {
  const scripts = [];
  const storage = new Map();
  const filters = {
    swiadczenie: "KARDIOLOGIA",
    wojewodztwo: ["MAZOWIECKIE", "DOLNOŚLĄSKIE"],
    miejscowosc: "WARSZAWA",
    szpital: "PRZYKŁADOWA PLACÓWKA",
    dzieci: true,
  };
  const meta = {
    services: [filters.swiadczenie],
    wojewodztwa: filters.wojewodztwo,
    allCities: [filters.miejscowosc],
    allProviders: [filters.szpital],
  };
  globalThis.window = {
    location: {
      origin: "https://terminy-leczenia-nfz.pl",
      pathname: "/",
      hostname: "terminy-leczenia-nfz.pl",
      search: "?s=KARDIOLOGIA&w=MAZOWIECKIE",
    },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  };
  globalThis.document = {
    title: "Kardiologia Mazowieckie - Terminy Leczenia NFZ",
    cookie: "",
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
  };
  try {
    analytics.trackSearch(filters, meta);
    assert.equal(scripts.length, 0);
    assert.equal(analytics.readAnalyticsConsent(), null);
    storage.set("nfz-analytics-consent", "accepted");
    storage.set("nfz-analytics-consent-v2", "accepted");
    assert.equal(analytics.readAnalyticsConsent(), null);
    storage.set("nfz-analytics-consent-v2", "rejected");
    assert.equal(analytics.readAnalyticsConsent(), false);
    analytics.saveAnalyticsConsent(true);
    assert.equal(analytics.readAnalyticsConsent(), true);

    analytics.startAnalytics();
    analytics.trackPage("/", "first");
    analytics.trackPage("/", "first");
    analytics.trackSearch(filters, meta);
    analytics.trackSearch(
      { ...filters, swiadczenie: "osoba@example.com" },
      meta,
    );
    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].referrerPolicy, "no-referrer");
    assert.match(scripts[0].src, /G-VR4S69HXNZ/);
    let calls = window.dataLayer.map((call) => Array.from(call));
    assert.equal(calls.filter((call) => call[1] === "page_view").length, 1);
    const searches = calls.filter((call) => call[1] === "search");
    assert.equal(searches.length, 1);
    assert.equal(searches[0][2].search_term, "KARDIOLOGIA");
    assert.equal(searches[0][2].search_provinces, "DOLNOŚLĄSKIE, MAZOWIECKIE");
    assert.equal(searches[0][2].search_city, "WARSZAWA");
    assert.equal(searches[0][2].search_provider, "PRZYKŁADOWA PLACÓWKA");
    assert.equal(searches[0][2].search_children, "yes");
    assert.doesNotMatch(
      JSON.stringify(calls),
      /Kardiologia Mazowieckie|osoba@example.com|\?s=/,
    );

    const longService = "Ś".repeat(201);
    const longProvider = "Ł".repeat(210);
    analytics.trackSearch(
      { ...filters, swiadczenie: longService, szpital: longProvider },
      { ...meta, services: [longService], allProviders: [longProvider] },
    );
    calls = window.dataLayer.map((call) => Array.from(call));
    assert.equal(calls.at(-1)[2].search_term, "Ś".repeat(100));
    assert.equal(calls.at(-1)[2].search_term_2, "Ś".repeat(100));
    assert.equal(calls.at(-1)[2].search_term_3, "Ś");
    assert.equal(calls.at(-1)[2].search_provider_3, "Ł".repeat(10));

    analytics.trackSearch(
      {
        ...filters,
        miejscowosc: "osoba@example.com",
        szpital: "inny@example.com",
        dzieci: false,
      },
      meta,
    );
    calls = window.dataLayer.map((call) => Array.from(call));
    assert.equal(calls.at(-1)[2].search_children, "no");
    assert.equal(calls.at(-1)[2].search_city, undefined);
    assert.equal(calls.at(-1)[2].search_provider, undefined);
    assert.doesNotMatch(
      JSON.stringify(calls),
      /osoba@example.com|inny@example.com/,
    );

    const provinces = Array.from(
      { length: 16 },
      (_, index) => `PROVINCE-${String(index).padStart(2, "0")}`,
    );
    analytics.trackSearch(
      {
        ...filters,
        wojewodztwo: [...provinces, provinces[0], "osoba@example.com"],
        miejscowosc: "",
        szpital: "",
      },
      { ...meta, wojewodztwa: provinces },
    );
    calls = window.dataLayer.map((call) => Array.from(call));
    const params = calls.at(-1)[2];
    assert.equal(
      [
        params.search_provinces,
        params.search_provinces_2,
        params.search_provinces_3,
      ]
        .filter(Boolean)
        .join(""),
      provinces.join(", "),
    );
    assert.equal(params.search_city, undefined);
    assert.equal(params.search_provider, undefined);
    assert.doesNotMatch(JSON.stringify(params), /osoba@example.com/);

    analytics.trackPage("/statystyka/", "second");
    analytics.stopAnalytics();
    assert.equal(window["ga-disable-G-VR4S69HXNZ"], true);
    calls = window.dataLayer.map((call) => Array.from(call));
    const count = calls.length;
    analytics.trackSearch(filters, meta);
    analytics.trackPage("/", "third");
    assert.equal(window.dataLayer.length, count);

    analytics.startAnalytics();
    analytics.trackPage("/", "third");
    assert.equal(scripts.length, 1);
    assert.equal(window["ga-disable-G-VR4S69HXNZ"], false);
    analytics.stopAnalytics();
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});

test("page metadata accepts only known routes and never query strings", () => {
  const origin = "https://terminy-leczenia-nfz.pl";
  assert.equal(
    analytics.safePageData("/statystyka/", origin).page_location,
    `${origin}/statystyka/`,
  );
  assert.equal(
    analytics.safePageData("/arbitrary-sensitive-path", origin).page_location,
    `${origin}/`,
  );
  assert.equal(analytics.safePageData("/", origin).page_referrer, "");
});
