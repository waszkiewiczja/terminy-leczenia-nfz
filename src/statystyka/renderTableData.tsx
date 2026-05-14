import type {
  BasicDataEntry,
  GenderEntry,
  AdmissionEntry,
  DischargeEntry,
  AgeEntry,
  ProcedureEntry,
  DiseaseEntry,
  HealthcareServiceEntry,
  ProductCategoryEntry,
  HistogramEntry,
} from "../api/nfzStatApi";
import { BasicDataTable } from "./BasicDataTable";
import { GenderTable } from "./GenderTable";
import { AdmissionTable } from "./AdmissionTable";
import { DischargeTable } from "./DischargeTable";
import { AgeTable } from "./AgeTable";
import { ProcedureTable } from "./ProcedureTable";
import { DiseaseTable } from "./DiseaseTable";
import { HealthcareServiceTable } from "./HealthcareServiceTable";
import { ProductCategoryTable } from "./ProductCategoryTable";
import { HistogramChart } from "./HistogramChart";

export type TableData =
  | BasicDataEntry
  | GenderEntry
  | AdmissionEntry
  | DischargeEntry
  | AgeEntry
  | ProcedureEntry
  | DiseaseEntry
  | HealthcareServiceEntry
  | ProductCategoryEntry
  | HistogramEntry;

export function renderTableData(resourceName: string, entries: TableData[]) {
  if (!entries.length) return <p className="stat-empty">Brak danych</p>;

  // Detect histogram by entry type field regardless of resource-name string
  if ((entries[0] as HistogramEntry).type === "histogram") {
    return entries.map((e, i) => (
      <HistogramChart key={i} entry={e as HistogramEntry} />
    ));
  }

  switch (resourceName) {
    case "basic-data":
      return entries.map((e, i) => (
        <BasicDataTable key={i} entry={e as BasicDataEntry} />
      ));
    case "hospitalizations-by-patient-gender":
      return entries.map((e, i) => (
        <GenderTable key={i} entry={e as GenderEntry} />
      ));
    case "hospitalizations-by-admission-type":
    case "hospitalizations-by-admission-type-nfz-categorized":
      return entries.map((e, i) => (
        <AdmissionTable key={i} entry={e as AdmissionEntry} />
      ));
    case "hospitalizations-by-discharge-type":
      return entries.map((e, i) => (
        <DischargeTable key={i} entry={e as DischargeEntry} />
      ));
    case "hospitalizations-by-patient-age":
      return entries.map((e, i) => <AgeTable key={i} entry={e as AgeEntry} />);
    case "icd9-procedures":
      return entries.map((e, i) => (
        <ProcedureTable key={i} entry={e as ProcedureEntry} />
      ));
    case "icd10-diseases":
      return entries.map((e, i) => (
        <DiseaseTable key={i} entry={e as DiseaseEntry} />
      ));
    case "hospitalizations-by-healthcare-service":
      return entries.map((e, i) => (
        <HealthcareServiceTable key={i} entry={e as HealthcareServiceEntry} />
      ));
    case "hospitalizations-by-product-category":
      return entries.map((e, i) => (
        <ProductCategoryTable key={i} entry={e as ProductCategoryEntry} />
      ));
    case "histogram":
      return entries.map((e, i) => (
        <HistogramChart key={i} entry={e as HistogramEntry} />
      ));
    default:
      return <pre className="stat-raw">{JSON.stringify(entries, null, 2)}</pre>;
  }
}
