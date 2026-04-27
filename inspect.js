import XLSX from "xlsx";
const wb = XLSX.readFile("dane/mazowieckie.xlsx");
const ws = wb.Sheets[wb.SheetNames[0]];
const raw = XLSX.utils.sheet_to_json(ws, { header: 1 });
// Row 0 is the info header, row 1 is the column names, data starts at row 2
console.log("Row 0 (info):", raw[0]);
console.log("Row 1 (colnames):", raw[1]);
console.log("Row 2 (first data):", raw[2]);
console.log("Row 3:", raw[3]);

// Unique Kategoria medyczna values (col index 6)
const categories = new Set();
const services = new Set();
const childrenPattern = /dzieci|dziecięc/i;
let hasChildren = 0;
for (let i = 2; i < raw.length; i++) {
  categories.add(raw[i][6]);
  services.add(raw[i][5]);
  if (
    childrenPattern.test(raw[i][10] || "") ||
    childrenPattern.test(raw[i][5] || "")
  ) {
    hasChildren++;
  }
}
console.log("\\nCategories:", [...categories]);
console.log("\\nSample services (first 10):", [...services].slice(0, 10));
console.log("\\nRows with children:", hasChildren);
console.log("\\nAddress example:", raw[2][11]);
console.log("Address example2:", raw[3][11]);
