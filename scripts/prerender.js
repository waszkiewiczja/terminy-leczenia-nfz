import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const template = fs.readFileSync(path.resolve(distDir, "index.html"), "utf-8");

const serverEntry = pathToFileURL(path.resolve(distDir, "server/entry-server.js")).href;
const { render } = await import(serverEntry);

const routes = ["/", "/statystyka"];

for (const url of routes) {
  const appHtml = render(url);
  const html = template.replace("<!--ssr-outlet-->", () => appHtml);

  const filePath =
    url === "/"
      ? path.resolve(distDir, "index.html")
      : path.resolve(distDir, url.slice(1), "index.html");

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
  console.log("Pre-rendered:", filePath);
}
