const BASE = "https://api.nfz.gov.pl/app-stat-api-jgp";

async function tryUrl(label, url) {
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  const body = await r.json();
  console.log(`[${r.status}] ${label}`);
  console.log(
    "  meta.count:",
    body.meta?.count,
    "| meta.limit:",
    body.meta?.limit,
  );
  if (body.data)
    console.log(
      "  data length:",
      Array.isArray(body.data) ? body.data.length : "single object",
    );
}

await tryUrl(
  "benefits catalog=1a limit=1 benefit=a",
  `${BASE}/benefits?catalog=1a&benefit=a&limit=1&api-version=1.1`,
);
await tryUrl(
  "benefits catalog=1a no filter limit=1",
  `${BASE}/benefits?catalog=1a&limit=1&api-version=1.1`,
);
await tryUrl(
  "benefits catalog=1b no filter limit=1",
  `${BASE}/benefits?catalog=1b&limit=1&api-version=1.1`,
);
await tryUrl(
  "benefits catalog=1c no filter limit=1",
  `${BASE}/benefits?catalog=1c&limit=1&api-version=1.1`,
);
await tryUrl(
  "benefits catalog=1d no filter limit=1",
  `${BASE}/benefits?catalog=1d&limit=1&api-version=1.1`,
);
await tryUrl(
  "benefits catalog=1e no filter limit=1",
  `${BASE}/benefits?catalog=1e&limit=1&api-version=1.1`,
);
