// Temporary test script - checking index-of-tables parameters

    const r = await fetch(url, { headers: { Accept: "application/json" } });
    const body = await r.text();
    console.log(`[${r.status}] ${label}`);
    if (!r.ok) {
      // Show first 400 chars of error body
      console.log("  ERROR:", body.substring(0, 400));
    } else {
      console.log("  OK:", body.substring(0, 300));
    }
  } catch (e) {
    console.log(`[ERR] ${label}: ${e.message}`);
  }
}

const BASE = "https://api.nfz.gov.pl/app-stat-api-jgp";

async function tryUrl(label, url) {
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    const body = await r.json();
    console.log(`[${r.status}] ${label}`);
    console.log("  meta:", JSON.stringify(body.meta).substring(0, 300));
    if (body.data) console.log("  data length:", Array.isArray(body.data) ? body.data.length : "single object");
  } catch (e) {
    console.log(`[ERR] ${label}: ${e.message}`);
  }
}

// Check what meta says about total count
await tryUrl("benefits catalog=1a limit=1", `${BASE}/benefits?catalog=1a&benefit=a&limit=1&api-version=1.1`);
await tryUrl("benefits catalog=1a limit=100", `${BASE}/benefits?catalog=1a&limit=100&api-version=1.1`);
await tryUrl("benefits catalog=1b limit=1", `${BASE}/benefits?catalog=1b&benefit=a&limit=1&api-version=1.1`);
await tryUrl("benefits all catalogs no filter limit=1", `${BASE}/benefits?limit=1&api-version=1.1`);
await tryUrl("sections endpoint", `${BASE}/sections?api-version=1.1`);

