import { QueueEntry, TerminRecord } from "../types";

export const mapQueueToRecord = (entry: QueueEntry): TerminRecord => {
  const attr = entry.attributes;
  return {
    sw: attr.benefit,
    kat: attr.case === 2 ? "PRZYPADEK PILNY" : "PRZYPADEK STABILNY",
    kod_sw: "",
    swiadczeniodawca: attr.provider,
    komorka: attr.place,
    adres: `${attr.locality || ""};${attr.address || ""};${attr.phone || ""}`,
    miasto: attr.locality || "",
    dzieci: attr["benefits-for-children"] === "Y",
    oczekujacy: attr.statistics?.["provider-data"]?.awaiting ?? 0,
    skresleni: attr.statistics?.["provider-data"]?.removed ?? 0,
    sredni_czas: attr.statistics?.["provider-data"]?.["average-period"] ?? 0,
    termin: attr.dates?.date || "",
    data_info: attr.dates?.["date-situation-as-at"] || "",
  };
};
