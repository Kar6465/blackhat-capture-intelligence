import { mkdir, readFile, writeFile } from "node:fs/promises";

const appHtml = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const landingHtml = await readFile(new URL("../dist/landing.html", import.meta.url), "utf8");
const workerTemplate = await readFile(new URL("../src/worker.js", import.meta.url), "utf8");
const worker = workerTemplate
  .replace("__APP_HTML__", JSON.stringify(appHtml))
  .replace("__LANDING_HTML__", JSON.stringify(landingHtml));

await mkdir(new URL("../dist/server/", import.meta.url), { recursive: true });
await writeFile(new URL("../dist/server/index.js", import.meta.url), worker);
console.log("Built dist/server/index.js");
