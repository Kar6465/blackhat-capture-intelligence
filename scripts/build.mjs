import { mkdir, readFile, writeFile } from "node:fs/promises";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const workerTemplate = await readFile(new URL("../src/worker.js", import.meta.url), "utf8");
const worker = workerTemplate.replace("__INDEX_HTML__", JSON.stringify(html));

await mkdir(new URL("../dist/server/", import.meta.url), { recursive: true });
await writeFile(new URL("../dist/server/index.js", import.meta.url), worker);
console.log("Built dist/server/index.js");
