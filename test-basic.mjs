const BASE = "https://api.nfz.gov.pl/app-stat-api-jgp";

const idx = await fetch(`${BASE}/index-of-tables?name=5.51.01.0001050&api-version=1.1`, { headers: { Accept: "application/json" } });
const idxJson = await idx.json();
const entry = idxJson.data;

for (const year of (entry.attributes.years ?? []).reverse()) {
  const allTables = [...(year.tables ?? []), ...(year.periods ?? []).flatMap(p => p.tables ?? [])];
  const basicTable = allTables.find(t => t.type === "general-data");
  if (!basicTable) { console.log("No general-data for year", year.year); continue; }
  const url = basicTable.links.related.replace("?format=json", "?api-version=1.1");
  console.log("URL:", url);
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  const j = await r.json();
  console.log("data type:", Array.isArray(j.data) ? "array" : typeof j.data);
  const raw = j.data;
  const item = Array.isArray(raw) ? raw[0] : raw;
  console.log("attributes keys:", item ? Object.keys(item.attributes) : "none");
  if (item?.attributes) {
    const attrs = item.attributes;
    console.log("  year:", attrs.year, "header:", attrs.header);
    const rows = attrs.data ?? [];
    console.log("  data rows:", rows.length);
    if (rows.length > 0) {
      console.log("  Row[0] keys:", Object.keys(rows[0]));
      for (const [k, v] of Object.entries(rows[0])) console.log(`    ${k}: ${JSON.stringify(v)}`);
      break;
    }
  }
}
