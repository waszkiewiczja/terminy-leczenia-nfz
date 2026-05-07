import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const DANE_DIR = "dane";
const OUT_DIR = "public/dane";

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const files = fs.readdirSync(DANE_DIR).filter((f) => f.endsWith(".xlsx"));
const allServices = new Set();
const allCities = new Set();
const allProviders = new Set();
const meta = { wojewodztwa: [], cities: {}, providers: {} };

for (const file of files) {
  const woj = path.basename(file, ".xlsx").toUpperCase();
  console.log(`Processing ${woj}...`);

  const wb = XLSX.readFile(path.join(DANE_DIR, file));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1 });

  // Skip rows 0 (info), 1 (empty), 2 (column headers) — data starts at row 3
  const cities = new Set();
  const providers = new Set();
  let rowCount = 0;

  for (let i = 3; i < raw.length; i++) {
    const r = raw[i];
    if (!r || !r[5]) continue;

    const adres = String(r[11] || "");
    const city = adres.split(";")[0].trim();
    if (city) {
      cities.add(city);
      allCities.add(city);
    }

    const service = String(r[5] || "").trim();
    allServices.add(service);

    const provider = String(r[8] || "").trim();
    if (provider) {
      providers.add(provider);
      allProviders.add(provider);
    }

    rowCount++;
  }

  meta.wojewodztwa.push(woj);
  meta.cities[woj] = [...cities].sort();
  meta.providers[woj] = [...providers].sort();
  console.log(`  → ${rowCount} rows, ${cities.size} cities`);
}

meta.wojewodztwa.sort();
meta.services = [...allServices].sort();
meta.allCities = [...allCities].sort();
meta.allProviders = [...allProviders].sort();

fs.writeFileSync(path.join(OUT_DIR, "meta.json"), JSON.stringify(meta));

console.log(
  `\nDone! ${meta.wojewodztwa.length} regions, ${meta.services.length} services total.`,
);
