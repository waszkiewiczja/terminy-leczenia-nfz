import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
let mapQueueToRecord;
let sortResults;
let ResultsTable;
let LangProvider;

before(async () => {
  server = await createServer({
    appType: "custom",
    server: { middlewareMode: true },
    logLevel: "error",
  });
  ({ mapQueueToRecord } = await server.ssrLoadModule(
    "/src/functions/mapQueueToRecord.ts",
  ));
  ({ sortResults } = await server.ssrLoadModule(
    "/src/functions/sortResults.ts",
  ));
  ({ ResultsTable } = await server.ssrLoadModule("/src/ResultsTable.tsx"));
  ({ LangProvider } = await server.ssrLoadModule("/src/lang/LangContext.tsx"));
});

after(async () => {
  await server?.close();
});

function makeEntry(statistics) {
  return {
    type: "queue",
    id: "1",
    attributes: {
      case: 1,
      benefit: "TEST",
      provider: "PLACÓWKA",
      place: "PORADNIA",
      address: "ULICA",
      locality: "MIASTO",
      phone: "",
      "benefits-for-children": "N",
      statistics,
      dates: {},
    },
  };
}

function statistics(averagePeriod) {
  return { "provider-data": { "average-period": averagePeriod } };
}

test("mapping distinguishes missing average wait times from zero", () => {
  for (const value of [
    undefined,
    null,
    {},
    { "provider-data": null },
    { "provider-data": {} },
    statistics(null),
  ]) {
    assert.equal(mapQueueToRecord(makeEntry(value)).sredni_czas, null);
  }
  assert.equal(mapQueueToRecord(makeEntry(statistics(0))).sredni_czas, 0);
  assert.equal(mapQueueToRecord(makeEntry(statistics(12))).sredni_czas, 12);
});

test("sorting keeps known waiting times in ascending order and unknown times last", () => {
  const records = [
    mapQueueToRecord(makeEntry(null)),
    mapQueueToRecord(makeEntry(statistics(12))),
    mapQueueToRecord(makeEntry(statistics(0))),
    mapQueueToRecord(makeEntry({})),
    mapQueueToRecord(makeEntry(statistics(1))),
  ];
  const sorted = sortResults(records);
  assert.deepEqual(
    sorted.map((record) => record.sredni_czas),
    [0, 1, 12, null, null],
  );
  assert.equal(sorted[3], records[0]);
  assert.equal(sorted[4], records[3]);
  assert.equal(records[0].sredni_czas, null);

  const loadedMore = sortResults([
    ...sorted,
    mapQueueToRecord(makeEntry(statistics(5))),
  ]);
  assert.deepEqual(
    loadedMore.map((record) => record.sredni_czas),
    [0, 1, 5, 12, null, null],
  );
});

for (const [lang, missing, zero, one, many] of [
  ["pl", "Brak danych", "0 dni", "1 dzień", "12 dni"],
  ["en", "No data", "0 days", "1 day", "12 days"],
]) {
  test(`desktop and mobile results distinguish missing and known waiting times (${lang})`, () => {
    const results = [null, 0, 1, 12].map((days) =>
      mapQueueToRecord(makeEntry(statistics(days))),
    );
    const filters = {
      dzieci: false,
      swiadczenie: "TEST",
      wojewodztwo: [],
      miejscowosc: "",
      szpital: "",
    };
    const html = renderToStaticMarkup(
      createElement(
        LangProvider,
        { lang },
        createElement(ResultsTable, { results, loading: false, filters }),
      ),
    );

    for (const text of [missing, zero, one, many]) {
      assert.ok(html.includes(`<td class="termin">${text}</td>`));
      assert.ok(html.includes(`<div class="card-termin"><span>${text}</span>`));
    }
  });
}
