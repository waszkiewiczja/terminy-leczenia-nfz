const BASE = "https://api.nfz.gov.pl/app-stat-api-jgp";

const idx = await fetch(`${BASE}/index-of-tables?name=5.51.01.0001050&api-version=1.1`, { headers: { Accept: "application/json" } });
const entry = (await idx.json()).data;

// Find a product-categories table
for (const year of (entry.attributes.years ?? []).reverse()) {
  const allTables = [...(year.tables ?? []), ...(year.periods ?? []).flatMap(p => p.tables ?? [])];
  const t = allTables.find(t => t.type === "product-categories");
  if (!t) continue;
  const url = t.links.related.replace("?format=json", "?api-version=1.1");
  console.log("Year:", year.year, "URL:", url);
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  const j = await r.json();
  console.log("data type:", Array.isArray(j.data) ? "array len=" + j.data.length : typeof j.data);
  const raw = j.data;
  const item = Array.isArray(raw) ? raw[0] : raw;
  if (item) {
    console.log("item keys:", Object.keys(item));
    if (item.attributes) {
      console.log("attr keys:", Object.keys(item.attributes));
      const rows = item.attributes.data ?? [];
      console.log("rows:", rows.length);
      if (rows.length) console.log("row[0]:", JSON.stringify(rows[0]));
    } else {
      console.log("NO attributes! item:", JSON.stringify(item).substring(0, 300));
    }
  }
  break;
}
