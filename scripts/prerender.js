import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const template = fs.readFileSync(path.resolve(distDir, "index.html"), "utf-8");

const serverEntry = pathToFileURL(path.resolve(distDir, "server/entry-server.js")).href;
const { render } = await import(serverEntry);

const routes = [
  { url: "/", lang: "pl" },
  { url: "/statystyka", lang: "pl" },
  { url: "/en", lang: "en" },
  { url: "/en/statystyka", lang: "en" },
];

for (const { url, lang } of routes) {
  const appHtml = render(url, lang);
  const html = template
    .replace("<!--ssr-outlet-->", () => appHtml)
    .replace(/(<html[^>]*) lang="[^"]*"/, `$1 lang="${lang}"`);

  const outPath =
    url === "/"
      ? path.resolve(distDir, "index.html")
      : path.resolve(distDir, url.slice(1), "index.html");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log("Pre-rendered:", outPath);
}
