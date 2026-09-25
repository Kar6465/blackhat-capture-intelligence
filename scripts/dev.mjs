import http from "node:http";
import worker from "../dist/server/index.js";

try {
  process.loadEnvFile(new URL("../.env", import.meta.url));
} catch (_) {
  // No .env file present — that's fine, only SAM.gov/model integrations are optional.
}

const port = Number(process.env.PORT || 4173);
const env = {
  SAM_API_KEY: process.env.SAM_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
};

const server = http.createServer(async (incoming, outgoing) => {
  const chunks = [];
  for await (const chunk of incoming) chunks.push(chunk);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const request = new Request(`http://127.0.0.1:${port}${incoming.url}`, {
    method: incoming.method,
    headers: incoming.headers,
    body: ["GET", "HEAD"].includes(incoming.method) ? undefined : body,
  });
  const response = await worker.fetch(request, env);
  outgoing.writeHead(response.status, Object.fromEntries(response.headers));
  if (!response.body) {
    outgoing.end();
    return;
  }
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    outgoing.write(Buffer.from(value));
  }
  outgoing.end();
});

server.listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}/`));
