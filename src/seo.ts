import { pl } from "./lang/pl";
import { en } from "./lang/en";
import type { Lang } from "./lang/LangContext";

export const SITE_URL = "https://terminy-leczenia-nfz.pl";

export interface SeoRoute {
  path: string;
  lang: Lang;
  title: string;
  description: string;
  // Pages without real English content are kept out of the index.
  noindex?: boolean;
  alternate?: string;
  home?: boolean;
}

export const seoRoutes: SeoRoute[] = [
  {
    path: "/",
    lang: "pl",
    home: true,
    alternate: "/en",
    title: "Terminy Leczenia NFZ – Wyszukiwarka Kolejek i Wolnych Terminów",
    description:
      "Sprawdź aktualne terminy leczenia NFZ. Znajdź najszybszy wolny termin u specjalisty, na zabieg lub badanie w swoim województwie. Dane prosto z NFZ.",
  },
  {
    path: "/statystyka",
    lang: "pl",
    title: "Statystyki Świadczeń NFZ – Dane o Hospitalizacjach",
    description:
      "Statystyki hospitalizacji NFZ dla wybranego świadczenia: liczba pacjentów, płeć, wiek, tryb przyjęcia i wypisu oraz najczęstsze rozpoznania ICD-10.",
  },
  {
    path: "/regulamin",
    lang: "pl",
    title: "Regulamin – Terminy Leczenia NFZ",
    description:
      "Regulamin serwisu Terminy Leczenia NFZ – wyszukiwarki terminów leczenia i czasu oczekiwania na świadczenia finansowane przez NFZ.",
  },
  {
    path: "/polityka-prywatnosci",
    lang: "pl",
    title: "Polityka Prywatności – Terminy Leczenia NFZ",
    description:
      "Polityka prywatności serwisu Terminy Leczenia NFZ: administrator, zakres i cele przetwarzania danych, pliki cookie oraz prawa użytkownika.",
  },
  {
    path: "/kontakt",
    lang: "pl",
    alternate: "/en/kontakt",
    title: "Kontakt – Terminy Leczenia NFZ",
    description:
      "Skontaktuj się z serwisem Terminy Leczenia NFZ – zgłoś błąd w prezentacji danych lub zadaj pytanie dotyczące wyszukiwarki terminów NFZ.",
  },
  {
    path: "/en",
    lang: "en",
    home: true,
    alternate: "/",
    title: "NFZ Treatment Dates – Search Waiting Times in Poland",
    description:
      "Check current NFZ treatment dates in Poland. Find the shortest waiting time for a specialist, procedure or test in your province. Official NFZ data.",
  },
  {
    path: "/en/statystyka",
    lang: "en",
    noindex: true,
    title: "NFZ Service Statistics – Hospitalisation Data",
    description:
      "NFZ hospitalisation statistics: number of patients, gender, age, admission mode and ICD-10 diagnoses.",
  },
  {
    path: "/en/regulamin",
    lang: "en",
    noindex: true,
    title: "Terms of Service – NFZ Treatment Dates",
    description: "Terms of service of the NFZ Treatment Dates search engine.",
  },
  {
    path: "/en/polityka-prywatnosci",
    lang: "en",
    noindex: true,
    title: "Privacy Policy – NFZ Treatment Dates",
    description: "Privacy policy of the NFZ Treatment Dates search engine.",
  },
  {
    path: "/en/kontakt",
    lang: "en",
    alternate: "/kontakt",
    title: "Contact – NFZ Treatment Dates",
    description:
      "Contact the NFZ Treatment Dates team – report a data presentation issue or ask a question about the NFZ waiting time search engine.",
  },
];

export function canonicalUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}/`;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsonLd(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

function hreflangPair(route: SeoRoute): { pl: string; en: string } | null {
  if (route.noindex || !route.alternate) return null;
  const other = seoRoutes.find((r) => r.path === route.alternate);
  if (!other || other.noindex) return null;
  return route.lang === "pl"
    ? { pl: route.path, en: other.path }
    : { pl: other.path, en: route.path };
}

function homeStructuredData(route: SeoRoute, lastReviewed: string): unknown {
  const t = route.lang === "en" ? en : pl;
  const url = canonicalUrl(route.path);
  const inLanguage = route.lang === "en" ? "en" : "pl-PL";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name:
          route.lang === "en" ? "NFZ Treatment Dates" : "Terminy Leczenia NFZ",
        url,
        description: route.description,
        applicationCategory: "HealthApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "PLN" },
      },
      {
        "@type": "MedicalWebPage",
        "@id": `${url}#webpage`,
        url,
        name: route.title,
        description: route.description,
        inLanguage,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${url}#app` },
        about: {
          "@type": "Thing",
          name:
            route.lang === "en"
              ? "NFZ treatment dates"
              : "Terminy leczenia NFZ",
          description:
            route.lang === "en"
              ? "Waiting times for healthcare services funded by the National Health Fund (NFZ) in Poland."
              : "Czas oczekiwania na świadczenia zdrowotne finansowane przez Narodowy Fundusz Zdrowia.",
        },
        audience: { "@type": "Patient" },
        lastReviewed,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage,
        mainEntity: [
          { question: t.homeHowTitle, answer: t.homeHowSteps },
          { question: t.homeCaseTitle, answer: t.homeCaseParagraphs },
          { question: t.homeDataTitle, answer: t.homeDataParagraphs },
        ].map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer.join(" ") },
        })),
      },
    ],
  };
}

export function buildHead(route: SeoRoute, lastReviewed: string): string {
  const url = canonicalUrl(route.path);
  const title = escapeAttr(route.title);
  const description = escapeAttr(route.description);
  const tags = [
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
  ];

  if (route.noindex) {
    tags.push(`<meta name="robots" content="noindex, follow" />`);
  }

  const pair = hreflangPair(route);
  if (pair) {
    tags.push(
      `<link rel="alternate" hreflang="pl" href="${canonicalUrl(pair.pl)}" />`,
      `<link rel="alternate" hreflang="en" href="${canonicalUrl(pair.en)}" />`,
      `<link rel="alternate" hreflang="x-default" href="${canonicalUrl(pair.pl)}" />`,
    );
  }

  tags.push(
    `<meta property="og:locale" content="${route.lang === "en" ? "en_US" : "pl_PL"}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  );

  if (route.home) {
    tags.push(jsonLd(homeStructuredData(route, lastReviewed)));
  }

  return tags.join("\n    ");
}

export function buildSitemap(lastmod: string): string {
  const urls = seoRoutes
    .filter((r) => !r.noindex)
    .map((r) => {
      const pair = hreflangPair(r);
      const alternates = pair
        ? [
            `<xhtml:link rel="alternate" hreflang="pl" href="${canonicalUrl(pair.pl)}"/>`,
            `<xhtml:link rel="alternate" hreflang="en" href="${canonicalUrl(pair.en)}"/>`,
            `<xhtml:link rel="alternate" hreflang="x-default" href="${canonicalUrl(pair.pl)}"/>`,
          ]
        : [];
      return [
        "  <url>",
        `    <loc>${canonicalUrl(r.path)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        ...alternates.map((a) => `    ${a}`),
        "  </url>",
      ].join("\n");
    });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
