import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const template = fs.readFileSync(path.resolve(distDir, "index.html"), "utf-8");

const serverEntry = pathToFileURL(
  path.resolve(distDir, "server/entry-server.js"),
).href;
const { render, seoRoutes, buildHead, buildSitemap } = await import(
  serverEntry
);

// Build runs after each weekly data update, so the build date is the data review date.
const buildDate = new Date().toISOString().slice(0, 10);

for (const route of seoRoutes) {
  const { path: url, lang } = route;
  const appHtml = render(url, lang);
  const html = template
    .replace("<!--ssr-outlet-->", () => appHtml)
    .replace("<!--seo-head-->", () => buildHead(route, buildDate))
    .replace(/<title>[^<]*<\/title>/, () => `<title>${route.title}</title>`)
    .replace(/(<html[^>]*) lang="[^"]*"/, `$1 lang="${lang}"`);

  const outPath =
    url === "/"
      ? path.resolve(distDir, "index.html")
      : path.resolve(distDir, url.slice(1), "index.html");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log("Pre-rendered:", outPath);
}

fs.writeFileSync(path.resolve(distDir, "sitemap.xml"), buildSitemap(buildDate));
console.log("Sitemap written");
