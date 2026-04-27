import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const DOWNLOAD_PAGE = "https://terminyleczenia.nfz.gov.pl/Download";
const DANE_DIR = "dane";

if (!fs.existsSync(DANE_DIR)) {
  fs.mkdirSync(DANE_DIR, { recursive: true });
}

function get(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return get(res.headers.location).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks) }),
        );
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("Fetching download page...");
  const { body: html } = await get(DOWNLOAD_PAGE);
  const page = html.toString("utf-8");

  // Find all download links: href="/DownloadFile/UUID?mime=..."
  const linkRegex =
    /href="(\/DownloadFile\/[^"]+)">[\s\S]*?<span[^>]*>(?:Plik danych dla województwa:\s*)?<\/span>([\s\S]*?)<\/a>/g;

  const links = [];
  let m;
  while ((m = linkRegex.exec(page)) !== null) {
    const href = m[1];
    // Extract voivodeship name from surrounding text
    const rawName = m[2].trim().replace(/&[^;]+;/g, (ent) => {
      const div = {
        "&#x15B;": "ś",
        "&#x105;": "ą",
        "&#x107;": "ć",
        "&#x119;": "ę",
        "&#x142;": "ł",
        "&#x144;": "ń",
        "&#xF3;": "ó",
        "&#x17A;": "ź",
        "&#x17C;": "ż",
        "&#x15A;": "Ś",
        "&#x104;": "Ą",
        "&#x106;": "Ć",
        "&#x118;": "Ę",
        "&#x141;": "Ł",
        "&#x143;": "Ń",
        "&#xD3;": "Ó",
        "&#x179;": "Ź",
        "&#x17B;": "Ż",
      };
      return div[ent] || ent;
    });
    links.push({ href, name: rawName });
  }

  if (links.length === 0) {
    // Fallback: simpler regex
    const simpleRegex = /href="(\/DownloadFile\/[^"]+\?mime=[^"]+)"/g;
    const nameRegex = /województwa:\s*<\/span>(.*?)<\/a>/g;
    let sm;
    while ((sm = simpleRegex.exec(page)) !== null) {
      links.push({ href: sm[1], name: "" });
    }
    console.log(`Found ${links.length} download links (names not parsed)`);
  }

  if (links.length === 0) {
    console.error("No download links found on page!");
    process.exit(1);
  }

  console.log(`Found ${links.length} voivodeship files`);

  // Get existing file sizes for change detection
  const existing = {};
  if (fs.existsSync(DANE_DIR)) {
    for (const f of fs
      .readdirSync(DANE_DIR)
      .filter((f) => f.endsWith(".xlsx"))) {
      existing[f] = fs.statSync(path.join(DANE_DIR, f)).size;
    }
  }

  let changed = false;

  for (let i = 0; i < links.length; i++) {
    const { href, name } = links[i];
    const url = `https://terminyleczenia.nfz.gov.pl${href}`;

    // Determine filename from name or fallback to index
    const filename = name
      ? `${name.toLowerCase().replace(/\s+/g, "-")}.xlsx`
      : `woj-${i + 1}.xlsx`;

    console.log(`Downloading ${filename}...`);
    const { status, body } = await get(url);

    if (status !== 200) {
      console.error(`  Failed: HTTP ${status}`);
      continue;
    }

    const oldSize = existing[filename];
    if (oldSize !== undefined && oldSize === body.length) {
      console.log(`  Unchanged (${body.length} bytes)`);
      continue;
    }

    fs.writeFileSync(path.join(DANE_DIR, filename), body);
    console.log(`  Saved (${body.length} bytes, was ${oldSize ?? "new"})`);
    changed = true;
  }

  if (changed) {
    console.log("\nDATA_CHANGED=true");
  } else {
    console.log("\nDATA_CHANGED=false");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
